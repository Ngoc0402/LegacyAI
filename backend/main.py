from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

from backend.feature.enhance_photo import process_enhance_photo

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/enhance-photo/")
async def enhance_photo(file: UploadFile = File(...)):
    result_bytes = await process_enhance_photo(file)
    return Response(content=result_bytes, media_type="image/jpeg")