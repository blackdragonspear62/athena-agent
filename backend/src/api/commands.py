"""
Commands API Router - Slash Commands
"""
from fastapi import APIRouter, HTTPException, Request
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from enum import Enum

router = APIRouter()


class CommandType(str, Enum):
    """Available slash command types"""
    SEARCH = "search"
    INSTALL = "install"
    RUN = "run"
    LIST = "list"
    HELP = "help"
    STATUS = "status"
    CONFIG = "config"


# Athena's 7 Slash Commands
SLASH_COMMANDS = {
    "search": {
        "name": "/search",
        "description": "Search for skills in the registry",
        "usage": "/search <query>",
        "example": "/search web scraping",
        "category": "discovery"
    },
    "install": {
        "name": "/install",
        "description": "Install a skill from the registry",
        "usage": "/install <skill-slug>",
        "example": "/install brave-search",
        "category": "management"
    },
    "run": {
        "name": "/run",
        "description": "Run a skill with given input",
        "usage": "/run <skill-slug> <input>",
        "example": "/run brave-search 'AI news'",
        "category": "execution"
    },
    "list": {
        "name": "/list",
        "description": "List installed skills or available agents",
        "usage": "/list [skills|agents]",
        "example": "/list skills",
        "category": "discovery"
    },
    "help": {
        "name": "/help",
        "description": "Get help for a command or skill",
        "usage": "/help [command|skill]",
        "example": "/help search",
        "category": "utility"
    },
    "status": {
        "name": "/status",
        "description": "Check system or agent status",
        "usage": "/status [agent-id]",
        "example": "/status coding-agent",
        "category": "monitoring"
    },
    "config": {
        "name": "/config",
        "description": "View or modify configuration",
        "usage": "/config [key] [value]",
        "example": "/config timeout 30",
        "category": "management"
    }
}


class CommandRequest(BaseModel):
    """Command execution request"""
    command: str
    args: Optional[List[str]] = []


class CommandResponse(BaseModel):
    """Command execution response"""
    command: str
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@router.get("/")
async def list_commands():
    """List all available slash commands"""
    return {
        "total": len(SLASH_COMMANDS),
        "commands": SLASH_COMMANDS
    }


@router.get("/{command_name}")
async def get_command(command_name: str):
    """Get details for a specific command"""
    if command_name not in SLASH_COMMANDS:
        raise HTTPException(status_code=404, detail="Command not found")
    
    return SLASH_COMMANDS[command_name]


@router.post("/execute")
async def execute_command(req: CommandRequest, request: Request):
    """Execute a slash command"""
    command = req.command.lstrip("/").lower()
    
    if command not in SLASH_COMMANDS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unknown command: /{command}. Use /help for available commands."
        )
    
    result = await _execute_command(command, req.args, request)
    
    return {
        "command": f"/{command}",
        "status": "success" if not result.get("error") else "error",
        "result": result
    }


async def _execute_command(
    command: str, 
    args: List[str], 
    request: Request
) -> Dict[str, Any]:
    """Internal command execution logic"""
    
    if command == "search":
        if not args:
            return {"error": "Please provide a search query"}
        
        registry = request.app.state.skill_registry
        query = " ".join(args)
        skills = await registry.search_skills(query=query, limit=10)
        
        return {
            "query": query,
            "results": [{"id": s.id, "name": s.name, "description": s.description} 
                       for s in skills]
        }
    
    elif command == "install":
        if not args:
            return {"error": "Please provide a skill slug"}
        
        skill_id = args[0]
        registry = request.app.state.skill_registry
        success = await registry.install_skill(skill_id)
        
        if success:
            return {"message": f"Successfully installed {skill_id}"}
        else:
            return {"error": f"Skill '{skill_id}' not found"}
    
    elif command == "list":
        target = args[0] if args else "skills"
        
        if target == "skills":
            registry = request.app.state.skill_registry
            count = await registry.count()
            return {"type": "skills", "total": count}
        
        elif target == "agents":
            orchestrator = request.app.state.agent_orchestrator
            agents = await orchestrator.get_all_agents()
            return {
                "type": "agents",
                "total": len(agents),
                "agents": [{"id": a.id, "name": a.name, "status": a.status.value} 
                          for a in agents]
            }
        else:
            return {"error": f"Unknown target: {target}"}
    
    elif command == "status":
        orchestrator = request.app.state.agent_orchestrator
        
        if args:
            agent = await orchestrator.get_agent(args[0])
            if agent:
                return {
                    "agent_id": agent.id,
                    "status": agent.status.value,
                    "task_count": agent.task_count
                }
            else:
                return {"error": f"Agent '{args[0]}' not found"}
        
        stats = await orchestrator.get_agent_stats()
        return {"system_status": "operational", **stats}
    
    elif command == "help":
        if args:
            cmd_name = args[0].lstrip("/")
            if cmd_name in SLASH_COMMANDS:
                return SLASH_COMMANDS[cmd_name]
            else:
                return {"error": f"Unknown command: {cmd_name}"}
        
        return {
            "message": "Available commands",
            "commands": list(SLASH_COMMANDS.keys())
        }
    
    elif command == "config":
        if len(args) == 0:
            return {"message": "Current configuration", "config": {}}
        elif len(args) == 1:
            return {"key": args[0], "value": "default"}
        else:
            return {"message": f"Set {args[0]} = {args[1]}"}
    
    elif command == "run":
        if len(args) < 1:
            return {"error": "Usage: /run <skill-slug> [input]"}
        
        skill_id = args[0]
        input_text = " ".join(args[1:]) if len(args) > 1 else ""
        
        return {
            "skill": skill_id,
            "input": input_text,
            "output": f"[Simulated output for {skill_id}]"
        }
    
    return {"error": "Command not implemented"}
