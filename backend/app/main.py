"""
SkillBridge AI - FastAPI Application Server
Provides secure, privacy-preserving endpoints for document text parsing,
skill extraction, job-requirement matching, comparative analysis, and academic evaluation.
"""

import time
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .taxonomy import SKILL_TAXONOMY, CATEGORIES
from .extractor_keyword import extract_skills_keyword
from .extractor_nlp import extract_skills_nlp
from .matcher import match_skills
from .document_parser import parse_uploaded_document
from .evaluation import run_evaluation_benchmark, EVALUATION_DATASET
from .sample_data import SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS

app = FastAPI(
    title="SkillBridge AI - Skill Extraction & Matching API",
    description="Explainable, privacy-preserving resume skill extractor and job-skill matcher.",
    version="1.0.0"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request Models ---
class ExtractRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Source text to extract skills from")
    method: str = Field("keyword", description="Extraction method: 'keyword', 'nlp_assisted', or 'compare_both'")
    source: str = Field("document", description="Label for source: 'resume' or 'job_description'")


class MatchRequest(BaseModel):
    resume_skills: List[Dict[str, Any]]
    job_skills: List[Dict[str, Any]]
    method: str = "keyword"


class AnalyzeRequest(BaseModel):
    resume_text: str = Field(..., min_length=1, description="Text of the candidate resume")
    job_text: str = Field(..., min_length=1, description="Text of the job description")
    method: str = Field("keyword", description="'keyword', 'nlp_assisted', or 'compare_both'")


# --- Endpoints ---

@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "SkillBridge AI API",
        "version": "1.0.0",
        "taxonomy_size": len(SKILL_TAXONOMY),
        "categories_count": len(CATEGORIES)
    }


@app.get("/api/skills")
def get_skills_taxonomy():
    """Return the entire transparent skill taxonomy and categories."""
    return {
        "categories": CATEGORIES,
        "skills": SKILL_TAXONOMY,
        "total_skills": len(SKILL_TAXONOMY)
    }


@app.get("/api/sample-data")
def get_sample_data():
    """Return synthetic sample resumes and job descriptions for instant exploration."""
    return {
        "sample_resumes": SAMPLE_RESUMES,
        "sample_jobs": SAMPLE_JOB_DESCRIPTIONS
    }


@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    Safely process uploaded PDF, DOCX, or TXT file strictly in-memory.
    No permanent document storage is performed.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename not provided.")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    extracted_text, warning = parse_uploaded_document(file.filename, contents)
    
    if not extracted_text and warning:
        raise HTTPException(status_code=422, detail=warning)

    return {
        "filename": file.filename,
        "size_bytes": len(contents),
        "text": extracted_text,
        "character_count": len(extracted_text),
        "warning": warning,
        "status": "success"
    }


@app.post("/api/extract-skills")
def extract_skills_endpoint(req: ExtractRequest):
    """
    Extract skills from text using either Keyword or NLP-assisted method.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be blank.")

    t0 = time.perf_counter()
    if req.method == "nlp_assisted":
        skills = extract_skills_nlp(req.text, source=req.source)
    else:
        skills = extract_skills_keyword(req.text, source=req.source)
    duration_ms = round((time.perf_counter() - t0) * 1000, 2)

    return {
        "skills": skills,
        "total_extracted": len(skills),
        "method": req.method,
        "duration_ms": duration_ms
    }


@app.post("/api/match-skills")
def match_skills_endpoint(req: MatchRequest):
    """
    Compare resume skills and job requirements.
    """
    return match_skills(req.resume_skills, req.job_skills, method_name=req.method)


@app.post("/api/analyze")
def analyze_skills_endpoint(req: AnalyzeRequest):
    """
    End-to-end skill extraction, normalization, and overlap calculation.
    Supports 'keyword', 'nlp_assisted', and 'compare_both' modes.
    """
    if not req.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be blank.")
    if not req.job_text.strip():
        raise HTTPException(status_code=400, detail="Job description text cannot be blank.")

    t_start = time.perf_counter()

    if req.method == "compare_both":
        # Run Keyword method
        t_kw0 = time.perf_counter()
        kw_resume_skills = extract_skills_keyword(req.resume_text, source="resume")
        kw_job_skills = extract_skills_keyword(req.job_text, source="job_description")
        kw_match = match_skills(kw_resume_skills, kw_job_skills, method_name="keyword")
        kw_duration = round((time.perf_counter() - t_kw0) * 1000, 2)

        # Run NLP method
        t_nlp0 = time.perf_counter()
        nlp_resume_skills = extract_skills_nlp(req.resume_text, source="resume")
        nlp_job_skills = extract_skills_nlp(req.job_text, source="job_description")
        nlp_match = match_skills(nlp_resume_skills, nlp_job_skills, method_name="nlp_assisted")
        nlp_duration = round((time.perf_counter() - t_nlp0) * 1000, 2)

        # Compute method difference analysis
        kw_matched_set = set(m["skill"] for m in kw_match["matched_skills"])
        nlp_matched_set = set(m["skill"] for m in nlp_match["matched_skills"])

        common_matches = sorted(list(kw_matched_set.intersection(nlp_matched_set)))
        only_kw = sorted(list(kw_matched_set - nlp_matched_set))
        only_nlp = sorted(list(nlp_matched_set - kw_matched_set))

        total_duration = round((time.perf_counter() - t_start) * 1000, 2)

        # Main active result defaults to Keyword Baseline for transparency, with NLP comparison attached
        result = kw_match
        result["total_pipeline_ms"] = total_duration
        result["method_comparison"] = {
            "keyword_duration_ms": kw_duration,
            "nlp_duration_ms": nlp_duration,
            "keyword_overlap": kw_match["summary"]["skill_overlap_percentage"],
            "nlp_overlap": nlp_match["summary"]["skill_overlap_percentage"],
            "keyword_matched_count": len(kw_matched_set),
            "nlp_matched_count": len(nlp_matched_set),
            "skills_matched_by_both": common_matches,
            "skills_only_in_keyword": only_kw,
            "skills_only_in_nlp": only_nlp,
            "nlp_detailed_results": nlp_match
        }
        return result

    elif req.method == "nlp_assisted":
        resume_skills = extract_skills_nlp(req.resume_text, source="resume")
        job_skills = extract_skills_nlp(req.job_text, source="job_description")
        result = match_skills(resume_skills, job_skills, method_name="nlp_assisted")
        result["total_pipeline_ms"] = round((time.perf_counter() - t_start) * 1000, 2)
        return result

    else:
        # Default: Keyword baseline
        resume_skills = extract_skills_keyword(req.resume_text, source="resume")
        job_skills = extract_skills_keyword(req.job_text, source="job_description")
        result = match_skills(resume_skills, job_skills, method_name="keyword")
        result["total_pipeline_ms"] = round((time.perf_counter() - t_start) * 1000, 2)
        return result


@app.post("/api/evaluate")
def evaluate_endpoint():
    """
    Run the academic evaluation benchmark against ground-truth data.
    """
    return run_evaluation_benchmark()
