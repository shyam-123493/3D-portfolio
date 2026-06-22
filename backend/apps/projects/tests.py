import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Project


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def project(db):
    return Project.objects.create(
        title='Test Project',
        role='Developer',
        domain='Test Domain',
        description='A test project description.',
        color='#00D4FF',
        featured=True,
        order=1,
    )


@pytest.mark.django_db
def test_project_list(client, project):
    url = reverse('project-list')
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.data['results']) == 1
    assert response.data['results'][0]['title'] == 'Test Project'


@pytest.mark.django_db
def test_project_detail(client, project):
    url = reverse('project-detail', kwargs={'slug': project.slug})
    response = client.get(url)
    assert response.status_code == 200
    assert response.data['slug'] == project.slug


@pytest.mark.django_db
def test_project_detail_not_found(client):
    url = reverse('project-detail', kwargs={'slug': 'nonexistent'})
    response = client.get(url)
    assert response.status_code == 404
