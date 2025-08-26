import enum
from typing import Optional

import msgspec
from litestar import Litestar, Router, get, post
from litestar.config.cors import CORSConfig


class DeviceType(enum.Enum):
    PACEMAKER = "Pacemaker"
    ICD = "ICD"
    CRT_P = "CRT-P"
    CRT_D = "CRT-D"
    OTHER = "Other"


class Manufacturer(enum.Enum):
    BIOTRONIK = "Biotronik"
    MEDTRONIC = "Medtronic"
    BOSTON_SCI = "Boston Scientific"
    ABBOTT = "Abbott"
    OTHER = "Other"


class MedicalDeviceResult(msgspec.Struct):
    name: str
    type: DeviceType
    manufacturer: Manufacturer
    confidence: float
    link: str | None = None
    description: str | None = None
    image: str | None = None
    leads: int | None = None


mock_response: list[MedicalDeviceResult] = [
    MedicalDeviceResult(
        name="Biotronik Pacemaker with 2 Leads",
        manufacturer=Manufacturer.BIOTRONIK,
        type=DeviceType.PACEMAKER,
        leads=2,
        image="/images/azure-mri-surescan-pacemaker.jpeg",
        link="https://www.biotronik.com/en-us/products/crt-p",
        description=(
            "Subcutaneous dual-chamber device, est. lifespan 8–12 years, "
            "interrogation via wireless telemetry"
        ),
        confidence=0.95,
    ),
    MedicalDeviceResult(
        name="Medtronic ICD",
        manufacturer=Manufacturer.MEDTRONIC,
        type=DeviceType.ICD,
        leads=1,
        image="/images/medtronic-icd-implantable-cardioverter-defibrillat.png",
        link=(
            "https://www.medtronic.com/us-en/healthcare-professionals/products/"
            "cardiac-rhythm/icds.html"
        ),
        description=(
            "Single-lead implantable cardioverter defibrillator, est. lifespan 6–8 years, "
            "remote monitoring capable"
        ),
        confidence=0.5,
    ),
]


@post("/classify", tags=["devices"])
async def classify_medical_device(data: dict) -> list[MedicalDeviceResult]:
    print(f"looking at {data}")
    return mock_response


@get("/health", tags=["system"])
async def health_check() -> dict:
    return {"status": "ok"}


api = Router(
    path="/api",
    route_handlers=[classify_medical_device, health_check],
)
app = Litestar(
    route_handlers=[api], cors_config=CORSConfig(allow_origins=["*"])
)
