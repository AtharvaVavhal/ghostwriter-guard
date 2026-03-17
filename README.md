# 👻 GhostWriter Guard

> AI text detection for academic integrity — detects AI-written assignments sentence by sentence.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green)
![React](https://img.shields.io/badge/React-18-blue)
![Accuracy](https://img.shields.io/badge/Accuracy-93.4%25-brightgreen)

---

## 🧠 What It Does

GhostWriter Guard analyzes submitted text and flags AI-written content at the sentence level:

- 🟢 **Green** = Human written (0–35%)
- 🟡 **Yellow** = Uncertain (35–65%)
- 🔴 **Red** = AI written (65–100%)

It uses **3 signals** fused together:
1. **GPT-2 Perplexity** — measures how "predictable" the text is
2. **Burstiness** — measures variation in sentence lengths
3. **ML Classifier** — LogisticRegression trained on 1.3M+ samples (93.4% accuracy)

### 🔬 8-Feature ML Detection
The classifier detects AI text using:
- Vocabulary uniqueness ratio
- Average word length
- Sentence length variation (burstiness)
- Punctuation ratio
- Average sentence length
- Filler words ratio (human: "honestly", "tbh", "kinda")
- Formal words ratio (AI: "furthermore", "moreover", "consequently")
- Contraction usage (human: "don't", "can't", "i'm")

---

## ✅ Test Results

| Input | Score | Result |
|-------|-------|--------|
| Pure AI paragraph | 95% | 🔴 Correctly detected |
| Pure Human text | 26% | 🟢 Correctly detected |
| Mixed paragraph | 61% | 🟡 Correctly uncertain |
| Mixed 8-sentence text | 4 AI + 4 Human | ✅ Perfect split |

---

## 👥 Team

| Name | Role | Branch | Files |
|------|------|--------|-------|
| Atharva | Team Lead + Backend | `backend` | `main.py`, `schemas.py`, `routers/analyze.py`, `pipeline/*` |
| Harshad | ML Engineer | `ml-pipeline` | `pipeline/perplexity.py`, `pipeline/burstiness.py`, `pipeline/fusion.py` |
| Piyush | Data Scientist | `ml-pipeline` | `models/train_classifier.py`, `models/model.pkl` |
| Aman | Backend Developer | `backend` | `routers/analyze.py`, `schemas.py` |
| Palak | Frontend Developer | `frontend` | `TextInput.jsx`, `SentenceHeatmap.jsx`, `ScoreBadge.jsx`, `Loader.jsx` |
| Vedika | Frontend UI/UX | `frontend` | `DownloadReport.jsx`, `colorScale.js`, `index.css`, `tailwind.config.js` |

---

## 🗂️ Project Structure

```
ghostwriter-guard/
├── backend/
│   ├── main.py                  # FastAPI app + CORS setup
│   ├── schemas.py               # Pydantic request/response models
│   ├── requirements.txt         # Python dependencies
│   ├── routers/
│   │   └── analyze.py           # POST /api/analyze endpoint
│   ├── pipeline/
│   │   ├── perplexity.py        # GPT-2 perplexity scoring
│   │   ├── burstiness.py        # Sentence length std dev
│   │   ├── classifier.py        # LogisticRegression inference (8 features)
│   │   └── fusion.py            # Combine 3 signals into final score
│   └── models/
│       ├── train_classifier.py  # Training script (1.3M sample dataset)
│       └── model.pkl            # Trained model (93.4% accuracy)
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TextInput.jsx        # Paste area + PDF upload
│       │   ├── SentenceHeatmap.jsx  # HSL colour per sentence
│       │   ├── ScoreBadge.jsx       # Overall AI % display
│       │   ├── DownloadReport.jsx   # jsPDF + html2canvas export
│       │   └── Loader.jsx           # Spinner during API call
│       ├── pages/
│       │   └── Home.jsx             # Main page layout
│       └── utils/
│           ├── api.js               # Axios call to FastAPI
│           └── colorScale.js        # Score to HSL colour logic
├── dataset/
│   ├── download_hc3.py          # Fetch dataset from HuggingFace
│   └── preprocess.py            # Clean and split train/test
├── tests/
│   ├── test_pipeline.py         # ML accuracy tests
│   ├── test_api.py              # FastAPI endpoint tests
│   ├── sample_ai.txt            # Known AI-written samples
│   └── sample_human.txt         # Known human-written samples
├── README.md
├── .gitignore
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11
- Node.js 18+
- pyenv (recommended)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/AtharvaVavhal/ghostwriter-guard.git
cd ghostwriter-guard

# Set Python version
pyenv global 3.11.9

# Install dependencies
cd backend
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt_tab')"

# Train the classifier (first time only)
python models/train_classifier.py

# Run the server (from project root)
cd ..
python -m uvicorn backend.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm install axios pdfjs-dist jspdf html2canvas
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

---

## 📡 API Reference

### `POST /api/analyze`

**Request:**
```json
{
  "text": "Your text here..."
}
```

**Response:**
```json
{
  "sentences": [
    { "sentence": "Sentence 1", "score": 0.95 },
    { "sentence": "Sentence 2", "score": 0.24 }
  ],
  "overall_score": 0.58
}
```

**Score interpretation:**
| Score | Label | Color |
|-------|-------|-------|
| 0.0 – 0.35 | Human | 🟢 Green |
| 0.35 – 0.65 | Uncertain | 🟡 Yellow |
| 0.65 – 1.0 | AI | 🔴 Red |

### `GET /health`
```json
{ "status": "ok" }
```

---

## 🔬 ML Pipeline

```
Input Text
    │
    ├─► perplexity.py   → GPT-2 perplexity score
    ├─► burstiness.py   → Sentence length variation
    └─► classifier.py   → 8-feature LogisticRegression P(AI)
            │
            ▼
        fusion.py
    (ML×0.70 + Perplexity×0.20 + Burstiness×0.10)
            │
            ▼
    Final Score [0, 1]
```

### Training Details
- **Dataset:** artem9k/ai-text-detection-pile (1.3M samples)
- **Training samples:** 5,000 human + 5,000 AI
- **Features:** 8 linguistic features
- **Model:** LogisticRegression with StandardScaler
- **Accuracy:** 93.4% on test set

---

## ✨ Features

- 📄 **PDF Upload** — upload assignment PDFs directly
- 🎨 **Sentence Heatmap** — color-coded sentence analysis
- 📊 **Score Badge** — circular progress indicator
- 📥 **PDF Report** — download forensic analysis report
- 🌙 **Dark Theme** — professional dark UI
- ⚡ **Fast API** — FastAPI backend with async support

---

## 🧪 Testing

```bash
python -m pytest tests/test_pipeline.py
python -m pytest tests/test_api.py
```

---

## 🌿 Git Workflow

```bash
git checkout backend        # Atharva + Aman
git checkout ml-pipeline    # Harshad + Piyush
git checkout frontend       # Palak + Vedika

git switch main
git merge <your-branch>
git push origin main
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + Uvicorn |
| ML | scikit-learn + GPT-2 |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| PDF | jsPDF + html2canvas |
| Dataset | HuggingFace Datasets |

---

*Built with ❤️ by Team GhostWriter Guard — Vishwakarma Institute of Technology, Pune*
