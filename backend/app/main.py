from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, users, equipment, requests, password_reset, parts

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:8080", # Lovable/Vite default
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(equipment.router, prefix="/api")
app.include_router(requests.router, prefix="/api")
app.include_router(parts.router, prefix="/api")
app.include_router(password_reset.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Maintenance App API"}
