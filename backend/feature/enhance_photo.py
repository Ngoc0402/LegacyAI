import os
import requests
from fastapi import UploadFile
from dotenv import load_dotenv

load_dotenv()

HF_API_URL = os.getenv("HF_API_URL")
HF_TOKEN = os.getenv("HF_TOKEN")
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

async def process_enhance_photo(file: UploadFile) -> bytes:
    image_bytes = await file.read()
    response = requests.post(HF_API_URL, headers=headers, data=image_bytes)
    return response.content