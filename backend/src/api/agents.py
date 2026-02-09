"""
Agents API Router
"""
from fastapi import APIRouter, HTTPException, Request, Query
from typing import Optional, List
from pydantic import BaseModel

router = APIRouter()


class TaskRequest(BaseModel):
    """Task request model"""
    agent_id: str
    input: str


class TaskResponse(BaseModel):
    """Task response model"""
    task_id: str
    status: str
    output: Optional[str] = None


@router.get("/")
async def list_agents(request: Request):
    """List all available agents"""
    orchestrator = request.app.state.agent_orchestrator
    agents = await orchestrator.get_all_agents()
    
    return {
        "total": len(agents),
        "agents": [agent.to_dict() for agent in agents]
    }


@router.get("/stats")
async def get_agent_stats(request: Request):
    """Get aggregated agent statistics"""
    orchestrator = request.app.state.agent_orchestrator
    stats = await orchestrator.get_agent_stats()
    
    return stats


@router.get("/{agent_id}")
async def get_agent(agent_id: str, request: Request):
    """Get a specific agent by ID"""
    orchestrator = request.app.state.agent_orchestrator
    agent = await orchestrator.get_agent(agent_id)
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return agent.to_dict()


@router.post("/task")
async def create_task(req: TaskRequest, request: Request):
    """Create a new task for an agent"""
    orchestrator = request.app.state.agent_orchestrator
    
    task = await orchestrator.create_task(req.agent_id, req.input)
    
    if not task:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return {
        "task_id": task.id,
        "agent_id": task.agent_id,
        "status": task.status,
        "created_at": task.created_at.isoformat()
    }


@router.post("/task/{task_id}/execute")
async def execute_task(task_id: str, request: Request):
    """Execute a pending task"""
    orchestrator = request.app.state.agent_orchestrator
    
    task = await orchestrator.execute_task(task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {
        "task_id": task.id,
        "status": task.status,
        "output": task.output,
        "error": task.error,
        "completed_at": task.completed_at.isoformat() if task.completed_at else None
    }


@router.get("/{agent_id}/skills")
async def get_agent_skills(agent_id: str, request: Request):
    """Get skills assigned to an agent"""
    orchestrator = request.app.state.agent_orchestrator
    agent = await orchestrator.get_agent(agent_id)
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return {
        "agent_id": agent_id,
        "agent_name": agent.name,
        "skills": agent.config.skills
    }
