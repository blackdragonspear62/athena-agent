import { useState } from 'react';
import { Search, Filter, Download, Star, ExternalLink } from 'lucide-react';

const categories = [
  { id: 'ai-llms', name: 'AI & LLMs', count: 286 },
  { id: 'search-research', name: 'Search & Research', count: 250 },
  { id: 'devops-cloud', name: 'DevOps & Cloud', count: 212 },
  { id: 'web-frontend', name: 'Web & Frontend', count: 201 },
  { id: 'marketing-sales', name: 'Marketing & Sales', count: 142 },
  { id: 'browser-automation', name: 'Browser & Automation', count: 138 },
  { id: 'productivity-tasks', name: 'Productivity & Tasks', count: 134 },
  { id: 'coding-agents', name: 'Coding Agents & IDEs', count: 132 },
];

const sampleSkills = [
  {
    id: 'brave-search',
    name: 'Brave Search',
    description: 'Web search and content extraction via Brave Search API',
    category: 'Search & Research',
    author: 'steipete',
    stars: 4.8,
    installs: 12500,
    tags: ['search', 'web', 'api']
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Interact with GitHub using the gh CLI for repository management',
    category: 'Git & GitHub',
    author: 'steipete',
    stars: 4.9,
    installs: 15200,
    tags: ['git', 'github', 'vcs']
  },
  {
    id: 'deep-research',
    name: 'Deep Research',
    description: 'Deep Research Agent for complex, multi-step research tasks',
    category: 'AI & LLMs',
    author: 'seyhunak',
    stars: 4.7,
    installs: 8900,
    tags: ['research', 'ai', 'analysis']
  },
  {
    id: 'docker-essentials',
    name: 'Docker Essentials',
    description: 'Essential Docker commands and workflows for container management',
    category: 'DevOps & Cloud',
    author: 'arnarsson',
    stars: 4.6,
    installs: 7200,
    tags: ['docker', 'containers', 'devops']
  },
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    description: 'Create distinctive, production-grade frontend interfaces with high design quality',
    category: 'Web & Frontend',
    author: 'steipete',
    stars: 4.8,
    installs: 9500,
    tags: ['frontend', 'design', 'ui']
  },
  {
    id: 'n8n-automation',
    name: 'N8N Automation',
    description: 'Manage n8n workflows from OpenClaw via the n8n REST API',
    category: 'Browser & Automation',
    author: 'dilomcfly',
    stars: 4.5,
    installs: 5600,
    tags: ['automation', 'workflow', 'n8n']
  },
];

export function Skills() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredSkills = sampleSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || skill.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Browse Skills</h1>
        <p className="text-gray-400">Discover and install from 2,987+ community-built skills</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors">
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !selectedCategory 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-purple-400 transition-colors">
                  {skill.name}
                </h3>
                <p className="text-sm text-gray-500">by {skill.author}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="text-sm">{skill.stars}</span>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {skill.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <span className="text-sm text-gray-500">
                {skill.installs.toLocaleString()} installs
              </span>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <ExternalLink size={16} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors">
                  <Download size={16} />
                  Install
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
