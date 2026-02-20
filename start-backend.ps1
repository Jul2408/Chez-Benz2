# Script de démarrage du backend Django

Write-Host "Demarrage du backend Chez-BEN2..." -ForegroundColor Cyan

# Nettoyer la base de données et les migrations (Gardez commenté pour ne pas perdre vos données)
# Write-Host "Nettoyage de la base de donnees..." -ForegroundColor Yellow
# Remove-Item backend\db.sqlite3 -ErrorAction SilentlyContinue
# Remove-Item -Recurse -Force backend\users\migrations -ErrorAction SilentlyContinue
# Remove-Item -Recurse -Force backend\listings\migrations -ErrorAction SilentlyContinue
# Remove-Item -Recurse -Force backend\messaging\migrations -ErrorAction SilentlyContinue
# Remove-Item -Recurse -Force backend\notifications\migrations -ErrorAction SilentlyContinue

# Créer les répertoires de migrations
Write-Host "Creation des repertoires de migrations..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path backend\users\migrations -Force | Out-Null
New-Item -ItemType Directory -Path backend\listings\migrations -Force | Out-Null
New-Item -ItemType Directory -Path backend\messaging\migrations -Force | Out-Null
New-Item -ItemType Directory -Path backend\notifications\migrations -Force | Out-Null

# Créer les fichiers __init__.py
"" | Out-File -FilePath backend\users\migrations\__init__.py -Encoding utf8
"" | Out-File -FilePath backend\listings\migrations\__init__.py -Encoding utf8
"" | Out-File -FilePath backend\messaging\migrations\__init__.py -Encoding utf8
"" | Out-File -FilePath backend\notifications\migrations\__init__.py -Encoding utf8

# Créer les migrations
Write-Host "Creation des migrations..." -ForegroundColor Yellow
backend\venv\Scripts\python backend\manage.py makemigrations users
backend\venv\Scripts\python backend\manage.py makemigrations listings
backend\venv\Scripts\python backend\manage.py makemigrations messaging
backend\venv\Scripts\python backend\manage.py makemigrations notifications

# Appliquer les migrations
Write-Host "Application des migrations..." -ForegroundColor Yellow
backend\venv\Scripts\python backend\manage.py migrate

# Créer le superutilisateur
Write-Host "Creation du superutilisateur..." -ForegroundColor Yellow
backend\venv\Scripts\python backend\manage.py init_admin

# Démarrer le serveur
Write-Host "Backend pret! Demarrage du serveur sur http://localhost:8000" -ForegroundColor Green
Write-Host "Documentation API disponible sur /api/docs/" -ForegroundColor Cyan
backend\venv\Scripts\python backend\manage.py runserver
