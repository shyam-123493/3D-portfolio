from django.urls import path
from .views import AchievementListView, CertificationListView

urlpatterns = [
    path('achievements/', AchievementListView.as_view(), name='achievement-list'),
    path('certifications/', CertificationListView.as_view(), name='certification-list'),
]
