from django.urls import path
from .views import ExperienceListView

urlpatterns = [
    path('experience/', ExperienceListView.as_view(), name='experience-list'),
]
