from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle
from django.core.mail import send_mail
from django.conf import settings
from .serializers import ContactSubmissionSerializer
import re


class ContactRateThrottle(AnonRateThrottle):
    rate = '5/hour'


class ContactSubmissionView(APIView):
    throttle_classes = [ContactRateThrottle]

    def get_client_ip(self, request):
        x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded:
            return x_forwarded.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')

    def post(self, request):
        serializer = ContactSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        submission = serializer.save(
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
        )

        # Send notification if not spam
        if not submission.is_spam:
            try:
                send_mail(
                    subject=f'[Portfolio] New message from {submission.name}',
                    message=(
                        f'Name: {submission.name}\n'
                        f'Email: {submission.email}\n'
                        f'Company: {submission.company or "—"}\n\n'
                        f'Message:\n{submission.message}'
                    ),
                    from_email=settings.EMAIL_HOST_USER or 'noreply@portfolio.local',
                    recipient_list=[settings.CONTACT_NOTIFICATION_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass  # Never block submission on email failure

        return Response({'detail': 'Message received.'}, status=status.HTTP_201_CREATED)


class MeetingBookingView(APIView):
    throttle_classes = [ContactRateThrottle]

    EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

    def post(self, request):
        name    = request.data.get('name', '').strip()
        email   = request.data.get('email', '').strip()
        date    = request.data.get('date', '').strip()
        time    = request.data.get('time', '').strip()
        duration = request.data.get('duration', '30').strip()
        topic   = request.data.get('topic', '').strip()
        notes   = request.data.get('notes', '').strip()

        if not all([name, email, date, time, topic]):
            return Response({'error': 'name, email, date, time and topic are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not self.EMAIL_RE.match(email):
            return Response({'error': 'Invalid email address.'}, status=status.HTTP_400_BAD_REQUEST)

        notify_email = getattr(settings, 'CONTACT_NOTIFICATION_EMAIL', '')
        host_user    = getattr(settings, 'EMAIL_HOST_USER', '') or 'noreply@portfolio.local'

        # --- Email to Ghanshyam ---
        try:
            send_mail(
                subject=f'[Portfolio] Meeting Request: {topic}',
                message=(
                    f'New meeting booking request\n\n'
                    f'From  : {name} ({email})\n'
                    f'Date  : {date}\n'
                    f'Time  : {time}\n'
                    f'Length: {duration} min\n'
                    f'Topic : {topic}\n\n'
                    f'Notes :\n{notes or "—"}'
                ),
                from_email=host_user,
                recipient_list=[notify_email],
                fail_silently=True,
            )
        except Exception:
            pass

        # --- Confirmation email to visitor ---
        try:
            send_mail(
                subject=f'Meeting Request Received – {topic}',
                message=(
                    f'Hi {name},\n\n'
                    f'Your meeting request has been received!\n\n'
                    f'Details\n'
                    f'───────\n'
                    f'Date     : {date}\n'
                    f'Time     : {time} IST\n'
                    f'Duration : {duration} min\n'
                    f'Topic    : {topic}\n\n'
                    f'Ghanshyam will confirm the meeting shortly via your email.\n\n'
                    f'Best,\nGhanshyam Desale\nAngular Developer · Mumbai\nghanshyamdesale1421@gmail.com'
                ),
                from_email=host_user,
                recipient_list=[email],
                fail_silently=True,
            )
        except Exception:
            pass

        return Response({'detail': 'Meeting request received.'}, status=status.HTTP_201_CREATED)
