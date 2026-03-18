# 👻 GhostWriter Guard

> AI text detection for academic integrity — detects AI-written assignments sentence by sentence.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green)
![React](https://img.shields.io/badge/React-18-blue)
![Accuracy](https://img.shields.io/badge/Accuracy-93.4%25-brightgreen)
![Deployed](https://img.shields.io/badge/Deployed-Railway-blueviolet)

---

## 🌐 Live Demo

**Frontend:** https://ghostwriter-guard-production.up.railway.app

**Backend API:** https://caring-charm-production-41d0.up.railway.app

**API Docs:** https://caring-charm-production-41d0.up.railway.app/docs

---

## 🎯 What It Does

GhostWriter Guard analyzes submitted text and flags AI-written content at the sentence level:

- 🟢 **Green** = Human written (0–35%)
- 🟡 **Yellow** = Uncertain (35–65%)
- 🔴 **Red** = AI written (65–100%)

---

## 🔬 How It Works

3 signals fused together into a final score:

```
Input Text
    │
    ├─► GPT-2 Perplexity   → How "predictable" is the text?
    ├─► Burstiness          → How varied are sentence lengths?
    └─► 8-Feature Classifier → ML model trained on 1.3M+ samples
            │
            ▼
        Fusion Engine
    (ML×0.70 + Perplexity×0.20 + Burstiness×0.10)
            │
            ▼
    Final Score [0.0 → 1.0]
```

### 8 Detection Features
| Feature | Signal |
|---------|--------|
| Vocabulary uniqueness | AI uses more unique words |
| Average word length | AI uses longer words |
| Sentence length variation | Human varies more |
| Punctuation ratio | Different patterns |
| Average sentence length | AI tends to be longer |
| Filler words | Human: "honestly", "tbh", "kinda" |
| Formal words | AI: "furthermore", "moreover", "consequently" |
| Contractions | Human: "don't", "can't", "i'm" |

---

## ✅ Test Results

| Input | Score | Result |
|-------|-------|--------|
| Pure AI paragraph | 94% | 🔴 Correctly detected |
| Pure Human text | 24% | 🟢 Correctly detected |
| Mixed paragraph (4AI + 4Human) | 58% | 🟡 Perfect split |
| Student mixing AI+Human | 55% | 🟡 Correctly uncertain |

---

## ✨ Features

- 📄 **PDF Upload** — upload assignment PDFs directly
- 🎨 **Sentence Heatmap** — color-coded per sentence with confidence bar
- 📊 **Score Badge** — circular progress with verdict
- 📋 **Analysis Summary** — intelligent verdict explanation
- 📥 **PDF Report** — download forensic analysis report
- 🌙 **Dark Theme** — professional dark UI
- 🧪 **Sample Texts** — one-click AI/Human/Mixed test samples
- 📋 **Copy Button** — copy any sentence on hover
- ⚡ **Progress Bar** — shows analysis steps in real time

---

## 👥 Team

| Name | Role | Branch |
|------|------|--------|
| **Atharva Vavhal** | Team Lead + Backend | `backend` |
| **Harshad** | ML Engineer | `ml-pipeline` |
| **Aman** | Backend Developer | `backend` |
| **Piyush** | Data Scientist | `ml-pipeline` |
| **Palak** | Frontend Developer | `frontend` |
| **Vedika** | Frontend UI/UX | `frontend` |

---

## 🗂️ Project Structure

```
ghostwriter-guard/
├── backend/
│   ├── main.py                  # FastAPI app + CORS
│   ├── schemas.py               # Pydantic models
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Railway deployment
│   ├── routers/
│   │   └── analyze.py           # POST /api/analyze
│   ├── pipeline/
│   │   ├── perplexity.py        # Perplexity scoring
│   │   ├── burstiness.py        # Sentence variation
│   │   ├── classifier.py        # 8-feature inference
│   │   └── fusion.py            # Signal fusion
│   └── models/
│       ├── train_classifier.py  # Training script
│       └── model.pkl            # Trained model (93.4%)
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TextInput.jsx        # Input + PDF upload
│       │   ├── SentenceHeatmap.jsx  # Color heatmap
│       │   ├── ScoreBadge.jsx       # Score display
│       │   ├── DownloadReport.jsx   # PDF export
│       │   └── Loader.jsx           # Progress bar
│       ├── pages/
│       │   └── Home.jsx             # Main layout
│       └── utils/
│           ├── api.js               # Axios calls
│           └── colorScale.js        # HSL color logic
├── dataset/
│   ├── download_hc3.py
│   └── preprocess.py
├── tests/
│   ├── test_pipeline.py
│   └── test_api.py
└── README.md
```

---

## 🚀 Getting Started (Local)

### Backend Setup

```bash
git clone https://github.com/AtharvaVavhal/ghostwriter-guard.git
cd ghostwriter-guard

pyenv global 3.11.9
pip install -r backend/requirements.txt
python -c "import nltk; nltk.download('punkt_tab')"
python backend/models/train_classifier.py

cd backend
python -m uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## 📡 API Reference

### `POST /api/analyze`

**Request:**
```json
{ "text": "Your text here..." }
```

**Response:**
```json
{
  "sentences": [
    { "sentence": "Sentence 1", "score": 0.94 },
    { "sentence": "Sentence 2", "score": 0.24 }
  ],
  "overall_score": 0.59
}
```

### `GET /health`
```json
{ "status": "ok" }
```

---

## 🧪 Training Details

- **Dataset:** artem9k/ai-text-detection-pile (1.3M samples)
- **Training samples:** 5,000 human + 5,000 AI
- **Features:** 8 linguistic features
- **Model:** LogisticRegression with StandardScaler
- **Accuracy:** 93.4% on test set

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + Uvicorn |
| ML | scikit-learn LogisticRegression |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| PDF Export | jsPDF + html2canvas |
| Deployment | Railway |

---

## 🔗 Links

- 🐙 GitHub: [AtharvaVavhal/ghostwriter-guard](https://github.com/AtharvaVavhal/ghostwriter-guard)
- 🌐 Live: [ghostwriter-guard-production.up.railway.app](https://ghostwriter-guard-production.up.railway.app)
- 💼 LinkedIn: [Project Post](https://www.linkedin.com/posts/atharva-vavhal_machinelearning-ai-python-activity-7439914236039958528-1sf7)

---

*Built with ❤️ by Team GhostWriter Guard*
