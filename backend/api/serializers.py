from rest_framework import serializers
from .models import StudyNote

class StudyNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyNote
        fields = '__all__'
