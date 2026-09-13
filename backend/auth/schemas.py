from pydantic import BaseModel, EmailStr
from typing import Optional


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    nom: str
    prenom: str
    telephone: str | None = None
    sexe: str | None = None
    adresse: str | None = None
    age: int | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProfileUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    adresse: Optional[str] = None
    email: Optional[str] = None
    telephone: Optional[str] = None
    age: Optional[int] = None
    sexe: Optional[str] = None
    groupe_sanguin: Optional[str] = None
    allergies: Optional[str] = None
    antecedents: Optional[str] = None
    avatar: Optional[str] = None