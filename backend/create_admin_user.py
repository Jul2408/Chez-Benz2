import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def create_admin():
    email = "admin@chezben2.com"
    password = "admin-secret-password-placeholder"
    
    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.role = 'ADMIN'
        user.save()
        print(f"User {email} updated to ADMIN.")
    else:
        User.objects.create_superuser(
            email=email,
            password=password,
            role='ADMIN'
        )
        print(f"Admin user created: {email} / {password}")

if __name__ == "__main__":
    create_admin()
