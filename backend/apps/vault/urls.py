from django.urls import path
from .views import VaultUnlockView

urlpatterns = [
    path('vault/unlock/', VaultUnlockView.as_view(), name='vault-unlock'),
]
