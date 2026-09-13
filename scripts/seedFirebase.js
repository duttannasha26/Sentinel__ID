import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9OLBAGSL649cwzkDNAXsk0V-o-xIkYbY",
  authDomain: "sentinel-id-46bf9.firebaseapp.com",
  databaseURL: "https://sentinel-id-46bf9-default-rtdb.firebaseio.com",
  projectId: "sentinel-id-46bf9",
  storageBucket: "sentinel-id-46bf9.firebasestorage.app",
  messagingSenderId: "753089309330",
  appId: "1:753089309330:web:e41c777abeecb21e63544b",
  measurementId: "G-T1VKX2XT4L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const datasetCases = [
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
  },
  {
    id: "case-104",
    created_date: new Date(Date.now() - 3600000 * 24).toISOString(),
    document_type: "driving_license",
    document_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "ALEXANDER WRIGHT",
      license_number: "DL-8839201",
      nationality: "GBR",
      date_of_birth: "1992-03-18",
      date_of_expiry: "2031-11-05",
      gender: "M"
    },
    tamper_score: 8,
    tamper_findings: [],
    tamper_summary: "UK Driving License optical features, hologram overlay, and micro-print font metrics are valid. No tampering.",
    face_match_score: 94,
    face_match_summary: "High biometric match score. Facial keypoints match document photo with high confidence.",
    judge_score: 93,
    status: "decided",
    decision: "approved",
    officer_notes: "UK driving license verified clean. Cleared entry.",
    decided_by: "Officer Sarah Jenkins",
    decided_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "case-105",
    created_date: new Date(Date.now() - 3600000 * 36).toISOString(),
    document_type: "passport",
    document_image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "SOPHIA MÜLLER",
      passport_number: "C9028114M",
      nationality: "DEU",
      date_of_birth: "1985-07-22",
      date_of_expiry: "2032-04-12",
      gender: "F"
    },
    tamper_score: 3,
    tamper_findings: [],
    tamper_summary: "German e-Passport chip checksum and optical security thread clear. Substrate integrity perfect.",
    face_match_score: 98,
    face_match_summary: "Facial geometric ratios and thermal texture match live capture scan with near perfect confidence.",
    judge_score: 98,
    status: "decided",
    decision: "approved",
    officer_notes: "German passport cleared with highest confidence.",
    decided_by: "Officer Alex Mercer",
    decided_at: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: "case-106",
    created_date: new Date(Date.now() - 3600000 * 48).toISOString(),
    document_type: "permit",
    document_image_url: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "TARIQ AL-MANSOOR",
      permit_number: "WP-449102",
      permit_type: "Work Permit",
      issuing_country: "CAN",
      date_of_birth: "1989-12-01",
      date_of_expiry: "2027-09-30",
      gender: "M"
    },
    tamper_score: 48,
    tamper_findings: [
      { x: 50, y: 25, radius: 18, label: "Slight holographic seal misalignment" }
    ],
    tamper_summary: "Holographic security foil exhibits minor edge variance under UV light check. Secondary inspection recommended.",
    face_match_score: 75,
    face_match_summary: "Facial facial structure aligns, but facial hair changes slightly lower automated biometric score.",
    judge_score: 63,
    status: "decided",
    decision: "manual_review",
    officer_notes: "Physical work permit card requires UV lamp inspection at secondary kiosk.",
    decided_by: "Officer David Kim",
    decided_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: "case-107",
    created_date: new Date(Date.now() - 3600000 * 60).toISOString(),
    document_type: "visa",
    document_image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "CARLOS MENDEZ",
      visa_number: "V-1029384",
      visa_type: "Schengen Business",
      issuing_country: "ESP",
      date_of_birth: "1979-04-15",
      date_of_expiry: "2026-01-10",
      gender: "M"
    },
    tamper_score: 88,
    tamper_findings: [
      { x: 30, y: 45, radius: 22, label: "Altered visa expiration numbers" },
      { x: 70, y: 65, radius: 15, label: "Font weight discrepancy on issuing authority stamp" }
    ],
    tamper_summary: "Severe digital forgery: expiration date numbers modified, optical font weight mismatch found on official stamp.",
    face_match_score: 22,
    face_match_summary: "Biometric face matching failed. Live capture facial landmark distances do not match document photo.",
    judge_score: 17,
    status: "decided",
    decision: "rejected",
    officer_notes: "Fraudulent visa document detected. Person detained for border security inquiry.",
    decided_by: "Officer Sarah Jenkins",
    decided_at: new Date(Date.now() - 3600000 * 60).toISOString()
  },
  {
    id: "case-108",
    created_date: new Date(Date.now() - 3600000 * 72).toISOString(),
    document_type: "national_id",
    document_image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "YUKI TANAKA",
      id_number: "JP-9920148",
      nationality: "JPN",
      date_of_birth: "1994-09-10",
      date_of_expiry: "2034-09-10",
      gender: "F"
    },
    tamper_score: 6,
    tamper_findings: [],
    tamper_summary: "Japanese My Number card features and micro-etchings valid. No signs of alteration.",
    face_match_score: 95,
    face_match_summary: "High biometric match score. Interpupillary distance and chin structure match live capture.",
    judge_score: 95,
    status: "decided",
    decision: "approved",
    officer_notes: "Verified Japanese National ID. Approved.",
    decided_by: "Officer Alex Mercer",
    decided_at: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: "case-109",
    created_date: new Date(Date.now() - 3600000 * 84).toISOString(),
    document_type: "passport",
    document_image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "LIAM O'CONNOR",
      passport_number: "N7710293",
      nationality: "AUS",
      date_of_birth: "1983-06-30",
      date_of_expiry: "2024-05-15",
      gender: "M"
    },
    tamper_score: 78,
    tamper_findings: [
      { x: 40, y: 60, radius: 16, label: "Expiry year digit 2024 altered to 2029" }
    ],
    tamper_summary: "Document expired on 2024-05-15. Expiration digit '4' was physically scraped and overwritten with '9'.",
    face_match_score: 41,
    face_match_summary: "Moderate to low facial match. Age difference between photo and traveler is inconsistent.",
    judge_score: 32,
    status: "decided",
    decision: "rejected",
    officer_notes: "Expired document with altered expiry year. Entry refused.",
    decided_by: "Officer David Kim",
    decided_at: new Date(Date.now() - 3600000 * 84).toISOString()
  },
  {
    id: "case-110",
    created_date: new Date(Date.now() - 3600000 * 96).toISOString(),
    document_type: "driving_license",
    document_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "EMILY RODRIGUEZ",
      license_number: "CA-D992014",
      issuing_state: "California, USA",
      date_of_birth: "1996-02-14",
      date_of_expiry: "2029-02-14",
      gender: "F"
    },
    tamper_score: 9,
    tamper_findings: [],
    tamper_summary: "California Real ID bear icon and 2D barcode payload match front surface text perfectly.",
    face_match_score: 93,
    face_match_summary: "Biometric landmark alignment confirms traveler identity.",
    judge_score: 92,
    status: "decided",
    decision: "approved",
    officer_notes: "Valid California Real ID driver license. Cleared.",
    decided_by: "Officer Sarah Jenkins",
    decided_at: new Date(Date.now() - 3600000 * 96).toISOString()
  },
  {
    id: "case-111",
    created_date: new Date(Date.now() - 3600000 * 108).toISOString(),
    document_type: "permit",
    document_image_url: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "JEAN-LUC DUBOIS",
      permit_number: "FR-RES-77291",
      permit_type: "Residence Permit",
      issuing_country: "FRA",
      date_of_birth: "1975-10-08",
      date_of_expiry: "2030-10-08",
      gender: "M"
    },
    tamper_score: 7,
    tamper_findings: [],
    tamper_summary: "French Titre de Séjour residence card optical security features verified. No anomalies.",
    face_match_score: 96,
    face_match_summary: "High biometric match score against live facial scan.",
    judge_score: 95,
    status: "decided",
    decision: "approved",
    officer_notes: "French Residence Permit verified. Cleared.",
    decided_by: "Officer Alex Mercer",
    decided_at: new Date(Date.now() - 3600000 * 108).toISOString()
  },
  {
    id: "case-112",
    created_date: new Date(Date.now() - 3600000 * 120).toISOString(),
    document_type: "national_id",
    document_image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "GABRIELA SILVA",
      id_number: "RG-3829104",
      nationality: "BRA",
      date_of_birth: "1991-08-25",
      date_of_expiry: "2028-08-25",
      gender: "F"
    },
    tamper_score: 42,
    tamper_findings: [
      { x: 55, y: 75, radius: 14, label: "Surface scratch across MRZ line 2" }
    ],
    tamper_summary: "Physical surface abrasion damaged checksum digits on lower MRZ string. OCR read partially degraded.",
    face_match_score: 82,
    face_match_summary: "Biometric landmarks match well despite minor capture glare.",
    judge_score: 70,
    status: "decided",
    decision: "manual_review",
    officer_notes: "MRZ line scratched; manual data entry confirmed against chip record. Cleared after review.",
    decided_by: "Officer David Kim",
    decided_at: new Date(Date.now() - 3600000 * 120).toISOString()
  },
  {
    id: "case-113",
    created_date: new Date(Date.now() - 3600000 * 132).toISOString(),
    document_type: "passport",
    document_image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "ARJUN SHARMA",
      passport_number: "Z4829102",
      nationality: "IND",
      date_of_birth: "1987-01-19",
      date_of_expiry: "2031-01-18",
      gender: "M"
    },
    tamper_score: 11,
    tamper_findings: [],
    tamper_summary: "Republic of India e-passport ghost image and guilloche pattern intact.",
    face_match_score: 94,
    face_match_summary: "Live scan biometric vector matches document photo with high confidence.",
    judge_score: 92,
    status: "decided",
    decision: "approved",
    officer_notes: "Indian passport verified. Entry approved.",
    decided_by: "Officer Sarah Jenkins",
    decided_at: new Date(Date.now() - 3600000 * 132).toISOString()
  },
  {
    id: "case-114",
    created_date: new Date(Date.now() - 3600000 * 144).toISOString(),
    document_type: "visa",
    document_image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "MEI-LING ZHANG",
      visa_number: "UK-V-882910",
      visa_type: "Student Visa",
      issuing_country: "GBR",
      date_of_birth: "2001-11-12",
      date_of_expiry: "2025-09-30",
      gender: "F"
    },
    tamper_score: 82,
    tamper_findings: [
      { x: 35, y: 50, radius: 20, label: "Inconsistent font family in university sponsor code" },
      { x: 65, y: 30, radius: 12, label: "Digital patch overlay detected near photo margin" }
    ],
    tamper_summary: "Tampered student visa sticker: sponsor institution code exhibits non-standard typeface and photo margin shows digital paste line.",
    face_match_score: 28,
    face_match_summary: "Face match score low; biometric landmarks mismatch document photo.",
    judge_score: 23,
    status: "decided",
    decision: "rejected",
    officer_notes: "Counterfeit UK student visa. Escalated to immigration enforcement.",
    decided_by: "Officer Alex Mercer",
    decided_at: new Date(Date.now() - 3600000 * 144).toISOString()
  },
  {
    id: "case-115",
    created_date: new Date(Date.now() - 3600000 * 156).toISOString(),
    document_type: "driving_license",
    document_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
    live_face_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60",
    extracted_fields: {
      name: "BENJAMIN TAYLOR",
      license_number: "ONT-T992810",
      issuing_state: "Ontario, Canada",
      date_of_birth: "1993-05-04",
      date_of_expiry: "2028-05-04",
      gender: "M"
    },
    tamper_score: 38,
    tamper_findings: [
      { x: 45, y: 40, radius: 16, label: "Camera lens reflection over photo eye area" }
    ],
    tamper_summary: "Glare on protective laminate over facial area during document capture.",
    face_match_score: 71,
    face_match_summary: "Face match confidence moderate due to reflection glare on source image.",
    judge_score: 66,
    status: "decided",
    decision: "manual_review",
    officer_notes: "Officer requested re-scan of license to eliminate glare. Verified valid on secondary check.",
    decided_by: "Officer David Kim",
    decided_at: new Date(Date.now() - 3600000 * 156).toISOString()
  }
];

async function seedFirebase() {
  console.log(`Seeding ${datasetCases.length} cases into Firebase Firestore 'cases' collection...`);
  try {
    for (const c of datasetCases) {
      const docRef = doc(db, "cases", c.id);
      await setDoc(docRef, c, { merge: true });
      console.log(`✓ Stored case in Firebase: ${c.id} (${c.extracted_fields?.name || c.document_type})`);
    }
    console.log("SUCCESS: All 15 dataset cases stored in Firebase Firestore!");
  } catch (err) {
    console.error("ERROR seeding Firebase:", err);
    process.exit(1);
  }
}

seedFirebase();
