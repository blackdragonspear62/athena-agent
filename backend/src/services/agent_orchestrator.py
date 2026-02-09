"""
Agent Orchestrator Service
Manages AI agents and their lifecycle
"""
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import asyncio
import logging
import uuid

logger = logging.getLogger(__name__)


class AgentStatus(Enum):
    """Agent status enumeration"""
    IDLE = "idle"
    RUNNING = "running"
    PAUSED = "paused"
    ERROR = "error"
    TERMINATED = "terminated"


class AgentType(Enum):
    """Specialized agent types"""
    CODING = "coding"
    RESEARCH = "research"
    DEVOPS = "devops"
    FRONTEND = "frontend"
    DATA = "data"
    GENERAL = "general"


@dataclass
class AgentConfig:
    """Agent configuration"""
    max_tokens: int = 4096
    temperature: float = 0.7
    timeout: int = 30
    retry_count: int = 3
    skills: List[str] = field(default_factory=list)
    
    
@dataclass
class Agent:
    """Represents an AI agent"""
    id: str
    name: str
    agent_type: AgentType
    description: str
    status: AgentStatus = AgentStatus.IDLE
    config: AgentConfig = field(default_factory=AgentConfig)
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_active: Optional[datetime] = None
    task_count: int = 0
    success_rate: float = 100.0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert agent to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "type": self.agent_type.value,
            "description": self.description,
            "status": self.status.value,
            "config": {
                "max_tokens": self.config.max_tokens,
                "temperature": self.config.temperature,
                "timeout": self.config.timeout,
                "retry_count": self.config.retry_count,
                "skills": self.config.skills
            },
            "created_at": self.created_at.isoformat(),
            "last_active": self.last_active.isoformat() if self.last_active else None,
            "task_count": self.task_count,
            "success_rate": self.success_rate
        }


@dataclass 
class Task:
    """Represents a task for an agent"""
    id: str
    agent_id: str
    input: str
    output: Optional[str] = None
    status: str = "pending"
    created_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    error: Optional[str] = None


class AgentOrchestrator:
    """
    Orchestrates multiple AI agents
    """
    
    # Predefined specialized agents based on Athena's 6 agents
    SPECIALIZED_AGENTS = [
        {
            "id": "coding-agent",
            "name": "Coding Agent",
            "type": AgentType.CODING,
            "description": "Specialized in code generation, review, and refactoring",
            "skills": ["github", "git-essentials", "docker-essentials", "coding-agent"]
        },
        {
            "id": "research-agent",
            "name": "Research Agent",
            "type": AgentType.RESEARCH,
            "description": "Deep research and analysis capabilities",
            "skills": ["deep-research", "brave-search", "arxiv-watcher", "academic-deep-research"]
        },
        {
            "id": "devops-agent",
            "name": "DevOps Agent",
            "type": AgentType.DEVOPS,
            "description": "Infrastructure and deployment automation",
            "skills": ["docker-essentials", "kubernetes", "github-actions", "deploy-agent"]
        },
        {
            "id": "frontend-agent",
            "name": "Frontend Agent",
            "type": AgentType.FRONTEND,
            "description": "UI/UX design and frontend development",
            "skills": ["frontend-design", "tailwindcss", "react-patterns", "figma"]
        },
        {
            "id": "data-agent",
            "name": "Data Agent",
            "type": AgentType.DATA,
            "description": "Data analysis and processing",
            "skills": ["data-analytics", "database-operations", "chart-image"]
        },
        {
            "id": "general-agent",
            "name": "General Agent",
            "type": AgentType.GENERAL,
            "description": "Multi-purpose agent for various tasks",
            "skills": ["brave-search", "github", "productivity-tasks"]
        }
    ]
    
    def __init__(self):
        self._agents: Dict[str, Agent] = {}
        self._tasks: Dict[str, Task] = {}
        self._initialized: bool = False
        self._lock = asyncio.Lock()
        
    async def initialize(self) -> None:
        """Initialize the agent orchestrator"""
        async with self._lock:
            if self._initialized:
                return
                
            logger.info("Initializing agent orchestrator...")
            
            # Create specialized agents
            for agent_data in self.SPECIALIZED_AGENTS:
                agent = Agent(
                    id=agent_data["id"],
                    name=agent_data["name"],
                    agent_type=agent_data["type"],
                    description=agent_data["description"],
                    config=AgentConfig(skills=agent_data["skills"])
                )
                self._agents[agent.id] = agent
            
            self._initialized = True
            logger.info(f"Agent orchestrator initialized with {len(self._agents)} agents")
    
    async def agent_count(self) -> int:
        """Get number of agents"""
        return len(self._agents)
    
    async def get_agent(self, agent_id: str) -> Optional[Agent]:
        """Get an agent by ID"""
        return self._agents.get(agent_id)
    
    async def get_all_agents(self) -> List[Agent]:
        """Get all agents"""
        return list(self._agents.values())
    
    async def create_task(self, agent_id: str, input_text: str) -> Optional[Task]:
        """Create a new task for an agent"""
        agent = await self.get_agent(agent_id)
        if not agent:
            return None
        
        task = Task(
            id=str(uuid.uuid4()),
            agent_id=agent_id,
            input=input_text
        )
        
        self._tasks[task.id] = task
        agent.task_count += 1
        agent.last_active = datetime.utcnow()
        
        return task
    
    async def execute_task(self, task_id: str) -> Optional[Task]:
        """Execute a task"""
        task = self._tasks.get(task_id)
        if not task:
            return None
        
        agent = self._agents.get(task.agent_id)
        if not agent:
            task.status = "failed"
            task.error = "Agent not found"
            return task
        
        try:
            agent.status = AgentStatus.RUNNING
            task.status = "running"
            
            # Simulate task execution
            await asyncio.sleep(0.1)
            
            # In production, this would call the actual AI model
            task.output = f"Task completed by {agent.name}"
            task.status = "completed"
            task.completed_at = datetime.utcnow()
            
            agent.status = AgentStatus.IDLE
            
        except Exception as e:
            task.status = "failed"
            task.error = str(e)
            agent.status = AgentStatus.ERROR
            logger.error(f"Task execution failed: {e}")
        
        return task
    
    async def get_agent_stats(self) -> Dict[str, Any]:
        """Get aggregated agent statistics"""
        total_tasks = sum(agent.task_count for agent in self._agents.values())
        active_agents = sum(1 for agent in self._agents.values() 
                          if agent.status == AgentStatus.RUNNING)
        
        return {
            "total_agents": len(self._agents),
            "active_agents": active_agents,
            "total_tasks": total_tasks,
            "agent_types": {
                agent_type.value: sum(1 for a in self._agents.values() 
                                     if a.agent_type == agent_type)
                for agent_type in AgentType
            }
        }
    
    async def cleanup(self) -> None:
        """Cleanup resources"""
        for agent in self._agents.values():
            agent.status = AgentStatus.TERMINATED
        
        self._agents.clear()
        self._tasks.clear()
        self._initialized = False
        logger.info("Agent orchestrator cleaned up")
