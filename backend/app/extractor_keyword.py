"""
Keyword-Based Baseline Skill Extractor
Deterministic, regex-bounded extractor adhering to the curated taxonomy.
Extracts canonical skills, detects evidence snippets, prevents false positives,
and ensures reproducible, transparent matching.
"""

import re
from typing import List, Dict, Any
from .taxonomy import SKILL_TAXONOMY


def extract_evidence_snippet(text: str, match_start: int, match_end: int, window: int = 45) -> str:
    """
    Extract a clean evidence sentence or context window around a matched skill.
    """
    start = max(0, match_start - window)
    end = min(len(text), match_end + window)
    
    prefix = "..." if start > 0 else ""
    suffix = "..." if end < len(text) else ""
    
    snippet = text[start:end].strip()
    # Normalize excessive newlines or tabs in snippet
    snippet = re.sub(r"\s+", " ", snippet)
    return f"{prefix}{snippet}{suffix}"


def extract_skills_keyword(text: str, source: str = "document") -> List[Dict[str, Any]]:
    """
    Extract canonical skills deterministically using the taxonomy regex and anti-pattern rules.
    """
    if not text or not text.strip():
        return []

    detected_skills: Dict[str, Dict[str, Any]] = {}

    for canonical_name, meta in SKILL_TAXONOMY.items():
        pattern = meta["regex"]
        anti_patterns = meta.get("anti_patterns", [])

        # Find all matches in the source text
        for match in re.finditer(pattern, text):
            matched_str = match.group(0)
            start_pos = match.start()
            end_pos = match.end()

            # Check surrounding context for anti-patterns
            # E.g. check a small window around match
            context_start = max(0, start_pos - 15)
            context_end = min(len(text), end_pos + 15)
            surrounding = text[context_start:context_end].lower()

            is_anti = False
            for anti in anti_patterns:
                if anti.lower() in surrounding:
                    is_anti = True
                    break

            if is_anti:
                continue

            # Extract clear evidence snippet
            evidence = extract_evidence_snippet(text, start_pos, end_pos)

            # Check if this match is inherently uncertain (e.g. short acronym like 'ML' or 'JS')
            is_uncertain = len(matched_str) <= 2 and matched_str.isupper()

            if canonical_name not in detected_skills:
                detected_skills[canonical_name] = {
                    "skill": canonical_name,
                    "category": meta["category"],
                    "matched_text": matched_str,
                    "source": source,
                    "method": "keyword",
                    "status": "detected",
                    "evidence": evidence,
                    "confidence": 0.85 if is_uncertain else 1.0,
                    "is_uncertain": is_uncertain,
                    "soft_skill": meta.get("soft_skill", False),
                    "occurrences": 1,
                }
            else:
                detected_skills[canonical_name]["occurrences"] += 1
                # If subsequent match was not uncertain, upgrade certainty
                if not is_uncertain:
                    detected_skills[canonical_name]["is_uncertain"] = False
                    detected_skills[canonical_name]["confidence"] = 1.0

    return list(detected_skills.values())
