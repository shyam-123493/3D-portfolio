from .base import *  # noqa: F401, F403

DEBUG = False

# Security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Railway/Render terminate SSL at the proxy — trust their forwarded header
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# SECURE_PROXY_SSL_HEADER makes this redirect-safe behind Railway's reverse proxy
SECURE_SSL_REDIRECT = True

# Database connection pooling
CONN_MAX_AGE = 60

# Serve static files via WhiteNoise (already configured in base.py)
# Run `python manage.py collectstatic` during deploy
