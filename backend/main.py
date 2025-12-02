from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class TranslateRequest(BaseModel):
    text: str
    target_language: str


@app.post("/translate")
async def translate(req: TranslateRequest):
    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input=f"Translate this to {req.target_language}: {req.text}"
        )

        translated = response.output_text
        
        return {"translated_text": translated}

    except Exception as e:
        return {"error": str(e)}
