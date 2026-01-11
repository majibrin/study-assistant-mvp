from django.db import models

class StudyNote(models.Model):
    note = models.TextField()
    explanation = models.TextField()
    questions = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.note[:50]
