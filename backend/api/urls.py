from django.urls import path
from .views import explain_note, get_history, clear_history

urlpatterns = [
    path('explain/', explain_note),
    path('saved/', get_history),
    path('clear/', clear_history),
]
