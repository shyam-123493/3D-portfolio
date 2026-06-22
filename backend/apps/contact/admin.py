from django.contrib import admin
from .models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'company', 'is_read', 'is_spam', 'created_at')
    list_editable = ('is_read',)
    list_filter = ('is_read', 'is_spam', 'created_at')
    search_fields = ('name', 'email', 'company', 'message')
    readonly_fields = ('name', 'email', 'company', 'message', 'ip_address', 'user_agent', 'created_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        # Allow marking as read/spam but nothing else
        return True
