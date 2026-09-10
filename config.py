import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'agriseed_super_secret_dev_key_2026')
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/agriseed_db')
    DB_NAME = os.environ.get('DB_NAME', 'agriseed_db')
    DEBUG = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 't')
    PORT = int(os.environ.get('PORT', 5000))
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True

