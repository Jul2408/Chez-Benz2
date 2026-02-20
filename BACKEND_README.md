# 🚀 Guide de Démarrage du Backend Chez-BEN2

## 📋 Prérequis
- Python 3.11+
- PostgreSQL (pour production) ou SQLite (pour développement)

## 🛠️ Installation Locale

### 1. Créer l'environnement virtuel
```powershell
python -m venv backend\venv
```

### 2. Activer l'environnement virtuel
```powershell
backend\venv\Scripts\Activate.ps1
```

### 3. Installer les dépendances
```powershell
pip install -r backend\requirements.txt
```

### 4. Configurer les variables d'environnement
Créer un fichier `backend\.env` basé sur `backend\.env.example`:
```env
DEBUG=True
SECRET_KEY=dev-secret-key-placeholder
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
SUPERUSER_USERNAME=Ocomstio
SUPERUSER_EMAIL=admin@ocomstio.com
SUPERUSER_PASSWORD=your-secret-password
```

### 5. Démarrage Rapide
```powershell
.\start-backend.ps1
```

Ce script va automatiquement:
- Nettoyer la base de données
- Créer les migrations
- Appliquer les migrations
- Créer le superutilisateur
- Démarrer le serveur sur http://localhost:8000

## 📚 Endpoints API

### Documentation Interactive
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Schema JSON**: http://localhost:8000/api/schema/

### Authentification
- `POST /api/v1/auth/register/` - Inscription
- `POST /api/v1/auth/login/` - Connexion (JWT)
- `POST /api/v1/auth/token/refresh/` - Rafraîchir le token
- `GET /api/v1/auth/me/` - Profil utilisateur

### Annonces (Listings)
- `GET /api/v1/listings/` - Liste des annonces
- `POST /api/v1/listings/` - Créer une annonce
- `GET /api/v1/listings/{id}/` - Détails d'une annonce
- `PUT /api/v1/listings/{id}/` - Modifier une annonce
- `DELETE /api/v1/listings/{id}/` - Supprimer une annonce

### Catégories
- `GET /api/v1/listings/categories/` - Liste des catégories

### Messagerie
- `GET /api/v1/messaging/conversations/` - Liste des conversations
- `POST /api/v1/messaging/conversations/{id}/send_message/` - Envoyer un message
- `GET /api/v1/messaging/conversations/{id}/messages/` - Messages d'une conversation

### Notifications
- `GET /api/v1/notifications/` - Liste des notifications

## 🔐 Authentification Frontend

### Exemple de connexion
```javascript
const response = await fetch('http://localhost:8000/api/v1/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { access, refresh } = await response.json();
localStorage.setItem('access_token', access);
localStorage.setItem('refresh_token', refresh);
```

### Exemple de requête authentifiée
```javascript
const response = await fetch('http://localhost:8000/api/v1/auth/me/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});

const user = await response.json();
```

## 🐳 Déploiement sur DigitalOcean

### Option 1: App Platform (Recommandé)

1. **Créer une base de données PostgreSQL**
   - Aller sur DigitalOcean > Databases
   - Créer une base PostgreSQL
   - Copier la connection string

2. **Créer l'application**
   - Aller sur App Platform
   - Connecter votre repository GitHub
   - Pointer vers le dossier `backend/`
   - Sélectionner le Dockerfile

3. **Configurer les variables d'environnement**
   ```
   DEBUG=False
   SECRET_KEY=your-production-secret-key
   DATABASE_URL=<connection-string-postgresql>
   ALLOWED_HOSTS=votre-app.ondigitalocean.app
   CORS_ALLOWED_ORIGINS=https://votre-frontend.vercel.app
   SUPERUSER_USERNAME=Ocomstio
   SUPERUSER_EMAIL=admin@ocomstio.com
   SUPERUSER_PASSWORD=<mot-de-passe-sécurisé>
   ```

4. **Déployer**
   - L'application va automatiquement:
     - Build le Docker image
     - Exécuter les migrations
     - Créer le superutilisateur
     - Démarrer avec Gunicorn

### Option 2: Droplet + Nginx

Voir la documentation complète dans `DEPLOYMENT.md`

## 🧪 Tests

### Tester l'API avec curl
```bash
# Inscription
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","role":"USER"}'

# Connexion
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📝 Commandes Django Utiles

```powershell
# Créer un superutilisateur manuellement
backend\venv\Scripts\python backend\manage.py createsuperuser

# Accéder au shell Django
backend\venv\Scripts\python backend\manage.py shell

# Créer une nouvelle migration
backend\venv\Scripts\python backend\manage.py makemigrations

# Appliquer les migrations
backend\venv\Scripts\python backend\manage.py migrate

# Collecter les fichiers statiques
backend\venv\Scripts\python backend\manage.py collectstatic
```

## 🔧 Dépannage

### Problème: "No module named 'django'"
```powershell
backend\venv\Scripts\pip install -r backend\requirements.txt
```

### Problème: Erreur de migration
```powershell
# Supprimer la base de données et recommencer
Remove-Item backend\db.sqlite3
.\start-backend.ps1
```

### Problème: CORS errors
Vérifier que `CORS_ALLOWED_ORIGINS` dans `.env` inclut l'URL de votre frontend.

## 📞 Support

Pour toute question, consultez:
- Documentation API: http://localhost:8000/api/docs/
- Admin Django: http://localhost:8000/admin/
