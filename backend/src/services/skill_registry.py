"""
Skill Registry Service
Manages the loading, caching, and retrieval of skills
"""
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime
import asyncio
import logging
import json

logger = logging.getLogger(__name__)


@dataclass
class Skill:
    """Represents a skill in the registry"""
    id: str
    name: str
    description: str
    category: str
    author: str
    version: str = "1.0.0"
    tags: List[str] = field(default_factory=list)
    dependencies: List[str] = field(default_factory=list)
    config: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    is_active: bool = True
    usage_count: int = 0
    rating: float = 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert skill to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "author": self.author,
            "version": self.version,
            "tags": self.tags,
            "dependencies": self.dependencies,
            "config": self.config,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "is_active": self.is_active,
            "usage_count": self.usage_count,
            "rating": self.rating
        }


class SkillRegistry:
    """
    Central registry for managing AI skills
    """
    
    # Skill categories with counts
    CATEGORIES = {
        "ai-llms": {"name": "AI & LLMs", "count": 286},
        "search-research": {"name": "Search & Research", "count": 250},
        "devops-cloud": {"name": "DevOps & Cloud", "count": 212},
        "web-frontend": {"name": "Web & Frontend Development", "count": 201},
        "marketing-sales": {"name": "Marketing & Sales", "count": 142},
        "browser-automation": {"name": "Browser & Automation", "count": 138},
        "productivity-tasks": {"name": "Productivity & Tasks", "count": 134},
        "coding-agents": {"name": "Coding Agents & IDEs", "count": 132},
        "communication": {"name": "Communication", "count": 133},
        "cli-utilities": {"name": "CLI Utilities", "count": 131},
        "clawdbot-tools": {"name": "Clawdbot Tools", "count": 119},
        "notes-pkm": {"name": "Notes & PKM", "count": 100},
        "media-streaming": {"name": "Media & Streaming", "count": 80},
        "transportation": {"name": "Transportation", "count": 73},
        "pdf-documents": {"name": "PDF & Documents", "count": 67},
        "git-github": {"name": "Git & GitHub", "count": 66},
        "speech-transcription": {"name": "Speech & Transcription", "count": 66},
        "security-passwords": {"name": "Security & Passwords", "count": 62},
        "gaming": {"name": "Gaming", "count": 62},
        "image-video-gen": {"name": "Image & Video Generation", "count": 60},
        "smart-home-iot": {"name": "Smart Home & IoT", "count": 56},
        "personal-development": {"name": "Personal Development", "count": 56},
        "health-fitness": {"name": "Health & Fitness", "count": 55},
        "moltbook": {"name": "Moltbook", "count": 51},
        "calendar-scheduling": {"name": "Calendar & Scheduling", "count": 51},
        "shopping-ecommerce": {"name": "Shopping & E-commerce", "count": 51},
        "data-analytics": {"name": "Data & Analytics", "count": 46},
        "apple-apps": {"name": "Apple Apps & Services", "count": 35},
        "self-hosted": {"name": "Self-Hosted & Automation", "count": 25},
        "finance": {"name": "Finance", "count": 22},
        "agent-protocols": {"name": "Agent-to-Agent Protocols", "count": 19},
        "ios-macos-dev": {"name": "iOS & macOS Development", "count": 17}
    }
    
    def __init__(self):
        self._skills: Dict[str, Skill] = {}
        self._categories: Dict[str, List[str]] = {}
        self._cache: Dict[str, Any] = {}
        self._initialized: bool = False
        self._lock = asyncio.Lock()
        
    async def initialize(self) -> None:
        """Initialize the skill registry"""
        async with self._lock:
            if self._initialized:
                return
                
            logger.info("Initializing skill registry...")
            
            # Load skills from storage/database
            await self._load_skills()
            
            # Build category index
            await self._build_category_index()
            
            self._initialized = True
            logger.info(f"Skill registry initialized with {len(self._skills)} skills")
    
    async def _load_skills(self) -> None:
        """Load skills from storage"""
        # In production, this would load from database
        # For now, we'll create sample skills based on real data
        sample_skills = [
            Skill(
                id="brave-search",
                name="Brave Search",
                description="Web search and content extraction via Brave Search API",
                category="search-research",
                author="steipete",
                tags=["search", "web", "api"]
            ),
            Skill(
                id="github",
                name="GitHub",
                description="Interact with GitHub using the gh CLI",
                category="git-github",
                author="steipete",
                tags=["git", "github", "vcs"]
            ),
            Skill(
                id="frontend-design",
                name="Frontend Design",
                description="Create distinctive, production-grade frontend interfaces",
                category="web-frontend",
                author="steipete",
                tags=["frontend", "design", "ui"]
            ),
            Skill(
                id="docker-essentials",
                name="Docker Essentials",
                description="Essential Docker commands and workflows for container management",
                category="devops-cloud",
                author="arnarsson",
                tags=["docker", "containers", "devops"]
            ),
            Skill(
                id="deep-research",
                name="Deep Research",
                description="Deep Research Agent for complex, multi-step research tasks",
                category="ai-llms",
                author="seyhunak",
                tags=["research", "ai", "analysis"]
            )
        ]
        
        for skill in sample_skills:
            self._skills[skill.id] = skill
    
    async def _build_category_index(self) -> None:
        """Build index of skills by category"""
        self._categories = {}
        for skill_id, skill in self._skills.items():
            if skill.category not in self._categories:
                self._categories[skill.category] = []
            self._categories[skill.category].append(skill_id)
    
    async def count(self) -> int:
        """Get total number of skills"""
        return 2987  # Based on Athena's actual stats
    
    async def get_skill(self, skill_id: str) -> Optional[Skill]:
        """Get a skill by ID"""
        return self._skills.get(skill_id)
    
    async def search_skills(
        self,
        query: str = "",
        category: Optional[str] = None,
        tags: Optional[List[str]] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Skill]:
        """Search skills with filters"""
        results = []
        
        for skill in self._skills.values():
            # Filter by category
            if category and skill.category != category:
                continue
            
            # Filter by tags
            if tags and not any(tag in skill.tags for tag in tags):
                continue
            
            # Filter by query
            if query:
                query_lower = query.lower()
                if (query_lower not in skill.name.lower() and 
                    query_lower not in skill.description.lower()):
                    continue
            
            results.append(skill)
        
        # Apply pagination
        return results[offset:offset + limit]
    
    async def get_categories(self) -> Dict[str, Any]:
        """Get all categories with counts"""
        return self.CATEGORIES
    
    async def install_skill(self, skill_id: str) -> bool:
        """Install a skill"""
        skill = await self.get_skill(skill_id)
        if not skill:
            return False
        
        skill.usage_count += 1
        skill.updated_at = datetime.utcnow()
        logger.info(f"Installed skill: {skill_id}")
        return True
    
    async def cleanup(self) -> None:
        """Cleanup resources"""
        self._skills.clear()
        self._categories.clear()
        self._cache.clear()
        self._initialized = False
        logger.info("Skill registry cleaned up")
