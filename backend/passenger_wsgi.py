import os
import sys

# Ajouter le chemin du projet au sys.path
# Remplacez 'chemin_vers_votre_projet' par le chemin absolu sur O2Switch 
# (souvent /home/VOTRE_USER/NomDuDossierBackend)
project_path = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_path)

# Définir le module de paramètres Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Importer l'application WSGI de Django
from config.wsgi import application
