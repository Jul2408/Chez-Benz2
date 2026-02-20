import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def list_users():
    users = User.objects.all()
    print(f"Total users: {users.count()}")
    for u in users:
        print(f"Email: {u.email}, Active: {u.is_active}, Staff: {u.is_staff}, Role: {u.role}")

if __name__ == "__main__":
    list_users()
