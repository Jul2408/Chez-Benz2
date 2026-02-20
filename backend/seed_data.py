import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from listings.models import Category

def seed():
    categories = [
        {'name': 'Véhicules', 'slug': 'vehicules', 'icon': '🚗'},
        {'name': 'Immobilier', 'slug': 'immobilier', 'icon': '🏠'},
        {'name': 'Multimédia', 'slug': 'multimedia', 'icon': '📱'},
        {'name': 'Emploi', 'slug': 'emploi', 'icon': '💼'},
        {'name': 'Services', 'slug': 'services', 'icon': '🛠️'},
        {'name': 'Maison', 'slug': 'maison', 'icon': '🛏️'},
        {'name': 'Mode', 'slug': 'mode', 'icon': '👕'},
        {'name': 'Loisirs', 'slug': 'loisirs', 'icon': '⚽'},
    ]

    for cat_data in categories:
        Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={'name': cat_data['name'], 'icon': cat_data['icon']}
        )
    print("Catégories créées avec succès !")

if __name__ == '__main__':
    seed()
