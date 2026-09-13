import { base44 as rawClient } from './client';
import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, setDoc, updateDoc, query, orderBy, limit as limitQuery } from 'firebase/firestore';

import { analyzeBiometricAndDocumentMatch } from '@/lib/faceAnalyzer';
import { getStoredCases, setStoredCases, getStoredSyntheticDocs, setStoredSyntheticDocs, isForceOffline } from '@/lib/offlineManager';

// Initial local sample data for immediate local preview & fallback
const initialCases = [];

const initialSyntheticDocs = [
  {
    id: "synth-1",
    name: "US Passport Specimen 2024",
    document_type: "passport",
    image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60",
    notes: "Official benchmark reference specimen for standard e-passport validation.",
    created_date: new Date().toISOString()
  },
  {
    id: "synth-2",
    name: "EU Schengen Visa Specimen",
    document_type: "visa",
    image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60",
    notes: "Standard Schengen security optical features reference.",
    created_date: new Date().toISOString()
  }
];

let localCases = getStoredCases(initialCases);
let localSyntheticDocs = getStoredSyntheticDocs(initialSyntheticDocs);

// Mock user for local mode
const mockUser = {
  id: "user-dev-1",
  full_name: "Officer Alex Mercer",
  email: "officer.mercer@sentinel-id.gov",
  role: "border_officer"
};

// Create a proxy wrapper around raw Base44 client integrated with Firebase
export const base44 = new Proxy(rawClient, {
  get(target, prop) {
    if (prop === 'app') {
      return {
        getPublicSettings: async () => {
          try {
            return await target.app.getPublicSettings();
          } catch {
            return { id: "sentinel-id-firebase", public_settings: { name: "Sentinel ID" } };
          }
        }
      };
    }

    if (prop === 'auth') {
      return {
        me: async () => {
          try {
            return await target.auth.me();
          } catch {
            return mockUser;
          }
        },
        logout: (redirectUrl) => {
          try { target.auth.logout(redirectUrl); } catch {}
          if (redirectUrl) window.location.href = redirectUrl;
        },
        redirectToLogin: (returnTo) => {
          window.location.href = `/login${returnTo ? '?returnTo=' + encodeURIComponent(returnTo) : ''}`;
        },
        loginViaEmailPassword: async (email, password) => {
          return mockUser;
        },
        loginWithProvider: (provider, returnTo) => {
          window.location.href = returnTo || '/';
        }
      };
    }

    if (prop === 'functions') {
      return {
        invoke: async (name, payload) => {
          try {
            return await target.functions.invoke(name, payload);
          } catch {
            if (name === "analyzeDocument") {
              const docType = payload.document_type || "passport";
              const analysis = await analyzeBiometricAndDocumentMatch(
                payload.document_image_url,
                payload.live_face_image_url || payload.document_image_url,
                payload.strictness || "standard",
                docType
              );
              return {
                data: {
                  extracted_fields: analysis.extractedFields,
                  tamper_score: analysis.tamperScore,
                  tamper_findings: analysis.tamperFindings,
                  tamper_summary: analysis.tamperSummary
                }
              };
            }
            if (name === "matchFaces") {
              const analysis = await analyzeBiometricAndDocumentMatch(
                payload.document_image_url,
                payload.live_face_image_url,
                payload.strictness || "standard",
                payload.document_type || "passport"
              );
              return {
                data: {
                  face_match_score: analysis.faceMatchScore,
                  face_match_summary: analysis.faceMatchSummary
                }
              };
            }
            return { data: {} };
          }
        }
      };
    }

    if (prop === 'entities') {
      return {
        Case: {
          list: async (order, limitVal = 100) => {
            if (!isForceOffline()) {
              try {
                const snap = await getDocs(collection(db, "cases"));
                if (!snap.empty) {
                  const fbCases = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
                  fbCases.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
                  return fbCases.slice(0, limitVal);
                }
              } catch (err) {
                console.warn("Firebase case fetch fallback:", err);
              }
            }
            return localCases.slice(0, limitVal);
          },
          get: async (id) => {
            if (!isForceOffline()) {
              try {
                const docSnap = await getDoc(doc(db, "cases", id));
                if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
              } catch (err) {
                console.warn("Firebase get case fallback:", err);
              }
            }
            return localCases.find(c => c.id === id) || localCases[0];
          },
          create: async (data) => {
            const id = "case-" + Date.now();
            const newCase = {
              id,
              created_date: new Date().toISOString(),
              decision: "pending",
              officer_notes: "",
              ...data
            };
            if (!isForceOffline()) {
              try {
                await setDoc(doc(db, "cases", id), newCase);
              } catch (err) {
                console.warn("Firebase create case fallback:", err);
              }
            }
            localCases = [newCase, ...localCases];
            setStoredCases(localCases);
            return newCase;
          },
          update: async (id, data) => {
            if (!isForceOffline()) {
              try {
                await updateDoc(doc(db, "cases", id), data);
              } catch (err) {
                try { await setDoc(doc(db, "cases", id), data, { merge: true }); } catch {}
              }
            }
            const index = localCases.findIndex(c => c.id === id);
            if (index !== -1) {
              localCases[index] = { ...localCases[index], ...data };
              setStoredCases(localCases);
              return localCases[index];
            }
            const created = { id, ...data };
            localCases = [created, ...localCases];
            setStoredCases(localCases);
            return created;
          }
        },
        SyntheticDocument: {
          list: async (order, limitVal = 100) => {
            if (!isForceOffline()) {
              try {
                const snap = await getDocs(collection(db, "synthetic_documents"));
                if (!snap.empty) {
                  const fbDocs = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
                  fbDocs.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
                  return fbDocs.slice(0, limitVal);
                }
              } catch (err) {
                console.warn("Firebase synthetic docs fallback:", err);
              }
            }
            return localSyntheticDocs.slice(0, limitVal);
          },
          create: async (data) => {
            const id = "synth-" + Date.now();
            const newDoc = {
              id,
              created_date: new Date().toISOString(),
              ...data
            };
            if (!isForceOffline()) {
              try {
                await setDoc(doc(db, "synthetic_documents", id), newDoc);
              } catch (err) {
                console.warn("Firebase create synth doc fallback:", err);
              }
            }
            localSyntheticDocs = [newDoc, ...localSyntheticDocs];
            setStoredSyntheticDocs(localSyntheticDocs);
            return newDoc;
          }
        }
      };
    }

    return target[prop];
  }
});

export default base44;
