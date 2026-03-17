# 👻 GhostWriter Guard

> AI text detection for academic integrity — detects AI-written assignments sentence by sentence.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green)
![React](https://img.shields.io/badge/React-18-blue)
![Accuracy](https://img.shields.io/badge/Accuracy-94%25-brightgreen)

---

## 🧠 What It Does

GhostWriter Guard analyzes submitted text and flags AI-written content at the sentence level:

- 🟢 **Green** = Human written
- 🟡 **Yellow** = Uncertain
- 🔴 **Red** = AI written

It uses **3 signals** fused together:
1. **GPT-2 Perplexity** — measures how "predictable" the text is
2. **Burstiness** — measures variation in sentence lengths
3. **ML Classifier** — LogisticRegression trained on 50K+ HC3 samples

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
│   │   ├── classifier.py        # LogisticRegression inference
│   │   └── fusion.py            # Combine 3 signals into final score
│   └── models/
│       ├── train_classifier.py  # Training script (HC3 corpus)
│       └── model.pkl            # Trained model (generated)
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TextInput.jsx        # Paste area + submit button
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
│   ├── download_hc3.py          # Fetch HC3 corpus from HuggingFace
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

# Run the server
cd ..
python -m uvicorn backend.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`
Backend runs at `http://localhost:8000`

---

## 📡 API Reference

### `POST /api/analyze`

Analyzes text for AI authorship sentence by sentence.

**Request:**
```json
{
  "text": "The mitochondria is the powerhouse of the cell. I went to the store yesterday."
}
```

**Response:**
```json
{
  "sentences": [
    { "sentence": "The mitochondria is the powerhouse of the cell.", "score": 0.72 },
    { "sentence": "I went to the store yesterday.", "score": 0.31 }
  ],
  "overall_score": 0.51
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

Interactive docs available at: `http://localhost:8000/docs`

---

## 🔬 ML Pipeline

```
Input Text
    │
    ├─► perplexity.py   → GPT-2 perplexity score (low = AI-like)
    ├─► burstiness.py   → Sentence length std dev (low = AI-like)
    └─► classifier.py   → LogisticRegression P(AI)
            │
            ▼
        fusion.py
    (ML×0.55 + Perplexity×0.25 + Burstiness×0.20)
            │
            ▼
    Final Score [0, 1]
```

### Training

- **Dataset:** HC3 corpus (50K+ human + ChatGPT answers)
- **Features:** perplexity proxy, burstiness, avg word length, punctuation ratio
- **Model:** LogisticRegression (scikit-learn)
- **Accuracy:** ~94% on test set

---

## 🧪 Testing

```bash
# Test ML pipeline accuracy
python -m pytest tests/test_pipeline.py

# Test API endpoints
python -m pytest tests/test_api.py
```

---

## 🌿 Git Workflow

```bash
# Each member works on their branch
git checkout backend        # Atharva + Aman
git checkout ml-pipeline    # Harshad + Piyush
git checkout frontend       # Palak + Vedika

# Merge to main when ready
git switch main
git merge <your-branch>
git push origin main
```

---

## 📦 Dependencies

### Backend
- FastAPI + Uvicorn
- HuggingFace Transformers (GPT-2)
- scikit-learn + joblib
- spaCy + NLTK
- pandas + numpy

### Frontend
- React 18 + Vite
- Tailwind CSS
- Axios
- jsPDF + html2canvas

---

## 📄 License

MIT License — built for academic integrity research.

---

*Built with ❤️ by Team GhostWriter Guard*
