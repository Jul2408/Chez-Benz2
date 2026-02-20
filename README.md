# Chez-BEN2 🇨🇲

> **Chez-BEN2** est une marketplace moderne conçue pour simplifier l'achat et la vente de proximité. La plateforme connecte particuliers et professionnels via une interface fluide intégrant des **petites annonces**, une **messagerie instantanée** et un système de **notifications intelligent**.

---

## 🏗️ Structure du Projet (Monorepo)

```
Chez-BEN2/
├── frontend/       → Application Next.js (React, TypeScript, Tailwind CSS)
└── backend/        → API Django REST Framework (Python)
```

---

## 🚀 Stack Technique

| Partie     | Technologies                                          |
|------------|-------------------------------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS                  |
| Backend    | Django 4.2, Django REST Framework, JWT Auth           |
| Base de données | PostgreSQL (prod) / SQLite (dev)                 |
| Hébergement | Vercel (frontend) + O2Switch (backend)               |

---

## ⚙️ Lancer le projet en local

### Backend (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:8000
- **Admin Django** → http://localhost:8000/admin

---

## 🔐 Variables d'Environnement

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```
DEBUG=True
SECRET_KEY=your_development_secret_key
DATABASE_URL=postgres://user:pass@host:port/dbname
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 📄 License

MIT License - Chez-BEN2 © 2026
