"""
SkillBridge AI - Skill Matching & Overlap Calculation Engine
Calculates explainable skill overlap metrics, identifies matched and missing requirements,
tracks additional candidate skills, flags uncertain matches, and generates the comparison matrix.
"""

from typing import List, Dict, Any, Optional


def match_skills(
    resume_skills: List[Dict[str, Any]],
    job_skills: List[Dict[str, Any]],
    method_name: str = "keyword"
) -> Dict[str, Any]:
    """
    Compare resume skills with job description requirements.
    Calculates exact, explainable overlap percentage:
    Skill Overlap (%) = (Matched Required Skills / Total Distinct Required Skills) * 100
    """
    resume_skill_map = {item["skill"]: item for item in resume_skills}
    job_skill_map = {item["skill"]: item for item in job_skills}

    resume_skill_names = set(resume_skill_map.keys())
    job_skill_names = set(job_skill_map.keys())

    # Matched skills (intersection)
    matched_names = resume_skill_names.intersection(job_skill_names)
    
    # Missing required skills (in job description, but not detected in resume)
    missing_names = job_skill_names - resume_skill_names
    
    # Additional resume skills (in resume, but not requested in job description)
    additional_names = resume_skill_names - job_skill_names

    # Matched skill list with evidence from BOTH sources
    matched_skills = []
    for name in sorted(matched_names):
        r_item = resume_skill_map[name]
        j_item = job_skill_map[name]
        is_uncertain = r_item.get("is_uncertain", False) or j_item.get("is_uncertain", False)
        
        matched_skills.append({
            "skill": name,
            "category": r_item.get("category", "Other"),
            "resume_matched_text": r_item.get("matched_text", name),
            "resume_evidence": r_item.get("evidence", "Detected in resume"),
            "job_matched_text": j_item.get("matched_text", name),
            "job_evidence": j_item.get("evidence", "Required in job description"),
            "extraction_method": r_item.get("method", method_name),
            "confidence": min(r_item.get("confidence", 1.0), j_item.get("confidence", 1.0)),
            "is_uncertain": is_uncertain,
            "soft_skill": r_item.get("soft_skill", False),
            "status": "matched"
        })

    # Missing skill list
    missing_skills = []
    for name in sorted(missing_names):
        j_item = job_skill_map[name]
        missing_skills.append({
            "skill": name,
            "category": j_item.get("category", "Other"),
            "job_matched_text": j_item.get("matched_text", name),
            "job_evidence": j_item.get("evidence", "Required in job description"),
            "extraction_method": j_item.get("method", method_name),
            "confidence": j_item.get("confidence", 1.0),
            "is_uncertain": j_item.get("is_uncertain", False),
            "soft_skill": j_item.get("soft_skill", False),
            "status": "not_detected",
            "user_confirmed": False  # User can toggle this in the UI
        })

    # Additional skills list
    additional_skills = []
    for name in sorted(additional_names):
        r_item = resume_skill_map[name]
        additional_skills.append({
            "skill": name,
            "category": r_item.get("category", "Other"),
            "resume_matched_text": r_item.get("matched_text", name),
            "resume_evidence": r_item.get("evidence", "Detected in resume"),
            "extraction_method": r_item.get("method", method_name),
            "confidence": r_item.get("confidence", 1.0),
            "is_uncertain": r_item.get("is_uncertain", False),
            "soft_skill": r_item.get("soft_skill", False),
            "status": "additional"
        })

    # Uncertain matches across resume & job
    uncertain_matches = []
    for item in matched_skills + missing_skills + additional_skills:
        if item.get("is_uncertain", False):
            uncertain_matches.append(item)

    # Overlap Score Calculation
    total_required = len(job_skill_names)
    matched_count = len(matched_names)

    if total_required > 0:
        overlap_percentage = round((matched_count / total_required) * 100, 1)
        score_status = "calculated"
        score_message = f"{matched_count} of {total_required} job-required skills detected in resume."
    else:
        overlap_percentage = 0.0
        score_status = "unavailable"
        score_message = "No identifiable required skills were detected in the job description. Please provide a more detailed job description."

    # Build Skill Comparison Matrix Table
    comparison_matrix = []
    # 1. Matched skills
    for m in matched_skills:
        comparison_matrix.append({
            "skill": m["skill"],
            "category": m["category"],
            "resume_presence": "Detected",
            "job_requirement": "Required",
            "status": "Matched",
            "resume_evidence": m["resume_evidence"],
            "job_evidence": m["job_evidence"],
            "is_uncertain": m["is_uncertain"]
        })
    # 2. Missing skills
    for miss in missing_skills:
        comparison_matrix.append({
            "skill": miss["skill"],
            "category": miss["category"],
            "resume_presence": "Not Detected",
            "job_requirement": "Required",
            "status": "Missing",
            "resume_evidence": "Not detected in supplied resume document",
            "job_evidence": miss["job_evidence"],
            "is_uncertain": miss["is_uncertain"]
        })
    # 3. Additional skills
    for add in additional_skills:
        comparison_matrix.append({
            "skill": add["skill"],
            "category": add["category"],
            "resume_presence": "Detected",
            "job_requirement": "Not Stated",
            "status": "Additional",
            "resume_evidence": add["resume_evidence"],
            "job_evidence": "Not requested in job description",
            "is_uncertain": add["is_uncertain"]
        })

    # Category breakdown stats for charts
    categories = set(item["category"] for item in comparison_matrix)
    category_breakdown = []
    for cat in sorted(categories):
        cat_matched = sum(1 for m in matched_skills if m["category"] == cat)
        cat_missing = sum(1 for miss in missing_skills if miss["category"] == cat)
        cat_additional = sum(1 for a in additional_skills if a["category"] == cat)
        category_breakdown.append({
            "category": cat,
            "matched": cat_matched,
            "missing": cat_missing,
            "additional": cat_additional,
            "total_required": cat_matched + cat_missing
        })

    return {
        "summary": {
            "total_resume_skills": len(resume_skill_names),
            "total_job_required_skills": total_required,
            "matched_skills_count": matched_count,
            "missing_skills_count": len(missing_names),
            "additional_skills_count": len(additional_names),
            "uncertain_matches_count": len(uncertain_matches),
            "skill_overlap_percentage": overlap_percentage,
            "score_status": score_status,
            "score_message": score_message,
            "formula_applied": "Skill Overlap (%) = (Matched Required Skills / Total Distinct Required Skills) × 100"
        },
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "additional_skills": additional_skills,
        "uncertain_matches": uncertain_matches,
        "comparison_matrix": comparison_matrix,
        "category_breakdown": category_breakdown,
        "method": method_name
    }
