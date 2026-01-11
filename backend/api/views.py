from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import StudyNote
from .serializers import StudyNoteSerializer
from .ai_engine import simplify_note, generate_questions

@api_view(['POST'])
def explain_note(request):
    note_text = request.data.get('note')
    explanation = simplify_note(note_text)
    questions = generate_questions(note_text)
    
    obj = StudyNote.objects.create(
        note=note_text,
        explanation=explanation,
        questions=questions
    )
    return Response(StudyNoteSerializer(obj).data)

@api_view(['GET'])
def get_history(request):
    notes = StudyNote.objects.all().order_by('-created_at')
    return Response(StudyNoteSerializer(notes, many=True).data)

@api_view(['DELETE'])
def clear_history(request):
    StudyNote.objects.all().delete()
    return Response({"message": "History cleared!"})
