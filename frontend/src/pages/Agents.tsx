import { useState } from 'react';
import { Bot, Play, Pause, Settings, Activity, Zap, Code, Search, Cloud, Layout, Database, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

const agents = [
  {
    id: 'coding-agent',
    name: 'Coding Agent',
    description: 'Specialized in code generation, review, and refactoring',
    icon: Code,
    status: 'active',
    tasks: 156,
    successRate: 98.5,
    skills: ['github', 'git-essentials', 'docker-essentials', 'coding-agent'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'research-agent',
    name: 'Research Agent',
    description: 'Deep research and analysis capabilities',
    icon: Search,
    status: 'active',
    tasks: 89,
    successRate: 97.2,
    skills: ['deep-research', 'brave-search', 'arxiv-watcher'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'devops-agent',
    name: 'DevOps Agent',
    description: 'Infrastructure and deployment automation',
    icon: Cloud,
    status: 'idle',
    tasks: 67,
    successRate: 99.1,
    skills: ['docker-essentials', 'kubernetes', 'github-actions'],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'frontend-agent',
    name: 'Frontend Agent',
    description: 'UI/UX design and frontend development',
    icon: Layout,
    status: 'active',
    tasks: 124,
    successRate: 96.8,
    skills: ['frontend-design', 'tailwindcss', 'react-patterns'],
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'data-agent',
    name: 'Data Agent',
    description: 'Data analysis and processing',
    icon: Database,
    status: 'idle',
    tasks: 45,
    successRate: 98.9,
    skills: ['data-analytics', 'database-operations', 'chart-image'],
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'general-agent',
    name: 'General Agent',
    description: 'Multi-purpose agent for various tasks',
    icon: Sparkles,
    status: 'active',
    tasks: 234,
    successRate: 95.5,
    skills: ['brave-search', 'github', 'productivity-tasks'],
    color: 'from-orange-500 to-orange-600'
  },
];

export function Agents() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const activeCount = agents.filter(a => a.status === 'active').length;
  const totalTasks = agents.reduce((sum, a) => sum + a.tasks, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Agents</h1>
          <p className="text-gray-400">Manage and monitor your specialized AI agents</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-500">Active Agents</p>
            <p className="text-2xl font-bold text-green-400">{activeCount}/{agents.length}</p>
          </div>
          <div className="px-4 py-2 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold text-purple-400">{totalTasks}</p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.id;
          
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
              className={cn(
                "bg-gray-900/50 rounded-xl border p-6 cursor-pointer transition-all",
                isSelected 
                  ? "border-purple-500 ring-2 ring-purple-500/20" 
                  : "border-gray-800 hover:border-gray-700"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${agent.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    agent.status === 'active' ? "bg-green-500" : "bg-gray-500"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    agent.status === 'active' ? "text-green-400" : "text-gray-500"
                  )}>
                    {agent.status === 'active' ? 'Active' : 'Idle'}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{agent.description}</p>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Tasks</p>
                  <p className="font-semibold">{agent.tasks}</p>
                </div>
                <div>
                  <p className="text-gray-500">Success Rate</p>
                  <p className="font-semibold text-green-400">{agent.successRate}%</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {agent.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400"
                  >
                    {skill}
                  </span>
                ))}
                {agent.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">
                    +{agent.skills.length - 3}
                  </span>
                )}
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-800 flex gap-2">
                  {agent.status === 'active' ? (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium transition-colors">
                      <Pause size={16} />
                      Pause
                    </button>
                  ) : (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors">
                      <Play size={16} />
                      Start
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                    <Settings size={16} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
