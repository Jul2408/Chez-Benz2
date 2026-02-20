from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Creates a superuser if none exists'

    def handle(self, *args, **options):
        User = get_user_model()
        username = os.environ.get('SUPERUSER_USERNAME') or 'Ocomstio'
        email = os.environ.get('SUPERUSER_EMAIL') or 'admin@ocomstio.com'
        password = os.environ.get('SUPERUSER_PASSWORD') or 'your-secret-password-here'

        if not User.objects.filter(email=email).exists():
            print(f'Creating superuser {email}...')
            User.objects.create_superuser(
                email=email,
                password=password,
                role='ADMIN'
            )
            print('Superuser created successfully.')
        else:
            print('Superuser already exists.')
