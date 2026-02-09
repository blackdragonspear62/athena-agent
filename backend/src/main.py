"""
Athena Agent - Backend API
Intelligent Multi-Agent Orchestration Platform
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from src.api import skills, agents, commands, health
from src.config.settings import settings
from src.services.skill_registry import SkillRegistry
from src.services.agent_orchestrator import AgentOrchestrator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    logger.info("🏛️ Athena Agent starting up...")
    
    # Initialize services
    app.state.skill_registry = SkillRegistry()
    app.state.agent_orchestrator = AgentOrchestrator()
    
    await app.state.skill_registry.initialize()
    await app.state.agent_orchestrator.initialize()
    
    logger.info(f"✅ Loaded {await app.state.skill_registry.count()} skills")
    logger.info(f"✅ Initialized {await app.state.agent_orchestrator.agent_count()} agents")
    
    yield
    
    # Cleanup
    logger.info("🏛️ Athena Agent shutting down...")
    await app.state.skill_registry.cleanup()
    await app.state.agent_orchestrator.cleanup()


# Create FastAPI application
app = FastAPI(
    title="Athena Agent API",
    description="Intelligent Multi-Agent Orchestration Platform",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api/health", tags=["Health"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])
app.include_router(commands.router, prefix="/api/commands", tags=["Commands"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Athena Agent",
        "version": "2.0.0",
        "status": "operational",
        "description": "Intelligent Multi-Agent Orchestration Platform"
    }


@app.get("/api")
async def api_info():
    """API information endpoint"""
    return {
        "version": "2.0.0",
        "endpoints": {
            "health": "/api/health",
            "skills": "/api/skills",
            "agents": "/api/agents",
            "commands": "/api/commands",
            "docs": "/api/docs"
        },
        "stats": {
            "total_skills": 2987,
            "specialized_agents": 6,
            "slash_commands": 7,
            "categories": 32
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
