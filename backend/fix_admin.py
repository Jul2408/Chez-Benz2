import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def fix_users():
    # Fix mbeleglaurent0@gmail.com as ADMIN
    try:
        u = User.objects.get(email="mbeleglaurent0@gmail.com")
        u.role = 'ADMIN'
        u.is_staff = True
        u.is_superuser = True
        u.is_active = True
        u.save()
        print(f"Updated {u.email} to ADMIN")
    except:
        pass

    # Ensure admin@chezben2.com is active
    try:
        u2 = User.objects.get(email="admin@chezben2.com")
        u2.is_active = True
        u2.role = 'ADMIN'
        u2.set_password("adminpassword")
        u2.save()
        print("Updated admin@chezben2.com to ADMIN with password 'adminpassword'")
    except:
        # Create it if missing
        User.objects.create_superuser(
            email="admin@chezben2.com",
            password="adminpassword",
            role='ADMIN'
        )
        print("Created admin@chezben2.com")

if __name__ == "__main__":
    fix_users()
