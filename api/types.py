from enum import Enum

from msgspec import Struct


class DeviceType(Enum):
    PACEMAKER = "Pacemaker"
    ICD = "ICD"
    CRT_P = "CRT-P"
    S_ICD = "S_ICD"
    CRT_D = "CRT-D"
    ILR = "ILR"
    OTHER = "Other"


class Manufacturer(Enum):
    BIOTRONIK = "Biotronik"
    MEDTRONIC = "Medtronic"
    BOSTON_SCI = "Boston Scientific"
    ABBOTT = "Abbott"
    SORIN = "SORIN"
    OTHER = "Other"


class MedicalDeviceResult(Struct):
    name: str
    type: DeviceType
    manufacturer: Manufacturer
    confidence: float
    link: str | None = None
    description: str | None = None
    image: str | None = None
    leads: int | None = None


class ClassScore(Struct):
    class_id: int
    score: float
