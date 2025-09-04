from dataclasses import dataclass
from typing import Annotated

from litestar import Litestar, Router, get, post
from litestar.config.cors import CORSConfig
from litestar.datastructures import UploadFile
from litestar.enums import RequestEncodingType
from litestar.params import Body

from api.classifier.service import PacemakerClassifier
from api.classifier.transformer import serialize_medical_devices
from api.types import MedicalDeviceResult


@dataclass
class ImageForm:
    image: UploadFile


@post("/classify")
async def classify_medical_device(
    data: Annotated[ImageForm, Body(media_type=RequestEncodingType.MULTI_PART)],
) -> list[MedicalDeviceResult]:
    img_bytes = await data.image.read()
    results = PacemakerClassifier.classify(img_bytes)
    return serialize_medical_devices(results)


@get("/", tags=["system"])
async def health_check() -> dict:
    return {"status": "ok"}


api = Router(
    path="/api",
    route_handlers=[classify_medical_device, health_check],
)
app = Litestar(
    route_handlers=[api], cors_config=CORSConfig(allow_origins=["*"])
)
