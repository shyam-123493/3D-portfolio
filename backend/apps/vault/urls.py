from django.urls import path
from .views import VaultUnlockView, VaultItemCreateView, VaultItemDeleteView

urlpatterns = [
    path('vault/unlock/', VaultUnlockView.as_view(), name='vault-unlock'),
    path('vault/items/', VaultItemCreateView.as_view(), name='vault-item-create'),
    path('vault/items/<int:item_id>/', VaultItemDeleteView.as_view(), name='vault-item-delete'),
]
