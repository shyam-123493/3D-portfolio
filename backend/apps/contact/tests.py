import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from .models import ContactSubmission


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_contact_submit_valid(client):
    url = reverse('contact-submit')
    data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'company': 'Test Co',
        'message': 'This is a valid test message that is long enough.',
    }
    response = client.post(url, data, format='json')
    assert response.status_code == 201
    assert ContactSubmission.objects.count() == 1
    submission = ContactSubmission.objects.first()
    assert submission.name == 'Test User'
    assert submission.is_spam is False


@pytest.mark.django_db
def test_contact_submit_honeypot(client):
    url = reverse('contact-submit')
    data = {
        'name': 'Spammer',
        'email': 'spam@example.com',
        'message': 'This is spam with honeypot filled in correctly.',
        'website': 'http://spam.com',
    }
    response = client.post(url, data, format='json')
    assert response.status_code == 201
    submission = ContactSubmission.objects.first()
    assert submission.is_spam is True


@pytest.mark.django_db
def test_contact_submit_invalid_email(client):
    url = reverse('contact-submit')
    data = {
        'name': 'Test',
        'email': 'not-an-email',
        'message': 'Valid message length here.',
    }
    response = client.post(url, data, format='json')
    assert response.status_code == 400
    assert 'email' in response.data


@pytest.mark.django_db
def test_contact_submit_short_message(client):
    url = reverse('contact-submit')
    data = {
        'name': 'Test',
        'email': 'test@example.com',
        'message': 'Too short',
    }
    response = client.post(url, data, format='json')
    assert response.status_code == 400
    assert 'message' in response.data
