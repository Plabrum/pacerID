from dataclasses import dataclass
from typing import Optional

from api.types import (
    ClassScore,
    DeviceType,
    Manufacturer,
    MedicalDeviceResult,
)


@dataclass(frozen=True)
class DeviceMeta:
    name: str
    type: DeviceType
    manufacturer: Manufacturer
    leads: Optional[int] = None
    link: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None


CLASS_DB: dict[int, DeviceMeta] = {
    # BIOTRONIK devices
    0: DeviceMeta(
        name="Actros/Philos",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.BIOTRONIK,
        leads=2,
        description="Dual-chamber pacemaker series with advanced diagnostics.",
    ),
    1: DeviceMeta(
        name="Cyclos",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.BIOTRONIK,
        leads=1,
        description="Single-chamber pacemaker with ProMRI technology.",
    ),
    2: DeviceMeta(
        name="Evia",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.BIOTRONIK,
        leads=2,
        description="Dual-chamber pacemaker with ProMRI and closed loop stimulation.",
    ),
    # BOSTON SCIENTIFIC devices
    3: DeviceMeta(
        name="Altrua/Insignia",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=2,
        description="Dual-chamber pacemaker family with advanced features.",
    ),
    4: DeviceMeta(
        name="Autogen/Teligen/Energen/Cognis",
        type=DeviceType.ICD,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=3,
        description="ICD family with cardiac resynchronization therapy capabilities.",
    ),
    5: DeviceMeta(
        name="Contak Renewal 4",
        type=DeviceType.CRT_D,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=3,
        description="CRT-D device for heart failure management.",
    ),
    6: DeviceMeta(
        name="Contak Renewal TR2",
        type=DeviceType.CRT_D,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=3,
        description="CRT-D with advanced heart failure diagnostics.",
    ),
    7: DeviceMeta(
        name="ContakTR/Discovery/Meridian/Pulsar Max",
        type=DeviceType.CRT_D,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=3,
        description="CRT-D device family for cardiac resynchronization.",
    ),
    8: DeviceMeta(
        name="Emblem",
        type=DeviceType.S_ICD,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=0,
        description="Subcutaneous ICD, no transvenous leads required.",
    ),
    9: DeviceMeta(
        name="Ingenio",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=2,
        description="MRI-conditional dual-chamber pacemaker.",
    ),
    10: DeviceMeta(
        name="Proponent",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=2,
        description="Dual-chamber pacemaker with extended longevity.",
    ),
    11: DeviceMeta(
        name="Ventak Prizm",
        type=DeviceType.ICD,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=2,
        description="Dual-chamber ICD with advanced discrimination algorithms.",
    ),
    12: DeviceMeta(
        name="Visionist",
        type=DeviceType.CRT_P,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=3,
        description="CRT pacemaker for heart failure patients.",
    ),
    13: DeviceMeta(
        name="Vitality",
        type=DeviceType.ICD,
        manufacturer=Manufacturer.BOSTON_SCI,
        leads=2,
        description="ICD with enhanced battery longevity.",
    ),
    # MEDTRONIC devices
    14: DeviceMeta(
        name="Adapta/Kappa/Sensia/Versa",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=2,
        description="Pacemaker family with MVP algorithm and automatic capture management.",
    ),
    15: DeviceMeta(
        name="Advisa",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=2,
        description="MRI SureScan dual-chamber pacemaker.",
    ),
    16: DeviceMeta(
        name="AT500",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=2,
        description="Dual-chamber pacemaker with atrial therapy features.",
    ),
    17: DeviceMeta(
        name="Azure",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=2,
        description="BlueSync technology-enabled pacemaker with smartphone connectivity.",
    ),
    18: DeviceMeta(
        name="C20/T20",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=1,
        description="Single-chamber pacemaker series.",
    ),
    19: DeviceMeta(
        name="C60 DR",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=2,
        description="Dual-chamber rate-responsive pacemaker.",
    ),
    20: DeviceMeta(
        name="Claria/Evera/Viva",
        type=DeviceType.CRT_D,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=3,
        description="CRT-D family with EffectivCRT algorithm and AdaptivCRT.",
    ),
    21: DeviceMeta(
        name="Concerto/Consulta/Maximo/Protecta/Secura",
        type=DeviceType.ICD,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=2,
        description="ICD family with OptiVol fluid monitoring and shock reduction technology.",
    ),
    22: DeviceMeta(
        name="EnRhythm",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=2,
        description="Dual-chamber pacemaker with managed ventricular pacing.",
    ),
    23: DeviceMeta(
        name="Insync III",
        type=DeviceType.CRT_P,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=3,
        description="Cardiac resynchronization therapy pacemaker.",
    ),
    24: DeviceMeta(
        name="Maximo",
        type=DeviceType.ICD,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=2,
        description="Dual-chamber ICD with advanced diagnostics.",
    ),
    25: DeviceMeta(
        name="REVEAL",
        type=DeviceType.ILR,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=0,
        description="Insertable cardiac monitor for arrhythmia detection.",
    ),
    26: DeviceMeta(
        name="REVEAL LINQ",
        type=DeviceType.ILR,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=0,
        description="Miniaturized insertable cardiac monitor with TruRhythm detection.",
    ),
    27: DeviceMeta(
        name="Sigma",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=2,
        description="Dual-chamber pacemaker series.",
    ),
    28: DeviceMeta(
        name="Syncra",
        type=DeviceType.CRT_P,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=3,
        description="CRT pacemaker with adaptive optimization.",
    ),
    29: DeviceMeta(
        name="Vita II",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.MEDTRONIC,
        leads=2,
        description="Dual-chamber pacemaker with rate response.",
    ),
    # SORIN (now part of LivaNova) devices
    30: DeviceMeta(
        name="Elect",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.SORIN,
        leads=2,
        description="Dual-chamber pacemaker with automatic threshold measurement.",
    ),
    31: DeviceMeta(
        name="Elect XS Plus",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.SORIN,
        leads=2,
        description="Enhanced dual-chamber pacemaker with advanced diagnostics.",
    ),
    32: DeviceMeta(
        name="MiniSwing",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.SORIN,
        leads=1,
        description="Compact single-chamber pacemaker.",
    ),
    33: DeviceMeta(
        name="Neway",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.SORIN,
        leads=2,
        description="Entry-level dual-chamber pacemaker.",
    ),
    34: DeviceMeta(
        name="Ovatio",
        type=DeviceType.ICD,
        manufacturer=Manufacturer.SORIN,
        leads=2,
        description="Dual-chamber ICD with PARAD+ discrimination algorithm.",
    ),
    35: DeviceMeta(
        name="Reply",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.SORIN,
        leads=2,
        description="MRI-conditional dual-chamber pacemaker.",
    ),
    36: DeviceMeta(
        name="Rhapsody/Symphony",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.SORIN,
        leads=2,
        description="Advanced dual-chamber pacemaker family.",
    ),
    37: DeviceMeta(
        name="Thesis",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.SORIN,
        leads=2,
        description="Dual-chamber pacemaker with SafeR mode.",
    ),
    # ST. JUDE MEDICAL (now Abbott) devices
    38: DeviceMeta(
        name="Accent",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.ABBOTT,
        leads=2,
        description="MRI-conditional pacemaker with accelerometer sensor.",
    ),
    39: DeviceMeta(
        name="Allure Quadra",
        type=DeviceType.CRT_P,
        manufacturer=Manufacturer.ABBOTT,
        leads=4,
        description="Quadripolar CRT pacemaker for heart failure management.",
    ),
    40: DeviceMeta(
        name="Ellipse",
        type=DeviceType.ICD,
        manufacturer=Manufacturer.ABBOTT,
        leads=2,
        description="Dual-chamber ICD with enhanced battery longevity.",
    ),
    41: DeviceMeta(
        name="Identity",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.ABBOTT,
        leads=2,
        description="Dual-chamber pacemaker with AF suppression algorithms.",
    ),
    42: DeviceMeta(
        name="Quadra Assura/Unify",
        type=DeviceType.CRT_D,
        manufacturer=Manufacturer.ABBOTT,
        leads=4,
        description="Quadripolar CRT-D with MultiPoint Pacing technology.",
    ),
    43: DeviceMeta(
        name="Victory",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.ABBOTT,
        leads=2,
        description="Dual-chamber pacemaker with ventricular AutoCapture.",
    ),
    44: DeviceMeta(
        name="Zephyr",
        type=DeviceType.PACEMAKER,
        manufacturer=Manufacturer.ABBOTT,
        leads=2,
        description="Dual-chamber pacemaker with extended longevity.",
    ),
}

DEFAULT_META = DeviceMeta(
    name="Unknown",
    type=DeviceType.OTHER,
    manufacturer=Manufacturer.OTHER,
)


def serialize_medical_devices(
    classification_results: list[ClassScore],
    threshold: float = 0.10,
) -> list[MedicalDeviceResult]:
    devices: list[MedicalDeviceResult] = []

    for result in classification_results:
        if result.score < threshold:
            continue  # skip anything below threshold

        meta = CLASS_DB.get(result.class_id, DEFAULT_META)

        devices.append(
            MedicalDeviceResult(
                name=meta.name,
                type=meta.type,
                manufacturer=meta.manufacturer,
                confidence=float(result.score),
                link=meta.link,
                description=meta.description,
                image=meta.image,
                leads=meta.leads,
            )
        )

    return sorted(devices, key=lambda d: d.confidence, reverse=True)
