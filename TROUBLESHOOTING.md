# Diagnostic et Résolution - Internal Server Error

## 🔍 Diagnostic du problème

### Cause identifiée

L'erreur "Internal Server Error" est causée par le fait que **les tables de la base de données n'existent pas encore dans Supabase**.

### Pourquoi ?

Les API routes utilisent le client Supabase pour interroger la base de données :

```typescript
// Exemple dans /api/auth/login
const { data: profile } = await supabase
    .from('profiles')  // ❌ Cette table n'existe pas encore
    .select('status, bannedUntil')
    .eq('id', user.id)
    .single();
```

**Problème:** Les tables `profiles`, `annonces`, `categories`, `messages`, etc. n'ont pas encore été créées dans votre base de données Supabase.

---

## ✅ Solutions (2 options)

### Option 1: Utiliser Prisma (Recommandé)

Cette option utilise le schéma Prisma déjà défini pour créer toutes les tables.

#### Étape 1: Ajouter DATABASE_URL

Éditer `.env.local` et ajouter :

```env
# Obtenir depuis Supabase Dashboard → Settings → Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.gnetpzbhxmnqzrhrxqdt.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.gnetpzbhxmnqzrhrxqdt.supabase.co:5432/postgres"
```

#### Étape 2: Pousser le schéma

```bash
npm run db:push
```

Cette commande va créer toutes les tables dans Supabase.

#### Étape 3: Seed les catégories

```bash
npm install -D tsx
npm run db:seed
```

#### Étape 4: Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

---

### Option 2: Créer les tables via Supabase SQL Editor

Si vous ne voulez pas utiliser Prisma immédiatement, vous pouvez créer les tables manuellement.

#### Étape 1: Aller sur Supabase Dashboard

1. [https://app.supabase.com](https://app.supabase.com)
2. Sélectionner votre projet
3. Aller dans **SQL Editor**

#### Étape 2: Exécuter le SQL minimal

Créer au minimum la table `profiles` pour que l'authentification fonctionne :

```sql
-- Table profiles (minimum pour l'auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    phone_verified BOOLEAN DEFAULT false,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    
    -- Localisation
    city TEXT,
    region TEXT,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    
    -- Rôle et statut
    role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN')),
    status TEXT DEFAULT 'ACTIF' CHECK (status IN ('ACTIF', 'SUSPENDU', 'BANNI')),
    
    -- Vérification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    trust_score INTEGER DEFAULT 0,
    
    -- Compteurs
    annonces_count INTEGER DEFAULT 0,
    ventes_count INTEGER DEFAULT 0,
    
    -- Préférences
    notification_email BOOLEAN DEFAULT true,
    notification_push BOOLEAN DEFAULT true,
    notification_sms BOOLEAN DEFAULT false,
    
    -- Métadonnées
    last_login_at TIMESTAMPTZ,
    last_login_ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ban info
    banned_at TIMESTAMPTZ,
    banned_reason TEXT,
    banned_by UUID,
    banned_until TIMESTAMPTZ
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_city_region ON public.profiles(city, region);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
```

---

## 🧪 Vérifier que c'est résolu

### Test 1: Vérifier les tables dans Supabase

1. Aller dans **Table Editor** sur Supabase Dashboard
2. Vérifier que la table `profiles` existe

### Test 2: Tester l'endpoint de signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "fullName": "Test User",
    "city": "Douala"
  }'
```

**Réponse attendue:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "profile": {...},
    "session": {...}
  },
  "message": "Inscription réussie !"
}
```

### Test 3: Tester l'endpoint de liste d'annonces

```bash
curl http://localhost:3000/api/annonces
```

**Réponse attendue:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

---

## 🔧 Dépannage

### Erreur: "relation \"profiles\" does not exist"

**Solution:** Les tables n'ont pas été créées. Exécuter `npm run db:push` ou créer les tables via SQL.

### Erreur: "password authentication failed"

**Solution:** Vérifier que le mot de passe dans `DATABASE_URL` est correct.

### Erreur: "Cannot find module '@prisma/client'"

**Solution:** 
```bash
npm install
npm run db:generate
```

### Les endpoints retournent toujours 500

**Solution:** Vérifier les logs du serveur dans le terminal pour voir l'erreur exacte.

---

## 📋 Checklist de résolution

- [ ] Ajouter `DATABASE_URL` et `DIRECT_URL` dans `.env.local`
- [ ] Exécuter `npm run db:push` pour créer les tables
- [ ] Exécuter `npm run db:seed` pour les catégories
- [ ] Redémarrer le serveur (`npm run dev`)
- [ ] Tester l'endpoint `/api/auth/signup`
- [ ] Vérifier qu'il n'y a plus d'erreur 500

---

## 🚀 Recommandation

**Utilisez l'Option 1 (Prisma)** car :
- ✅ Crée toutes les tables automatiquement
- ✅ Maintient la cohérence avec le schéma
- ✅ Inclut tous les index de performance
- ✅ Seed les catégories automatiquement
- ✅ Plus facile à maintenir

---

**Une fois les tables créées, tous les endpoints API fonctionneront correctement !** 🎉
