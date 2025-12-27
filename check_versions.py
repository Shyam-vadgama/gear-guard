import passlib
import bcrypt
print(f"passlib: {passlib.__version__}")
print(f"bcrypt: {bcrypt.__version__}")
try:
    import passlib.hash
    print("passlib.hash imported")
except Exception as e:
    print(f"passlib.hash error: {e}")
