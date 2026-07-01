from django.urls import path
from .views import PersonalProjectListView

urlpatterns = [
    path('personal-projects/', PersonalProjectListView.as_view(), name='personal-project-list'),
]
