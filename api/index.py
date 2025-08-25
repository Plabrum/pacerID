import msgspec
from litestar import Litestar, get, post
from litestar.config.cors import CORSConfig


class MedicalDevice(msgspec.Struct):
    name: str
    image: str
    link: str
    description: str


@post("/classify", tags=["devices"])
async def classify_medical_device(data: dict) -> MedicalDevice:
    print(f"looking at {data}")
    return MedicalDevice(
        name="Medtronic Azure™ XT DR MRI SureScan™ Pacemaker",
        image="/images/azure-mri-surescan-pacemaker.jpeg",
        link="https://www.medtronic.com/en-us/healthcare-professionals/products/cardiac-rhythm/pacemakers/azure-pacemaker.html",
        description=(
            "A dual-chamber pacemaker designed for MRI safety, wireless remote monitoring, "
            "and advanced diagnostics. It provides pacing support for patients with bradycardia "
            "and integrates with Medtronic's CareLink™ network."
        ),
    )


@get("/health", tags=["system"])
async def health_check() -> dict:
    return {"status": "ok"}


app = Litestar(
    route_handlers=[classify_medical_device, health_check],
    cors_config=CORSConfig(allow_origins=["*"]),
)
