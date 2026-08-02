"""Enrich the website's 261-district fact file from canonical research tables."""

from __future__ import annotations

import argparse
import csv
import json
import re
from difflib import SequenceMatcher
from pathlib import Path

from shapely.geometry import shape


SOURCE_SPECS = {
    "insurance_education": {
        "path": "11. NHIS OOP Ghana 260 Districts/data/processed/district_master_261_analytical.csv",
        "district": "GEO_DISTRICT",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "fields": {
            "women_insured_2019_pct": "NHIS_Coverage_Women_2019_pct",
            "women_uninsured_2022_pct": "No_Insurance_Women_2022_pct",
            "female_literate_pct": "Female_Literate_pct",
            "female_no_education_pct": "Female_No_Edu_pct",
            "female_secondary_plus_pct": "Female_SecPlus_pct",
            "facility_delivery_pct": "Facility_Delivery_pct",
        },
    },
    "nutrition": {
        "path": "10. Nutrition Anaemia Growth Determinants Ghana 261 Districts/data/processed/master_261district_nutrition_FINAL.csv",
        "district": "district",
        "latitude": "lat",
        "longitude": "lon",
        "fields": {
            "anaemia_pct": "anaemia_district_pct",
            "minimum_diet_pct": "iycf_district_pct",
            "diarrhoea_pct": "diarrhoea_district_pct",
            "stunting_pct": "stunting_district_pct",
        },
    },
    "maternal_health": {
        "path": "14. Ghana Maternal Reproductive Health/master_maternal_ghana_261districts_v1.csv",
        "district": "district",
        "latitude": "latitude",
        "longitude": "longitude",
        "fields": {
            "maternal_health_index": "composite_maternal_index",
            "postnatal_care_pct": "pnc_coverage",
            "modern_contraceptive_pct": "modern_cpr",
            "unmet_family_planning_need_pct": "unmet_need_fp",
            "family_planning_demand_satisfied_pct": "demand_fp_satisfied",
        },
    },
    "immunisation": {
        "path": "17. Ghana immunisation coverage analysis/data/processed/master_immunisation_ghana_261_final.csv",
        "district": "district_id",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "fields": {
            "bcg_pct": "imm_bcg_pct",
            "measles_pct": "imm_measles_pct",
            "fully_vaccinated_pct": "imm_fully_vaccinated_pct",
            "no_vaccination_pct": "imm_no_vaccination_pct",
            "dpt_dropout_pct": "dpt_dropout_rate",
            "coverage_composite": "imm_coverage_composite",
        },
    },
}


def district_key(value: str) -> str:
    cleaned = re.sub(r"[^A-Z0-9]+", " ", value.upper()).strip()
    replacements = {
        "ADENTAN MUNICIPAL": "ADENTA MUNICIPAL",
        "GA WEST MUNICIPALITY": "GA WEST MUNICIPAL",
    }
    return replacements.get(cleaned, cleaned)


def district_signature(value: str) -> str:
    cleaned = district_key(value)
    long_form_aliases = {
        "ACCRA METROPOLITAN AREA": "ACCRA",
        "CAPE CAPE METROPOLITAN AREA": "CAPE COAST",
        "KUMASI METROPOLITAN AREA": "KUMASI",
        "SEKONDI TAKORADI METROPOLITAN AREA": "SEKONDI TAKORADI",
        "TAMALE METROPOLITAN AREA": "TAMALE",
        "TEMA METROPOLITAN AREA": "TEMA",
    }
    for prefix, replacement in long_form_aliases.items():
        if cleaned.startswith(prefix):
            cleaned = replacement
            break
    spelling = {
        "ADENTAN": "ADENTA",
        "AGORTIME": "AGOTIME",
        "AKWAPIM": "AKWAPEM",
        "BOLGATANGA": "BOLGA",
        "BOSOMTWI": "BOSOMTWE",
        "DENKYEMBUOR": "DENKYEMBOUR",
        "HEMAN": "HEMANG",
        "MFANTSIMAN": "MFANTSEMAN",
        "OKAIKOI": "OKAIKWEI",
        "SAGNARIGU": "SAGNERIGU",
    }
    tokens = [spelling.get(token, token) for token in cleaned.split()]
    administrative = {
        "AREA",
        "DISTRICT",
        "METROPOLIS",
        "METROPOLITAN",
        "MUNICIPAL",
        "MUNICIPALITY",
    }
    tokens = [token for token in tokens if token not in administrative]
    return " ".join(tokens)


def number(value: str) -> float | None:
    try:
        return round(float(value), 2)
    except (TypeError, ValueError):
        return None


def read_source(path: Path, spec: dict) -> dict:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    if len(rows) != 261:
        raise ValueError(f"{path} has {len(rows)} rows; expected 261")
    indexed = {district_key(row[spec["district"]]): row for row in rows}
    if len(indexed) != 261:
        raise ValueError(f"{path} contains duplicate normalized district names")
    by_signature = {}
    for row in rows:
        by_signature.setdefault(district_signature(row[spec["district"]]), []).append(row)
    return {"by_name": indexed, "by_signature": by_signature, "rows": rows}


