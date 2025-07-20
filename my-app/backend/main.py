from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.contact_api import router as contact_router

app = FastAPI(title="Agriconnect Platform API")

# Enable CORS for frontend on localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Agriconnect Platform API"}

app.include_router(contact_router) 