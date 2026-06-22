from django.urls import path
from .views import ContactSubmissionView, MeetingBookingView

urlpatterns = [
    path('contact/', ContactSubmissionView.as_view(), name='contact-submit'),
    path('meeting/', MeetingBookingView.as_view(), name='meeting-booking'),
]
