from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.projects.urls')),
    path('api/', include('apps.experience.urls')),
    path('api/', include('apps.achievements.urls')),
    path('api/', include('apps.contact.urls')),
    path('api/', include('apps.core.urls')),
    path('api/', include('apps.personal_projects.urls')),
    path('api/', include('apps.vault.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
