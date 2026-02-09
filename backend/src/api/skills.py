"""
Skills API Router
"""
from fastapi import APIRouter, HTTPException, Request, Query
from typing import Optional, List
from pydantic import BaseModel

router = APIRouter()


class SkillResponse(BaseModel):
    """Skill response model"""
    id: str
    name: str
    description: str
    category: str
    author: str
    version: str
    tags: List[str]
    usage_count: int
    rating: float


class SkillSearchRequest(BaseModel):
    """Skill search request"""
    query: Optional[str] = ""
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    limit: int = 50
    offset: int = 0


class InstallSkillRequest(BaseModel):
    """Install skill request"""
    skill_id: str


@router.get("/")
async def list_skills(
    request: Request,
    query: str = Query("", description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """List all skills with optional filters"""
    registry = request.app.state.skill_registry
    
    skills = await registry.search_skills(
        query=query,
        category=category,
        limit=limit,
        offset=offset
    )
    
    return {
        "total": await registry.count(),
        "limit": limit,
        "offset": offset,
        "skills": [skill.to_dict() for skill in skills]
    }


@router.get("/categories")
async def get_categories(request: Request):
    """Get all skill categories"""
    registry = request.app.state.skill_registry
    categories = await registry.get_categories()
    
    return {
        "total_categories": len(categories),
        "categories": categories
    }


@router.get("/{skill_id}")
async def get_skill(skill_id: str, request: Request):
    """Get a specific skill by ID"""
    registry = request.app.state.skill_registry
    skill = await registry.get_skill(skill_id)
    
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return skill.to_dict()


@router.post("/install")
async def install_skill(req: InstallSkillRequest, request: Request):
    """Install a skill"""
    registry = request.app.state.skill_registry
    
    success = await registry.install_skill(req.skill_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return {"status": "installed", "skill_id": req.skill_id}


@router.get("/category/{category}")
async def get_skills_by_category(
    category: str,
    request: Request,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get skills by category"""
    registry = request.app.state.skill_registry
    
    skills = await registry.search_skills(
        category=category,
        limit=limit,
        offset=offset
    )
    
    categories = await registry.get_categories()
    if category not in categories:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {
        "category": category,
        "category_info": categories[category],
        "skills": [skill.to_dict() for skill in skills]
    }
