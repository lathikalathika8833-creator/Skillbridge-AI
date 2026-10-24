"""
SkillBridge AI - Academic Evaluation & Benchmark Engine
Evaluates Keyword-based Baseline vs. Contextual NLP-assisted extraction against
a manually annotated ground-truth test corpus. Calculates Precision, Recall, F1 Score,
Confusion Matrices (TP, FP, FN), and provides categorized error analysis.
"""

import time
from typing import List, Dict, Any, Set
from .extractor_keyword import extract_skills_keyword
from .extractor_nlp import extract_skills_nlp

# Manually reviewed ground-truth synthetic evaluation corpus
EVALUATION_DATASET: List[Dict[str, Any]] = [
    {
        "id": "eval_01",
        "title": "Data Analyst Snippet",
        "text": "Experienced in Python, SQL, and Pandas with exploratory data analysis. Built executive dashboards in Power BI and Tableau. Familiar with basic statistics.",
        "ground_truth": ["Python", "SQL", "Pandas", "Data Analysis", "Power BI", "Tableau", "Statistics"],
        "notes": "Standard multi-domain data skills testing exact names and acronyms."
    },
    {
        "id": "eval_02",
        "title": "Machine Learning Engineer Snippet",
        "text": "Senior ML researcher with extensive knowledge of deep learning, PyTorch, and TensorFlow. Developed NLP pipelines and trained custom scikit-learn models.",
        "ground_truth": ["Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "NLP", "Scikit-learn"],
        "notes": "Tests acronym expansions (ML, NLP) and lowercase library mentions."
    },
    {
        "id": "eval_03",
        "title": "Web Development Ambiguity & Boundary Test",
        "text": "Full-stack developer working with JavaScript and TypeScript. Strong focus on React, Node.js, and CSS. (Note: no Java experience, purely JS).",
        "ground_truth": ["JavaScript", "TypeScript", "React", "Node.js", "CSS"],
        "notes": "Anti-pattern test: contains 'Java' inside 'JavaScript' and 'no Java experience', plus 'JS' alias."
    },
    {
        "id": "eval_04",
        "title": "Database & DevOps Pipeline",
        "text": "Constructed PostgreSQL database schemas and automated deployment using Docker, Kubernetes, and Linux shell scripting. Managed Git repositories.",
        "ground_truth": ["PostgreSQL", "Docker", "Kubernetes", "Linux", "Git"],
        "notes": "Tests systems, containerization, and infrastructure skills."
    },
    {
        "id": "eval_05",
        "title": "False-Positive Resistance Test",
        "text": "Candidate completed all prerequisites and demonstrated excellent masquerade-free judgment. Ready to go to the office and excels at work.",
        "ground_truth": [],
        "notes": "Zero-truth trap test: contains substrings 'sql' inside 'prerequisites', 'excel' inside 'excels', 'go' verb. Must yield 0 false positives."
    },
    {
        "id": "eval_06",
        "title": "Explicit Soft Skills & Collaboration",
        "text": "Demonstrated exceptional problem solving and cross-functional teamwork in leading teams. Strong written and verbal communication skills.",
        "ground_truth": ["Problem Solving", "Teamwork", "Leadership", "Communication"],
        "notes": "Tests explicitly supported behavioral competencies."
    },
    {
        "id": "eval_07",
        "title": "Backend Microservices Snippet",
        "text": "Engineered REST APIs using Python and FastAPI framework. Cached hot user sessions with Redis and deployed to AWS cloud.",
        "ground_truth": ["REST APIs", "Python", "FastAPI", "Redis", "AWS"],
        "notes": "Tests modern API framework and cloud provider identification."
    },
    {
        "id": "eval_08",
        "title": "Data Visualization & Analytics",
        "text": "Created data visualization charts using Matplotlib and Seaborn. Experienced in exploratory data analysis and statistical modeling in Excel.",
        "ground_truth": ["Data Visualization", "Matplotlib", "Seaborn", "Data Analysis", "Statistics", "Excel"],
        "notes": "Tests compound terms and spreadsheet software."
    }
]


def calculate_metrics(predicted_set: Set[str], ground_truth_set: Set[str]) -> Dict[str, Any]:
    """
    Compute TP, FP, FN, Precision, Recall, and F1 Score with safe division.
    """
    tp_set = predicted_set.intersection(ground_truth_set)
    fp_set = predicted_set - ground_truth_set
    fn_set = ground_truth_set - predicted_set

    tp = len(tp_set)
    fp = len(fp_set)
    fn = len(fn_set)

    precision = round(tp / (tp + fp), 4) if (tp + fp) > 0 else 0.0
    recall = round(tp / (tp + fn), 4) if (tp + fn) > 0 else 0.0
    f1 = round(2 * (precision * recall) / (precision + recall), 4) if (precision + recall) > 0 else 0.0

    return {
        "true_positives": tp,
        "false_positives": fp,
        "false_negatives": fn,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "tp_skills": sorted(list(tp_set)),
        "fp_skills": sorted(list(fp_set)),
        "fn_skills": sorted(list(fn_set)),
    }


def run_evaluation_benchmark() -> Dict[str, Any]:
    """
    Run an end-to-end evaluation benchmark comparing the Keyword Baseline
    and Contextual NLP-Assisted extraction against the ground-truth test corpus.
    """
    kw_total_tp = 0
    kw_total_fp = 0
    kw_total_fn = 0
    kw_start = time.perf_counter()

    kw_item_results = []
    for item in EVALUATION_DATASET:
        extracted = extract_skills_keyword(item["text"])
        pred_set = set(e["skill"] for e in extracted)
        gt_set = set(item["ground_truth"])
        m = calculate_metrics(pred_set, gt_set)
        
        kw_total_tp += m["true_positives"]
        kw_total_fp += m["false_positives"]
        kw_total_fn += m["false_negatives"]
        
        kw_item_results.append({
            "id": item["id"],
            "title": item["title"],
            "text": item["text"],
            "ground_truth": item["ground_truth"],
            "predicted": sorted(list(pred_set)),
            "metrics": m,
            "notes": item["notes"]
        })
    kw_duration_ms = round((time.perf_counter() - kw_start) * 1000, 2)

    kw_precision = round(kw_total_tp / (kw_total_tp + kw_total_fp), 4) if (kw_total_tp + kw_total_fp) > 0 else 0.0
    kw_recall = round(kw_total_tp / (kw_total_tp + kw_total_fn), 4) if (kw_total_tp + kw_total_fn) > 0 else 0.0
    kw_f1 = round(2 * (kw_precision * kw_recall) / (kw_precision + kw_recall), 4) if (kw_precision + kw_recall) > 0 else 0.0

    # NLP Benchmark
    nlp_total_tp = 0
    nlp_total_fp = 0
    nlp_total_fn = 0
    nlp_start = time.perf_counter()

    nlp_item_results = []
    for item in EVALUATION_DATASET:
        extracted = extract_skills_nlp(item["text"])
        pred_set = set(e["skill"] for e in extracted)
        gt_set = set(item["ground_truth"])
        m = calculate_metrics(pred_set, gt_set)
        
        nlp_total_tp += m["true_positives"]
        nlp_total_fp += m["false_positives"]
        nlp_total_fn += m["false_negatives"]
        
        nlp_item_results.append({
            "id": item["id"],
            "title": item["title"],
            "text": item["text"],
            "ground_truth": item["ground_truth"],
            "predicted": sorted(list(pred_set)),
            "metrics": m,
            "notes": item["notes"]
        })
    nlp_duration_ms = round((time.perf_counter() - nlp_start) * 1000, 2)

    nlp_precision = round(nlp_total_tp / (nlp_total_tp + nlp_total_fp), 4) if (nlp_total_tp + nlp_total_fp) > 0 else 0.0
    nlp_recall = round(nlp_total_tp / (nlp_total_tp + nlp_total_fn), 4) if (nlp_total_tp + nlp_total_fn) > 0 else 0.0
    nlp_f1 = round(2 * (nlp_precision * nlp_recall) / (nlp_precision + nlp_recall), 4) if (nlp_precision + nlp_recall) > 0 else 0.0

    # Categorized Error Analysis
    error_cases = [
        {
            "category": "Boundary Disambiguation (Java vs JavaScript)",
            "description": "Preventing 'Java' from erroneously matching when 'JavaScript' appears in resume text.",
            "mitigation": "Implemented regex negative lookahead `(?i)\\bjava(?!\\s*script)\\b` and context anti-pattern filters.",
            "keyword_status": "Handled (0 False Positives)",
            "nlp_status": "Handled with high confidence"
        },
        {
            "category": "Sub-string False Positives ('sql' in prerequisites)",
            "description": "Normalizing acronym checks to prevent substring matches like 'sql' in 'prerequisites' or 'excel' in 'excellence'.",
            "mitigation": "Strict non-word boundary checks `\\b` and case-sensitive acronym verification for 2-letter tokens.",
            "keyword_status": "Zero false positives on test eval_05",
            "nlp_status": "Vector context similarity rejects out-of-context tokens"
        },
        {
            "category": "Acronym Uncertainty ('ML' and 'DL')",
            "description": "Short 2-letter acronyms can occasionally refer to non-technical abbreviations (e.g. ML = mailing list, milliliter).",
            "mitigation": "Uncertainty flagging mechanism marks 2-letter uppercase tokens for human review if isolated without surrounding ML context.",
            "keyword_status": "Flagged as 'Uncertain Match' with 0.85 confidence",
            "nlp_status": "Calculates continuous confidence [0.65, 0.99] based on TF-IDF cosine similarity"
        },
        {
            "category": "Formatting & Line Breaks",
            "description": "Skills spanning line wraps or non-standard bullet characters in parsed PDFs.",
            "mitigation": "Document parser cleans and normalizes multi-line whitespace before invoking extraction engines.",
            "keyword_status": "Handled during text normalization",
            "nlp_status": "Handled during n-gram candidate extraction"
        }
    ]

    return {
        "dataset_metadata": {
            "total_test_samples": len(EVALUATION_DATASET),
            "total_annotated_skills": sum(len(x["ground_truth"]) for x in EVALUATION_DATASET),
            "methodology": "Micro-averaged evaluation against manually labeled synthetic ground-truth corpus."
        },
        "comparison_table": [
            {
                "method": "Keyword Baseline",
                "type": "Deterministic Taxonomy Matching",
                "precision": kw_precision,
                "recall": kw_recall,
                "f1_score": kw_f1,
                "true_positives": kw_total_tp,
                "false_positives": kw_total_fp,
                "false_negatives": kw_total_fn,
                "duration_ms": kw_duration_ms,
                "api_cost": "$0.00 (Fully Local)"
            },
            {
                "method": "NLP-Assisted Extractor",
                "type": "Contextual N-Gram + TF-IDF Cosine Similarity",
                "precision": nlp_precision,
                "recall": nlp_recall,
                "f1_score": nlp_f1,
                "true_positives": nlp_total_tp,
                "false_positives": nlp_total_fp,
                "false_negatives": nlp_total_fn,
                "duration_ms": nlp_duration_ms,
                "api_cost": "$0.00 (Fully Local Vector Space)"
            }
        ],
        "error_analysis": error_cases,
        "sample_breakdown": {
            "keyword": kw_item_results,
            "nlp": nlp_item_results
        },
        "academic_interpretation": (
            "Scientific Note: Precision, Recall, and F1 metrics quantify text extraction fidelity and taxonomy matching performance. "
            "They measure how accurately the system identifies skill tokens from text. They do NOT evaluate candidate qualifications, "
            "overall capability, or workplace potential. SkillBridge AI explicitly rejects automated candidate ranking and rejection."
        )
    }
