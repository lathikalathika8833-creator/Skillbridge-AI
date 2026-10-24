"""
Contextual NLP-Assisted Skill Extractor
Uses n-gram candidate extraction, term-context boundary analysis,
and TF-IDF cosine semantic similarity against skill taxonomy descriptions.
Flags uncertain contextual matches and calculates evidence-based confidence scores.
"""

import re
import os
from typing import List, Dict, Any, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .taxonomy import SKILL_TAXONOMY, get_all_canonical_skills
from .extractor_keyword import extract_evidence_snippet

# Pre-compute taxonomy profile corpus for TF-IDF contextual similarity
_TAXONOMY_SKILLS = get_all_canonical_skills()
_TAXONOMY_DESCRIPTIONS = [
    f"{s} {SKILL_TAXONOMY[s]['category']} {' '.join(SKILL_TAXONOMY[s]['aliases'])} {SKILL_TAXONOMY[s]['description']}"
    for s in _TAXONOMY_SKILLS
]

# Initialize TF-IDF Vectorizer fitted on taxonomy descriptions
_VECTORIZER = TfidfVectorizer(ngram_range=(1, 3), lowercase=True, stop_words="english")
_TAXONOMY_VECTORS = _VECTORIZER.fit_transform(_TAXONOMY_DESCRIPTIONS)


def _extract_candidate_phrases(text: str) -> List[Tuple[str, int, int]]:
    """
    Extract candidate noun phrases, technical tokens, and multi-word phrases (1-3 grams)
    along with character spans.
    """
    clean_text = re.sub(r"[^\w\s\+\#\./-]", " ", text)
    tokens_with_spans = []
    
    for match in re.finditer(r"\b[\w\+\#\./-]+\b", text):
        token = match.group(0).strip()
        if len(token) > 1 or token.isupper():
            tokens_with_spans.append((token, match.start(), match.end()))

    candidates = []
    n_tokens = len(tokens_with_spans)
    
    # 1-grams, 2-grams, 3-grams
    for i in range(n_tokens):
        # 1-gram
        t1, s1, e1 = tokens_with_spans[i]
        candidates.append((t1, s1, e1))
        
        # 2-gram
        if i + 1 < n_tokens:
            t2, _, e2 = tokens_with_spans[i + 1]
            # Only combine if adjacent in text (within 3 chars)
            if tokens_with_spans[i + 1][1] - e1 <= 3:
                candidates.append((f"{t1} {t2}", s1, e2))
                
        # 3-gram
        if i + 2 < n_tokens:
            t3, _, e3 = tokens_with_spans[i + 2]
            if tokens_with_spans[i + 2][1] - tokens_with_spans[i + 1][2] <= 3:
                candidates.append((f"{t1} {t2} {t3}", s1, e3))
                
    return candidates


def extract_skills_nlp(text: str, source: str = "document") -> List[Dict[str, Any]]:
    """
    NLP-assisted contextual extraction.
    Combines taxonomy pattern matching with TF-IDF context vector matching to detect
    skills, compute confidence scores, and flag ambiguous matches.
    """
    if not text or not text.strip():
        return []

    detected_skills: Dict[str, Dict[str, Any]] = {}
    
    # 1. First pass: contextual candidate scanning
    candidates = _extract_candidate_phrases(text)
    
    for phrase, start_pos, end_pos in candidates:
        phrase_clean = phrase.strip()
        phrase_lower = phrase_clean.lower()
        
        # Check against canonical taxonomy and aliases
        matched_canonical = None
        exact_match = False
        
        for canonical, meta in SKILL_TAXONOMY.items():
            if phrase_lower == canonical.lower():
                matched_canonical = canonical
                exact_match = True
                break
            for alias in meta["aliases"]:
                if phrase_lower == alias.lower():
                    matched_canonical = canonical
                    exact_match = False
                    break
            if matched_canonical:
                break
                
        if matched_canonical:
            meta = SKILL_TAXONOMY[matched_canonical]
            anti_patterns = meta.get("anti_patterns", [])
            
            # Anti-pattern check in context
            ctx_start = max(0, start_pos - 20)
            ctx_end = min(len(text), end_pos + 20)
            ctx_text = text[ctx_start:ctx_end].lower()
            
            if any(anti.lower() in ctx_text for anti in anti_patterns):
                continue

            # Compute semantic context similarity
            context_window = text[max(0, start_pos - 60):min(len(text), end_pos + 60)]
            try:
                ctx_vec = _VECTORIZER.transform([context_window])
                skill_idx = _TAXONOMY_SKILLS.index(matched_canonical)
                sim_score = float(cosine_similarity(ctx_vec, _TAXONOMY_VECTORS[skill_idx : skill_idx + 1])[0][0])
            except Exception:
                sim_score = 0.5

            # NLP confidence formula: weighted blend of match directness and context similarity
            base_score = 0.88 if exact_match else 0.78
            # Cap confidence between 0.65 and 0.99
            nlp_confidence = round(min(0.99, max(0.65, base_score + (sim_score * 0.15))), 2)

            is_uncertain = (len(phrase_clean) <= 2 and phrase_clean.isupper()) or (nlp_confidence < 0.75)
            evidence = extract_evidence_snippet(text, start_pos, end_pos)

            if matched_canonical not in detected_skills:
                detected_skills[matched_canonical] = {
                    "skill": matched_canonical,
                    "category": meta["category"],
                    "matched_text": phrase_clean,
                    "source": source,
                    "method": "nlp_assisted",
                    "status": "detected",
                    "evidence": evidence,
                    "confidence": nlp_confidence,
                    "is_uncertain": is_uncertain,
                    "soft_skill": meta.get("soft_skill", False),
                    "occurrences": 1,
                }
            else:
                detected_skills[matched_canonical]["occurrences"] += 1
                if nlp_confidence > detected_skills[matched_canonical]["confidence"]:
                    detected_skills[matched_canonical]["confidence"] = nlp_confidence
                if not is_uncertain:
                    detected_skills[matched_canonical]["is_uncertain"] = False

    return list(detected_skills.values())
