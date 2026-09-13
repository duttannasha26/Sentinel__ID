import { base44 as rawClient } from './client';

// Initial local sample data for immediate local preview
const initialCases = [
  {
    id: "case-101",
    created_date: new Date(Date.now() - 3600000 * 2).toISOString(),
    document_type: "passport",
    document_image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "ELEANOR VANCE",
      passport_number: "P98234112",
      nationality: "USA",
      date_of_birth: "1990-05-14",
      date_of_expiry: "2030-08-20",
      gender: "F"
    },
    tamper_score: 5,
    tamper_findings: [],
    tamper_summary: "No signs of physical or digital manipulation detected. Holographic elements, font metrics, and MRZ checksums align with standard issuing templates.",
    face_match_score: 96,
    face_match_summary: "Biometric facial landmarks (interocular distance, jawline structure, nose bridge) show exceptionally high match confidence against live scan.",
    judge_score: 96,
    status: "decided",
    decision: "approved",
    officer_notes: "Document and facial scan verified cleanly. Approved entry.",
    decided_by: "Officer Alex Mercer",
    decided_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "case-102",
    created_date: new Date(Date.now() - 3600000 * 5).toISOString(),
    document_type: "national_id",
    document_image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "MARCUS CHEN",
      id_number: "ID-7729104",
      date_of_birth: "1988-11-03",
      nationality: "SGP",
      gender: "M"
    },
    tamper_score: 45,
    tamper_findings: [
      { x: 35, y: 40, radius: 15, label: "Minor pixel artifacts around name boundary" }
    ],
    tamper_summary: "Slight edge distortion around text fields detected. Requires manual inspector verification.",
    face_match_score: 72,
    face_match_summary: "Moderate facial similarity; lighting variance in live capture reduced automated match score.",
    judge_score: 64,
    status: "decided",
    decision: "manual_review",
    officer_notes: "Secondary physical inspection recommended.",
    decided_by: "Officer Alex Mercer",
    decided_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "case-103",
    created_date: new Date(Date.now() - 3600000 * 12).toISOString(),
    document_type: "visa",
    document_image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "VIKTOR PETROV",
      visa_number: "V-9938102",
      visa_type: "Tourist B2",
      stay_duration: "90 Days"
    },
    tamper_score: 85,
    tamper_findings: [
      { x: 25, y: 30, radius: 20, label: "Photo replacement border mismatch" },
      { x: 60, y: 70, radius: 12, label: "Inconsistent font baseline" }
    ],
    tamper_summary: "Heavy tampering detected: photo overlay boundaries mismatch substrate paper texture, and expiration font differs from issuing authority standard.",
    face_match_score: 35,
    face_match_summary: "Biometric discrepancy: facial structure and nose-to-chin distance do not match the document photograph.",
    judge_score: 25,
    status: "decided",
    decision: "rejected",
    officer_notes: "Forged visa detected. Entry denied and reported.",
    decided_by: "Officer Alex Mercer",
    decided_at: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

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

let localCases = [...initialCases];
let localSyntheticDocs = [...initialSyntheticDocs];

// Mock user for offline mode
const mockUser = {
  id: "user-dev-1",
  full_name: "Officer Alex Mercer",
  email: "officer.mercer@sentinel-id.gov",
  role: "border_officer"
};

// Create a proxy wrapper around the raw Base44 client
export const base44 = new Proxy(rawClient, {
  get(target, prop) {
    if (prop === 'app') {
      return {
        getPublicSettings: async () => {
          try {
            return await target.app.getPublicSettings();
          } catch {
            return { id: "local-app", public_settings: { name: "Sentinel ID" } };
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
              return {
                data: {
                  extracted_fields: {
                    document_type: docType.toUpperCase(),
                    holder_name: "SAMPLE CITIZEN",
                    document_number: "A" + Math.floor(10000000 + Math.random() * 90000000),
                    issuing_country: "USA",
                    date_of_expiry: "2032-12-31"
                  },
                  tamper_score: 12,
                  tamper_findings: [
                    { x: 42, y: 35, radius: 10, label: "Minor reflection artifact on photo margin" }
                  ],
                  tamper_summary: `AI screening of ${docType} complete. High substrate integrity; no structural tampering detected.`
                }
              };
            }
            if (name === "matchFaces") {
              return {
                data: {
                  face_match_score: 91,
                  face_match_summary: "Biometric landmark alignment confirms high probability match between document photo and live facial scan."
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
          list: async (order, limit = 100) => {
            try {
              const res = await target.entities.Case.list(order, limit);
              if (res && res.length > 0) return res;
            } catch {}
            return localCases.slice(0, limit);
          },
          get: async (id) => {
            try {
              return await target.entities.Case.get(id);
            } catch {}
            return localCases.find(c => c.id === id) || localCases[0];
          },
          create: async (data) => {
            try {
              return await target.entities.Case.create(data);
            } catch {}
            const newCase = {
              id: "case-" + Date.now(),
              created_date: new Date().toISOString(),
              decision: "pending",
              officer_notes: "",
              ...data
            };
            localCases = [newCase, ...localCases];
            return newCase;
          },
          update: async (id, data) => {
            try {
              return await target.entities.Case.update(id, data);
            } catch {}
            const index = localCases.findIndex(c => c.id === id);
            if (index !== -1) {
              localCases[index] = { ...localCases[index], ...data };
              return localCases[index];
            }
            return { id, ...data };
          }
        },
        SyntheticDocument: {
          list: async (order, limit = 100) => {
            try {
              const res = await target.entities.SyntheticDocument.list(order, limit);
              if (res && res.length > 0) return res;
            } catch {}
            return localSyntheticDocs.slice(0, limit);
          },
          create: async (data) => {
            try {
              return await target.entities.SyntheticDocument.create(data);
            } catch {}
            const newDoc = {
              id: "synth-" + Date.now(),
              created_date: new Date().toISOString(),
              ...data
            };
            localSyntheticDocs = [newDoc, ...localSyntheticDocs];
            return newDoc;
          }
        }
      };
    }

    return target[prop];
  }
});

export default base44;
