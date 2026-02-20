import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def check_user():
    email = "admin@chezben2.com"
    try:
        user = User.objects.get(email=email)
        print(f"User found: {user.email}")
        print(f"Is active: {user.is_active}")
        print(f"Is staff: {user.is_staff}")
        print(f"Is superuser: {user.is_superuser}")
        print(f"Role: {user.role}")
        
        # Reset password to be sure
        user.set_password("adminpassword")
        user.is_active = True
        user.save()
        print("Password reset to 'adminpassword' and user set to active.")
    except User.DoesNotExist:
        print(f"User {email} NOT found.")
        # Re-create it
        User.objects.create_superuser(
            email=email,
            password="adminpassword",
            role='ADMIN'
        )
        print(f"Admin user re-created: {email} / adminpassword")

if __name__ == "__main__":
    check_user()
