# TrackWorth – Student Finance Tracker

TrackWorth is a personalized finance tracking web app for students. It helps users monitor income, expenses, and savings over time, while offering ML-driven financial predictions and actionable insights.

## Features

- Firebase Authentication (Email/Password + Google Sign-In)
- Financial Dashboard with:
  - Income & Expense visualizations (Chart.js)
  - Monthly net worth timeline
  - Peer comparisons and category breakdowns
-  ML Model for: (Under work)
  - Predicting end-of-year net worth
  - Giving savings/investment suggestions
- Editable onboarding forms
- ⚙️ User profile settings (update email/password)
- Real-time PostgreSQL data sync (via Supabase)

## Tech Stack

| Layer        | Stack                                |
|--------------|--------------------------------------|
| Frontend     | Next.js, Tailwind CSS, Chart.js      |
| Auth         | Firebase Authentication              |
| Backend API  | Python (FastAPI or Flask)            |
| Database     | PostgreSQL (via Supabase)            |
| ML Models    | Scikit-learn (XGBoost, Linear Reg.)  |
| Hosting      | Vercel (Frontend) + Render (API)     |


##  Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/trackworth.git
cd trackworth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file with: (not pushed to git)

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
SUPABASE_URL=...
SUPABASE_KEY=...
```

### 4. Run the app locally

```bash
npm run dev
```

## 🧠 Machine Learning

Models used:

- **Linear Regression**: for predicting end-of-year savings/net worth
- **XGBoost**: for performance comparison and accuracy improvements
- **SHAP**: for explaining predictions to the user

##  Database Schema (PostgreSQL)

Tables:

- `users`: `id`, `email`, `full_name`
- `income`: `user_id`, `source`, `amount`, `month`
- `expenses`: `user_id`, `category`, `amount`, `month`
- `savings`: `user_id`, `amount`, `month`

## To-Do

- [ ] Add mobile responsiveness
- [ ] Add budgeting goals
- [ ] Improve chatbot accuracy with RAG
- [ ] Add notifications/reminders

## 🙌 Contributors

- Saugat Karki – [@yourgithub](https://github.com/yourgithub)


