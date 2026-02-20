from django.db import models
from django.conf import settings
from core.models import TimeStampedModel

class Notification(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    
    # Generic relation or JSON field for action target could be added here
    action_url = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Notification for {self.user}: {self.title}"
