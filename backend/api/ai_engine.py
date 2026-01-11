import requests
import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

API_KEY = os.getenv("HF_TOKEN")
API_URL = "https://router.huggingface.co/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def query_ai(prompt):
    if not API_KEY:
        return "System Error: API Key missing from .env"
        
    payload = {
        "model": "google/gemma-2-9b-it:nebius",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 500
    }
    try:
        response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=60)
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        return f"Error {response.status_code}: AI is busy."
    except Exception as e:
        return "Connection Error. Check internet."

def simplify_note(text):
    return query_ai(f"Explain this university note simply: {text}")

def generate_questions(text):
    raw = query_ai(f"Generate 3 short exam questions from: {text}")
    questions = [q.strip() for q in raw.split('\n') if '?' in q]
    return questions[:3] if questions else ["What is the main concept here?"]
