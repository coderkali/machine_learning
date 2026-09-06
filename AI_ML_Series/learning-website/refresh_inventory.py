"""Record source hashes for the next incremental website update (stdlib only).

This records evidence, not mastery. Review changed content before updating cards.
Website exports, environment folders, instructions and caches are excluded.
"""
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
IGNORE = {"CODEX_LEARNING_PROMPT.md", "ML_TEACHER_PROMPT.md", "AGENTS.md"}
SUFFIXES = {".ipynb", ".md", ".py", ".csv", ".html", ".js", ".css", ".png", ".jpeg", ".jpg", ".tree", ".txt"}


def refresh():
    source_map = json.loads((HERE / "learning-map.js").read_text().removeprefix("window.LEARNING_MAP = ").strip().removesuffix(";"))
    mappings = {}
    for concept in source_map["concepts"]:
        for source in concept["sources"]:
            mappings.setdefault(source["path"], []).append(concept["id"])
    files = []
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file() or HERE in path.parents or path.suffix.lower() not in SUFFIXES:
            continue
        if any(part.startswith(".") or part in {"node_modules", "__pycache__", "venv", "pizza_env", "build", "dist"} for part in path.relative_to(ROOT).parts):
            continue
        if path.name in IGNORE:
            continue
        relative = path.relative_to(ROOT).as_posix()
        content = path.read_bytes()
        record = {"path": relative, "sha256": hashlib.sha256(content).hexdigest(), "bytes": len(content), "conceptIds": mappings.get(relative, [])}
        if path.suffix == ".ipynb":
            notebook = json.loads(content)
            record.update(cells=len(notebook["cells"]), executedCodeCells=sum(c.get("execution_count") is not None for c in notebook["cells"]),
                          savedErrorCount=sum(o.get("output_type") == "error" for c in notebook["cells"] for o in c.get("outputs", [])))
        files.append(record)
    result = {"lastUpdated": source_map["meta"]["lastUpdated"], "previousWebsiteUpdate": "2026-09-03", "previousWebsiteCommit": "0c7208e",
              "scope": "AI_ML_Series learning artifacts; excludes website outputs and workflow instructions. Foundations_Archive was scanned as prior evidence and is not promoted to current-course mastery.",
              "files": files, "unmappedFiles": [r["path"] for r in files if not r["conceptIds"]]}
    (HERE / "source-inventory.json").write_text(json.dumps(result, indent=2) + "\n")
    print(f"Recorded {len(files)} learning sources; {len(result['unmappedFiles'])} unmapped.")


if __name__ == "__main__":
    refresh()
