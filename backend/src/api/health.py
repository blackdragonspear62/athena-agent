"""
Health Check API Router
"""
from fastapi import APIRouter, Request
from datetime import datetime
import platform
import sys

router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "athena-agent-api"
    }


@router.get("/ready")
async def readiness_check(request: Request):
    """Kubernetes readiness probe"""
    try:
        # Check if core services are initialized
        skill_registry = request.app.state.skill_registry
        agent_orchestrator = request.app.state.agent_orchestrator
        
        skill_count = await skill_registry.count()
        agent_count = await agent_orchestrator.agent_count()
        
        return {
            "status": "ready",
            "checks": {
                "skill_registry": {"status": "ok", "skills": skill_count},
                "agent_orchestrator": {"status": "ok", "agents": agent_count}
            }
        }
    except Exception as e:
        return {
            "status": "not_ready",
            "error": str(e)
        }


@router.get("/live")
async def liveness_check():
    """Kubernetes liveness probe"""
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/info")
async def system_info(request: Request):
    """Get system information"""
    skill_registry = request.app.state.skill_registry
    agent_orchestrator = request.app.state.agent_orchestrator
    
    return {
        "service": "athena-agent-api",
        "version": "2.0.0",
        "python_version": sys.version,
        "platform": platform.platform(),
        "stats": {
            "total_skills": await skill_registry.count(),
            "total_agents": await agent_orchestrator.agent_count(),
            "categories": len(await skill_registry.get_categories())
        },
        "timestamp": datetime.utcnow().isoformat()
    }
