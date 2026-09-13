# 🛡️ Sentinel ID

**An AI-powered document verification platform that automates border security by detecting forged credentials, analyzing document integrity, performing real-time biometric identity matching, and persisting case records to Firebase.**

Sentinel ID streamlines the identity verification workflow for border control officers — from document capture and live face scanning to AI-driven tamper detection, biometric face matching, Firebase data persistence, and final officer decision with a downloadable case report.

---

## ✨ Features

| Module | Description |
|---|---|
| **Dashboard** | Real-time overview of recent verification cases with approval / review / rejection metrics and quick access to start a new case. |
| **New Verification** | Guided multi-step workflow: document type selection → document capture (camera or upload) → live liveness face scan → AI analysis → officer decision. |
| **AI Tamper Detection** | Server-side LLM analysis extracts document fields (name, document number, nationality, DOB, expiry, etc.) and flags suspected tampering regions with a tamper score and findings overlay. |
| **Biometric Face Matching** | Compares the document photo against the live capture and returns a face-match confidence score with a descriptive summary. |
| **Judge Score** | Composite risk score combining tamper and face-match results to guide the officer's decision. |
| **Firebase Integration** | Realtime Database & Firestore synchronization for instant cloud case persistence and reference documents. |
| **Case History** | Searchable, navigable list of all past cases with status badges and document previews. |
| **Case Detail** | Full evidence review — document image with tamper overlays, live face capture, extracted fields, scores, and a decision panel (approve / manual review / reject) with officer notes. |
| **Downloadable Report** | One-click export of a completed case as a Microsoft Word-compatible `.doc` report. |
| **Reference Library** | Manage a database of synthetic reference documents used for verification benchmarking. |

---

## 🧠 How It Works

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Capture    │ ──▶ │  AI Analysis │ ──▶ │  Face Matching  │ ──▶ │  Judge Score │ ──▶ │  Decision   │
│  Doc + Face │     │  OCR + Tamper│     │  Biometric Live │     │  Composite   │     │  + Report   │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘     └─────────────┘
```

1. **Capture** — Officer selects a document type and captures the document image (camera or file upload), then performs a guided liveness scan (center face → blink → turn head) to capture a live face image.
2. **AI Analysis** — The `analyzeDocument` backend function uses a vision LLM to extract structured fields and detect tampering, returning a tamper score, findings (regions with x/y/radius/label), and a summary.
3. **Face Matching** — The `matchFaces` backend function compares the document photo against the live capture and returns a face-match score (0–100) with an explanation.
4. **Judge Score** — A composite score is calculated from the tamper and face-match results to guide the officer.
5. **Decision** — The officer reviews all evidence, adds notes, and records a decision (approved / manual review / rejected). A Word-compatible case report can then be downloaded.

---

## 🏗️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui + Lucide icons + Framer Motion
- **Backend:** Base44 serverless functions + Base44 SDK client
- **Database:** Firebase Firestore (`sentinel-id-46bf9`) & Realtime Database
- **AI:** Base44 Core `InvokeLLM` integration (vision-capable LLM for OCR, tamper detection, and face comparison)
- **Reports:** Client-side Word XML generation (no server dependency)

---

## 📁 Project Structure

```
Sentinel_ID/
├── files/
│   ├── entities/
│   │   ├── case.jsonc                # Verification case records schema
│   │   └── syntheticDocument.jsonc  # Reference document library schema
│   └── funtions/
│       ├── analyzeDocument/entry.ts  # OCR + tamper detection
│       └── matchFaces/entry.ts       # Biometric face matching
├── src/
│   ├── api/
│   │   ├── client.js                 # Base44 SDK client
│   │   └── base44Client.js           # SDK proxy with Firebase persistence
│   ├── lib/
│   │   ├── firebase.js               # Firebase App & Firestore config
│   │   └── reportGenerator.js        # Word .doc report generator
│   ├── pages/
│   │   ├── Home.jsx                  # Dashboard
│   │   ├── NewCase.jsx               # New verification workflow
│   │   ├── Cases.jsx                 # Case history list
│   │   ├── CaseDetail.jsx           # Case detail + decision
│   │   └── SyntheticDocuments.jsx    # Reference library
│   └── components/
│       ├── layout/AppLayout.jsx      # App shell + sidebar nav
│       └── newcase/
│           ├── DocumentCapture.jsx   # Document camera/upload
│           ├── FaceCapture.jsx       # Liveness face scan
│           └── AnalysisResults.jsx   # Evidence + decision panel
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

1. Clone the repository:
   ```bash
   git clone https://github.com/duttannasha26/Sentinel__ID.git
   cd Sentinel__ID
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📊 Data Model

### Case Entity
| Field | Type | Description |
|---|---|---|
| `document_type` | enum | passport / visa / national_id / driving_license / permit |
| `document_image_url` | string | Uploaded document image |
| `live_face_image_url` | string | Uploaded live face capture |
| `extracted_fields` | object | LLM-extracted document fields |
| `tamper_score` | number | 0–100 tamper risk score |
| `tamper_findings` | array | Detected tamper regions (x, y, radius, label) |
| `tamper_summary` | string | LLM tamper analysis summary |
| `face_match_score` | number | 0–100 biometric match score |
| `face_match_summary` | string | LLM face match explanation |
| `judge_score` | number | Composite risk score |
| `status` | enum | capturing / analyzed / decided |
| `decision` | enum | pending / approved / manual_review / rejected |
| `officer_notes` | string | Officer's notes |
| `decided_by` | string | Officer identifier |
| `decided_at` | string | Decision timestamp |

---

## 🔒 Security & Privacy

- All verification cases are auditable with officer notes and decision timestamps.
- Firebase integration provides secure cloud data synchronization.

---

## 📝 License

This project is open-source under the MIT License.