"""
SkillBridge AI - Unit & Integration Test Suite
Validates skill detection, alias normalization, anti-pattern disambiguation,
edge-case handling, and metric calculation formulas.
"""

import pytest
from app.extractor_keyword import extract_skills_keyword
from app.extractor_nlp import extract_skills_nlp
from app.matcher import match_skills
from app.evaluation import calculate_metrics, run_evaluation_benchmark


def test_java_vs_javascript_disambiguation():
    """Ensure Java never matches JavaScript erroneously."""
    text_js = "Senior JavaScript developer with expertise in React, Node.js, and ES6."
    extracted_js = extract_skills_keyword(text_js)
    skills = [s["skill"] for s in extracted_js]
    assert "JavaScript" in skills
    assert "Java" not in skills, "Java must not be matched when only JavaScript is present"

    text_java = "Enterprise backend engineer with 5 years of Core Java and Spring experience."
    extracted_java = extract_skills_keyword(text_java)
    skills_java = [s["skill"] for s in extracted_java]
    assert "Java" in skills_java
    assert "JavaScript" not in skills_java


def test_sql_substring_safety():
    """Ensure SQL does not match within words like 'prerequisites'."""
    text = "Candidate has completed all academic prerequisites and masquerades as an expert."
    extracted = extract_skills_keyword(text)
    skills = [s["skill"] for s in extracted]
    assert "SQL" not in skills, "SQL must not match inside the word prerequisites"

    text_real = "Experience writing complex SQL queries and database migrations."
    extracted_real = extract_skills_keyword(text_real)
    skills_real = [s["skill"] for s in extracted_real]
    assert "SQL" in skills_real


def test_verb_go_safety():
    """Ensure common verb 'go' does not trigger false match for Go language."""
    text_verb = "We will go to the office and decide on our plans."
    extracted = extract_skills_keyword(text_verb)
    skills = [s["skill"] for s in extracted]
    assert "Go" not in skills

    text_golang = "Backend developer building microservices in Golang and Docker."
    extracted_golang = extract_skills_keyword(text_golang)
    skills_golang = [s["skill"] for s in extracted_golang]
    assert "Go" in skills_golang


def test_match_score_calculation():
    """Test exact formula: (Matched Required Skills / Total Distinct Required Skills) * 100"""
    resume_skills = [
        {"skill": "Python", "category": "Programming Languages"},
        {"skill": "SQL", "category": "Programming Languages"},
        {"skill": "Pandas", "category": "Data Analysis"},
        {"skill": "React", "category": "Web Development"},  # Additional
    ]
    job_skills = [
        {"skill": "Python", "category": "Programming Languages"},
        {"skill": "SQL", "category": "Programming Languages"},
        {"skill": "Pandas", "category": "Data Analysis"},
        {"skill": "Power BI", "category": "Business Intelligence"},  # Missing
    ]

    result = match_skills(resume_skills, job_skills)
    summary = result["summary"]

    assert summary["total_resume_skills"] == 4
    assert summary["total_job_required_skills"] == 4
    assert summary["matched_skills_count"] == 3
    assert summary["missing_skills_count"] == 1
    assert summary["additional_skills_count"] == 1
    # 3 / 4 * 100 = 75.0%
    assert summary["skill_overlap_percentage"] == 75.0
    assert summary["score_status"] == "calculated"


def test_empty_job_description_zero_division():
    """Ensure empty job description handled gracefully without division by zero."""
    resume_skills = [{"skill": "Python", "category": "Programming Languages"}]
    job_skills = []

    result = match_skills(resume_skills, job_skills)
    summary = result["summary"]
    assert summary["skill_overlap_percentage"] == 0.0
    assert summary["score_status"] == "unavailable"
    assert "No identifiable required skills" in summary["score_message"]


def test_metric_calculation_math():
    """Validate Precision, Recall, and F1 calculations including zero denominators."""
    # 1. Standard calculation
    # Pred: {A, B, C}, Ground Truth: {A, B, D}
    # TP: {A, B} = 2
    # FP: {C} = 1
    # FN: {D} = 1
    # Precision = 2 / (2 + 1) = 0.6667
    # Recall = 2 / (2 + 1) = 0.6667
    # F1 = 2 * (0.6667 * 0.6667) / (0.6667 + 0.6667) = 0.6667
    metrics = calculate_metrics({"A", "B", "C"}, {"A", "B", "D"})
    assert metrics["true_positives"] == 2
    assert metrics["false_positives"] == 1
    assert metrics["false_negatives"] == 1
    assert metrics["precision"] == 0.6667
    assert metrics["recall"] == 0.6667
    assert metrics["f1_score"] == 0.6667

    # 2. Zero predictions (safe division check)
    empty_pred = calculate_metrics(set(), {"Python", "SQL"})
    assert empty_pred["precision"] == 0.0
    assert empty_pred["recall"] == 0.0
    assert empty_pred["f1_score"] == 0.0

    # 3. Zero ground truth
    empty_gt = calculate_metrics({"Python"}, set())
    assert empty_gt["precision"] == 0.0
    assert empty_gt["recall"] == 0.0
    assert empty_gt["f1_score"] == 0.0


def test_nlp_extractor_returns_valid_structure():
    """Verify NLP extractor returns expected dictionary fields and valid confidence."""
    text = "Machine learning engineer with PyTorch and NLP experience."
    extracted = extract_skills_nlp(text)
    assert len(extracted) > 0
    for item in extracted:
        assert "skill" in item
        assert "category" in item
        assert "confidence" in item
        assert 0.0 <= item["confidence"] <= 1.0
        assert "evidence" in item


def test_benchmark_runs_successfully():
    """Ensure full benchmark suite evaluates without error."""
    benchmark_report = run_evaluation_benchmark()
    assert "comparison_table" in benchmark_report
    assert len(benchmark_report["comparison_table"]) == 2
    kw_row = benchmark_report["comparison_table"][0]
    nlp_row = benchmark_report["comparison_table"][1]
    assert kw_row["precision"] > 0.8
    assert nlp_row["precision"] > 0.8
    assert "error_analysis" in benchmark_report
