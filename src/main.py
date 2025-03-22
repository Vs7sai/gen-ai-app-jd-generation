from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from groq import Groq
import re

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


API_KEY = ""
client = Groq(api_key=API_KEY)

# Request model
class GenerateRequest(BaseModel):
    input: str

@app.post("/generate")
async def generate_text(request: GenerateRequest):
    try:
        user_input = request.input.strip()

        # Check if input contains skills, experience, or job title
        pattern = r"(skills|experience|position|job|role|requirements)"
        if not re.search(pattern, user_input, re.IGNORECASE):
            return JSONResponse(status_code=200, content={"response": "I am a JD generation AI only."})

        # Send valid input to AI
        prompt = f"""
        You are an AI specialized in generating job descriptions. Your task is to generate a job description based on the given inputs.
        The user will provide skills, experience, and a job title.
        If the user provides this information, generate a well-structured job description.

        If the input does not include job-related terms, respond with:  
        "I am a JD generation AI only."

       

        generate a job description for the following input: "{user_input}"
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )

        if not response.choices:
            return JSONResponse(status_code=500, content={"detail": "No AI response"})

        return {"response": response.choices[0].message.content}

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
