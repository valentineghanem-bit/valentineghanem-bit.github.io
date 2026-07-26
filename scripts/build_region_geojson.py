"""Dissolve the 261 district polygons into Ghana's 16 regional boundaries."""

from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

from shapely.geometry import mapping, shape
from shapely.ops import unary_union


ROOT = Path(__file__).resolve().parents[1]
DISTRICT_PATH = ROOT / "assets" / "data" / "ghana-districts.geojson"
REGION_PATH = ROOT / "assets" / "data" / "ghana-regions.geojson"

REGION_NAMES = {
    "NORTHERN EAST": "North East",
}


def display_name(raw_name: str) -> str:
    return REGION_NAMES.get(raw_name, raw_name.title())


def main() -> None:
    district_geojson = json.loads(DISTRICT_PATH.read_text(encoding="utf-8"))
    grouped = defaultdict(list)

    for feature in district_geojson["features"]:
        grouped[feature["properties"]["region"]].append(shape(feature["geometry"]))

    features = []
    for raw_name in sorted(grouped):
        geometry = unary_union(grouped[raw_name])
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "name": display_name(raw_name),
                    "district_count": len(grouped[raw_name]),
                },
                "geometry": mapping(geometry),
            }
        )

    output = {"type": "FeatureCollection", "features": features}
    REGION_PATH.write_text(
        json.dumps(output, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"Wrote {len(features)} regions to {REGION_PATH}")


if __name__ == "__main__":
    main()
