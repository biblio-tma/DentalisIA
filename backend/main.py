from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from analyse.routes import router as analyse_router

app = FastAPI(
    title="Dentalis IA API",
    description=(
        "API d'orientation dentaire utilisant "
        "FastAPI et Gemini 2.5 Flash."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyse_router)
app.include_router(auth_router)

@app.get("/")
def health_check():
    return {"status": "ok"}

