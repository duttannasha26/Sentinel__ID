# 🛡️ Sentinel ID

**An AI-powered document verification platform that automates border security by detecting forged credentials, analyzing document integrity, and performing real-time biometric identity matching.**

Sentinel ID streamlines the identity verification workflow for border control officers — from document capture and live face scanning to AI-driven tamper detection, biometric face matching, and final officer decision with a downloadable case report.

---

## ✨ Features

| Module | Description |
|---|---|
| **Dashboard** | Real-time overview of recent verification cases with approval / review / rejection metrics and quick access to start a new case. |
| **New Verification** | Guided multi-step workflow: document type selection → document capture (camera or upload) → live liveness face scan → AI analysis → officer decision. |
| **AI Tamper Detection** | Server-side LLM analysis extracts document fields (name, document number, nationality, DOB, expiry, etc.) and flags suspected tampering regions with a tamper score and findings overlay. |
| **Biometric Face Matching** | Compares the document photo against the live capture and returns a face-match confidence score with a descriptive summary. |
| **Judge Score** | Composite risk score combining tamper and face-match results to guide the officer's decision. |
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
- **Backend:** Base44 serverless functions (Deno runtime) + Base44 entities (MongoDB-backed)
- **AI:** Base44 Core `InvokeLLM` integration (vision-capable LLM for OCR, tamper detection, and face comparison)
- **Auth:** Base44 built-in authentication (email/password, OAuth)
- **Storage:** Base44 Core `UploadPublicFile` for document and face images
- **Reports:** Client-side Word XML generation (no server dependency)

---

## 📁 Project Structure

```
Sentinel_ID/
├── base44/
│   ├── entities/
│   │   ├── Case.jsonc                # Verification case records
│   │   └── SyntheticDocument.jsonc  # Reference document library
│   └── functions/
│       ├── analyzeDocument/entry.ts  # OCR + tamper detection
│       └── matchFaces/entry.ts       # Biometric face matching
├── src/
│   ├── pages/
│   │   ├── Home.jsx                  # Dashboard
│   │   ├── NewCase.jsx               # New verification workflow
│   │   ├── Cases.jsx                 # Case history list
│   │   ├── CaseDetail.jsx           # Case detail + decision
│   │   └── SyntheticDocuments.jsx    # Reference library
│   ├── components/
│   │   ├── layout/AppLayout.jsx      # App shell + sidebar nav
│   │   └── newcase/
│   │       ├── DocumentCapture.jsx   # Document camera/upload
│   │       ├── FaceCapture.jsx       # Liveness face scan
│   │       └── AnalysisResults.jsx   # Evidence + decision panel
│   └── lib/
│       └── reportGenerator.js        # Word .doc report generator
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

1. Clone the repository:
   ```bash
   git clone https://github.com/duttannasha26/Sentinel_ID.git
   cd Sentinel_ID
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install the Base44 CLI:
   ```bash
   npm install -g base44@latest
   ```
4. Install [Deno](https://docs.deno.com/runtime/getting_started/installation/) — the local Base44 backend runs on it.

### Run Locally

```bash
base44 login   # one-time per machine
base44 link    # one-time per clone (links to your Base44 app)
base44 dev     # starts local backend + frontend together
```

Open the frontend URL that `base44 dev` prints (typically `http://localhost:5173`).

> **Note:** Every fresh clone needs `base44 link`. It writes `base44/.app.jsonc` (the app-id pointer), which is gitignored. Your app id is in the Builder URL (`app.base44.com/apps/<id>/...`).

### Frontend Only (Hosted Backend)

```bash
base44 dev --remote
```

⚠️ In this mode writes go to your app's **production data** — plain `base44 dev` keeps everything local.

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

### SyntheticDocument Entity
| Field | Type | Description |
|---|---|---|
| `name` | string | Reference document name |
| `document_type` | enum | passport / visa / national_id / driving_license / permit |
| `image_url` | string | Reference document image |
| `notes` | string | Additional notes |

---

## 🔒 Security & Privacy

- All document and face images are uploaded via Base44 Core storage.
- AI analysis runs server-side through Base44 backend functions — API keys never exposed to the client.
- Authentication is handled by Base44's built-in auth system.
- All verification cases are auditable with officer notes and decision timestamps.

---

## 📝 License

This project is built on the [Base44](https://base44.com) platform.

## 📚 Docs & Support

- Base44 Docs: [https://docs.base44.com](https://docs.base44.com)
- GitHub Integration: [https://docs.base44.com/developers/app-code/local-development/github](https://docs.base44.com/developers/app-code/local-development/github)
- Local Development: [https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview](https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview)
- Support: [https://app.base44.com/support](https://app.base44.com/support)