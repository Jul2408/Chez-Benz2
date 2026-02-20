import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def ultra_fix():
    email = "admin@chezben2.com"
    password = "adminpassword"
    
    # Delete if exists to be clean
    User.objects.filter(email__iexact=email).delete()
    
    # Create fresh superuser
    u = User.objects.create_superuser(
        email=email,
        password=password,
        role='ADMIN'
    )
    u.is_active = True
    u.is_staff = True
    u.is_superuser = True
    u.save()
    
    print(f"ULTRA FIX: Created fresh admin user {email} with password {password}")
    
    # Also fix the other possible user
    try:
        u2 = User.objects.get(email="mbeleglaurent0@gmail.com")
        u2.role = 'ADMIN'
        u2.is_active = True
        u2.is_staff = True
        u2.save()
        print(f"ULTRA FIX: Set {u2.email} as ADMIN too.")
    except:
        pass

if __name__ == "__main__":
    ultra_fix()
