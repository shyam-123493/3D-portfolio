from .base import *  # noqa: F401, F403

DEBUG = True

REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [  # noqa: F405
    'rest_framework.renderers.JSONRenderer',
    'rest_framework.renderers.BrowsableAPIRenderer',
]

# Real SMTP (from .env) is used as soon as EMAIL_HOST_PASSWORD is set;
# until then emails print to this console so dev works without secrets.
if not EMAIL_HOST_PASSWORD:  # noqa: F405
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
