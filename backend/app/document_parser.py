"""
SkillBridge AI - Safe In-Memory Document Parser
Extracts text from PDF, DOCX, and TXT documents.
Processes files strictly in-memory without persistent disk retention for strict privacy compliance.
Provides graceful fallbacks for scanned or empty documents.
"""

import io
import re
import zipfile
import xml.etree.ElementTree as ET
from typing import Tuple, Optional
import pypdf


def extract_text_from_pdf(file_bytes: bytes) -> Tuple[str, Optional[str]]:
    """
    Extract text from PDF bytes using pypdf.
    Returns (extracted_text, warning_or_error_message).
    """
    try:
        pdf_stream = io.BytesIO(file_bytes)
        reader = pypdf.PdfReader(pdf_stream)
        
        if len(reader.pages) == 0:
            return "", "The uploaded PDF document contains 0 pages."

        extracted_pages = []
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                extracted_pages.append(page_text)

        full_text = "\n\n".join(extracted_pages).strip()

        if len(full_text) < 25:
            return full_text, (
                "Scanned or Image-based PDF detected: The document contains little or no selectable digital text. "
                "SkillBridge AI processes selectable digital text; please upload a digital PDF, DOCX, or paste the text directly."
            )

        return full_text, None

    except Exception as e:
        return "", f"Failed to parse PDF document: {str(e)}"


def extract_text_from_docx(file_bytes: bytes) -> Tuple[str, Optional[str]]:
    """
    Extract text from DOCX bytes using standard zipfile and XML parsing.
    Requires no external native binary dependencies and works seamlessly.
    """
    try:
        docx_stream = io.BytesIO(file_bytes)
        with zipfile.ZipFile(docx_stream) as z:
            if "word/document.xml" not in z.namelist():
                return "", "Invalid DOCX file structure: word/document.xml not found."
            
            xml_content = z.read("word/document.xml")
            tree = ET.fromstring(xml_content)
            
            # XML namespace for WordML
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for p in tree.iterfind('.//w:p', namespaces):
                texts = [node.text for node in p.iterfind('.//w:t', namespaces) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            
            full_text = "\n".join(paragraphs).strip()
            
            if not full_text:
                return "", "The uploaded DOCX file does not contain any readable text paragraphs."
                
            return full_text, None

    except Exception as e:
        return "", f"Failed to parse DOCX document: {str(e)}"


def parse_uploaded_document(filename: str, file_bytes: bytes) -> Tuple[str, Optional[str]]:
    """
    Route document parsing based on file extension.
    Supported extensions: .pdf, .docx, .txt
    """
    fname_lower = filename.lower()
    
    # Validation
    if len(file_bytes) > 10 * 1024 * 1024:
        return "", "File size exceeds the 10MB limit. Please upload a smaller document."

    if fname_lower.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif fname_lower.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    elif fname_lower.endswith(".txt"):
        try:
            return file_bytes.decode("utf-8", errors="replace"), None
        except Exception as e:
            return "", f"Could not read text file: {str(e)}"
    else:
        return "", f"Unsupported file format '{filename}'. Please upload a PDF, DOCX, or TXT file."