def matching_row(
    source: dict,
    spec: dict,
    district: dict,
    used: set[str],
) -> dict[str, str] | None:
    row = source["by_name"].get(district_key(district["id"]))
    if row is not None and district_key(row[spec["district"]]) not in used:
        return row
    signature = district_signature(district["id"])
    signature_matches = [
        item
        for item in source["by_signature"].get(signature, [])
        if district_key(item[spec["district"]]) not in used
    ]
    if len(signature_matches) == 1:
        return signature_matches[0]

    available = [
        item
        for item in source["rows"]
        if district_key(item[spec["district"]]) not in used
    ]
    fuzzy = sorted(
        available,
        key=lambda item: SequenceMatcher(
            None,
            signature,
            district_signature(item[spec["district"]]),
        ).ratio(),
        reverse=True,
    )
    if fuzzy:
        similarity = SequenceMatcher(
            None,
            signature,
            district_signature(fuzzy[0][spec["district"]]),
        ).ratio()
        if similarity >= 0.72:
            return fuzzy[0]

    latitude = district["coordinates"]["latitude"]
    longitude = district["coordinates"]["longitude"]
    candidates = sorted(
        available,
        key=lambda item: (
            (float(item[spec["latitude"]]) - latitude) ** 2
            + (float(item[spec["longitude"]]) - longitude) ** 2
        ),
    )
    nearest = candidates[0]
    distance_squared = (
        (float(nearest[spec["latitude"]]) - latitude) ** 2
        + (float(nearest[spec["longitude"]]) - longitude) ** 2
    )
    return nearest if distance_squared <= 0.01 else None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--research-root", type=Path, required=True)
    parser.add_argument(
        "--facts",
        type=Path,
        default=Path("assets/data/ghana-district-facts.json"),
    )
    parser.add_argument(
        "--geometry",
        type=Path,
        default=Path("assets/data/ghana-districts.geojson"),
    )
    args = parser.parse_args()

    payload = json.loads(args.facts.read_text(encoding="utf-8"))
    districts = payload["districts"]
    source_rows = {}
    used_source_districts = {source_name: set() for source_name in SOURCE_SPECS}

    for source_name, spec in SOURCE_SPECS.items():
        source_path = args.research_root / spec["path"]
        source_rows[source_name] = read_source(source_path, spec)

    missing = {}
    for district in districts:
        for source_name, spec in SOURCE_SPECS.items():
            row = matching_row(
                source_rows[source_name],
                spec,
                district,
                used_source_districts[source_name],
            )
            if row is None:
                missing.setdefault(source_name, []).append(district["name"])
                continue
            source_district = district_key(row[spec["district"]])
            if source_district in used_source_districts[source_name]:
                raise ValueError(
                    f"{source_name} record matched more than once: {source_district} "
                    f"while enriching {district['name']}"
                )
            used_source_districts[source_name].add(source_district)
            district[source_name] = {
                output_field: number(row[input_field])
                for output_field, input_field in spec["fields"].items()
            }

    if missing:
        detail = "; ".join(
            f"{name}: {', '.join(names[:5])}" for name, names in missing.items()
        )
        raise ValueError(f"Unmatched district records: {detail}")

    geometry_payload = json.loads(args.geometry.read_text(encoding="utf-8"))
    geometry_by_district = {
        feature["properties"]["name"]: feature["geometry"]
        for feature in geometry_payload["features"]
    }
    if set(geometry_by_district) != {district["id"] for district in districts}:
        raise ValueError("District fact and geometry identifiers do not match exactly")
    for district in districts:
        point = shape(geometry_by_district[district["id"]]).representative_point()
        district["coordinates"] = {
            "latitude": round(point.y, 5),
            "longitude": round(point.x, 5),
        }

    fact_sources = payload["meta"]["fact_sources"]
    for spec in SOURCE_SPECS.values():
        if spec["path"] not in fact_sources:
            fact_sources.append(spec["path"])
    payload["meta"]["canonical_fact_source_count"] = len(fact_sources)
    payload["meta"]["live_card_domains"] = [
        "district demographics and structural determinants",
        "health insurance and women's education",
        "SDG, WASH, service and outcome indicators",
        "nutrition, anaemia and child-health indicators",
        "maternal and reproductive-health indicators",
        "immunisation coverage and dropout indicators",
        "ranked structural vulnerability",
    ]

    args.facts.write_text(
        json.dumps(payload, ensure_ascii=True, separators=(",", ":")),
        encoding="utf-8",
    )
    print(
        f"Enriched {len(districts)} districts from "
        f"{payload['meta']['canonical_fact_source_count']} analytical tables."
    )


if __name__ == "__main__":
    main()
