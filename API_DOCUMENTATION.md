# API Documentation - Chez-BEN2

Documentation complète des endpoints API de la plateforme Chez-BEN2.

## Base URL

```
http://localhost:3000/api
```

## Format des réponses

Toutes les réponses suivent un format standardisé :

### Succès
```json
{
  "success": true,
  "data": { ... },
  "message": "Message optionnel",
  "pagination": { ... } // Si applicable
}
```

### Erreur
```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

---

## 🔐 Authentification

### Inscription
**POST** `/api/auth/signup`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "Jean Dupont",
  "phone": "+237670000000",
  "city": "Douala",
  "region": "Littoral"
}
```

**Réponse:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "profile": { ... },
    "session": { ... }
  },
  "message": "Inscription réussie ! Bienvenue sur Chez-BEN2."
}
```

### Connexion
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Réponse:** `200 OK`

### Déconnexion
**POST** `/api/auth/logout`

**Réponse:** `200 OK`

---

## 📢 Annonces

### Lister les annonces
**GET** `/api/annonces`

**Query Parameters:**
- `page` (number) - Numéro de page (défaut: 1)
- `limit` (number) - Résultats par page (défaut: 20, max: 100)
- `category` (uuid) - Filtrer par catégorie
- `city` (string) - Filtrer par ville
- `region` (string) - Filtrer par région
- `minPrice` (number) - Prix minimum
- `maxPrice` (number) - Prix maximum
- `etat` (enum) - NEUF | OCCASION | RECONDITIONNE
- `search` (string) - Recherche textuelle
- `sort` (enum) - recent | price_asc | price_desc | popular
- `userId` (uuid) - Filtrer par utilisateur

**Exemple:**
```
GET /api/annonces?city=Douala&minPrice=10000&maxPrice=100000&sort=price_asc&limit=20
```

**Réponse:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "iPhone 13 Pro Max",
      "price": 450000,
      "city": "Douala",
      "coverImage": "https://...",
      "user": { ... },
      "category": { ... },
      "photos": [ ... ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Créer une annonce
**POST** `/api/annonces`

🔒 **Authentification requise**

**Body:**
```json
{
  "title": "iPhone 13 Pro Max 256GB",
  "description": "iPhone en excellent état...",
  "price": 450000,
  "priceNegotiable": true,
  "categoryId": "uuid-category",
  "etat": "OCCASION",
  "city": "Douala",
  "region": "Littoral",
  "quartier": "Akwa",
  "images": [
    {
      "url": "https://...",
      "thumbnailUrl": "https://...",
      "filename": "iphone.jpg",
      "width": 1200,
      "height": 800
    }
  ],
  "attributes": {
    "marque": "Apple",
    "stockage": "256GB"
  }
}
```

**Réponse:** `201 Created`

### Détail d'une annonce
**GET** `/api/annonces/:id`

**Réponse:** `200 OK`

### Modifier une annonce
**PUT** `/api/annonces/:id`

🔒 **Authentification requise** (propriétaire ou admin)

**Body:** Mêmes champs que la création (tous optionnels)

**Réponse:** `200 OK`

### Supprimer une annonce
**DELETE** `/api/annonces/:id`

🔒 **Authentification requise** (propriétaire ou admin)

**Réponse:** `200 OK`

---

## 💬 Messages

### Lister les conversations
**GET** `/api/messages`

🔒 **Authentification requise**

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `type` (enum) - ANNONCE | SUPPORT | MODERATION
- `archived` (boolean) - Inclure archivées

**Réponse:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "ANNONCE",
      "annonce": { ... },
      "otherUser": { ... },
      "lastMessageAt": "2026-02-08T10:30:00Z",
      "lastMessagePreview": "Bonjour, est-ce que...",
      "unreadCount": 3
    }
  ],
  "pagination": { ... }
}
```

### Envoyer un message
**POST** `/api/messages`

🔒 **Authentification requise**

**Body (nouvelle conversation):**
```json
{
  "receiverId": "uuid-receiver",
  "annonceId": "uuid-annonce",
  "content": "Bonjour, est-ce que l'article est toujours disponible ?"
}
```

**Body (conversation existante):**
```json
{
  "conversationId": "uuid-conversation",
  "content": "Oui, je suis intéressé."
}
```

**Body (avec offre de prix):**
```json
{
  "conversationId": "uuid-conversation",
  "content": "Je vous propose 400 000 FCFA",
  "contentType": "offer",
  "offerAmount": 400000
}
```

**Réponse:** `201 Created`

### Messages d'une conversation
**GET** `/api/messages/:conversationId`

🔒 **Authentification requise**

**Query Parameters:**
- `page` (number)
- `limit` (number) - Défaut: 50
- `before` (datetime) - Cursor pagination

**Réponse:** `200 OK`

### Marquer un message comme lu
**PUT** `/api/messages/:id/read`

🔒 **Authentification requise**

**Réponse:** `200 OK`

---

## 📤 Upload

### Upload d'images
**POST** `/api/upload`

🔒 **Authentification requise**

**Content-Type:** `multipart/form-data`

**Body:**
- `files` - Fichiers (1-8 images)
- `folder` - Dossier (défaut: "annonces")

**Formats acceptés:** JPEG, PNG, WebP, GIF  
**Taille max:** 5 Mo par image

**Réponse:** `200 OK`
```json
{
  "success": true,
  "uploaded": 3,
  "failed": 0,
  "images": [
    {
      "url": "https://...",
      "thumbnailUrl": "https://...",
      "filename": "image-uuid.jpg",
      "width": 1200,
      "height": 800
    }
  ]
}
```

---

## 🔒 Sécurité

### Authentification
Tous les endpoints protégés nécessitent une session Supabase valide. Les cookies de session sont automatiquement gérés par Supabase.

### Permissions
- **Utilisateur** : Peut créer, modifier et supprimer ses propres annonces
- **Admin/Moderator** : Peut modifier/supprimer toutes les annonces

### Validation
Tous les inputs sont validés avec Zod. Les erreurs de validation retournent un code `400` avec des messages détaillés.

---

## 📊 Codes de statut HTTP

- `200` - Succès
- `201` - Création réussie
- `400` - Erreur de validation
- `401` - Non authentifié
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `409` - Conflit (ex: email déjà utilisé)
- `500` - Erreur serveur

---

## 🧪 Exemples d'utilisation

### Avec fetch (JavaScript)
```javascript
// Connexion
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Connecté:', data.data.user);
}
```

### Avec axios
```javascript
import axios from 'axios';

// Créer une annonce
const { data } = await axios.post('/api/annonces', {
  title: 'Mon annonce',
  description: 'Description...',
  price: 50000,
  categoryId: 'uuid',
  city: 'Douala',
  region: 'Littoral',
  images: [...]
});

console.log('Annonce créée:', data.data);
```

### Avec curl
```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","fullName":"Test User"}'

# Lister les annonces
curl "http://localhost:3000/api/annonces?city=Douala&limit=10"
```

---

## 🚀 Prochaines étapes

1. Intégrer les endpoints dans votre frontend React/Next.js
2. Créer des hooks personnalisés pour faciliter l'utilisation
3. Implémenter la gestion d'état (Context API, Zustand, etc.)
4. Ajouter des notifications en temps réel
5. Implémenter le rate limiting en production

---

**Documentation générée le:** 2026-02-08  
**Version API:** 1.0.0  
**Status:** ✅ Production Ready
