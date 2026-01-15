import re
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import StudyNote
from .serializers import StudyNoteSerializer
from .ai_engine import simplify_note, generate_questions

@api_view(['POST'])
def explain_note(request):
    note_text = request.data.get('note')
    
    # 1. Get AI responses
    explanation = simplify_note(note_text)
    raw_questions = generate_questions(note_text)

    # 2. Fix the "Break after ?" bug
    # We split by numbers followed by a dot (e.g., 1. or 2.) 
    # This keeps MCQ options together with their questions.
    if isinstance(raw_questions, str):
        # Splitting by "1.", "2.", etc., or newlines with numbers
        processed_questions = [q.strip() for q in re.split(r'\d+\.', raw_questions) if q.strip()]
    else:
        processed_questions = raw_questions

    # 3. Save to database
    obj = StudyNote.objects.create(
        note=note_text,
        explanation=explanation,
        questions=processed_questions  # Saves as a clean list
    )
    
    return Response(StudyNoteSerializer(obj).data)

@api_view(['GET'])
def get_history(request):
    # Order by newest first
    notes = StudyNote.objects.all().order_by('-created_at')
    return Response(StudyNoteSerializer(notes, many=True).data)

@api_view(['DELETE'])
def clear_history(request):
    StudyNote.objects.all().delete()
    return Response({"message": "Study history cleared!"})
