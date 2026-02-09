import { useQuery } from '@tanstack/react-query';
import { 
  Layers, 
  Bot, 
  Terminal, 
  FolderTree,
  Activity,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';
import { api } from '../utils/api';

const stats = [
  { 
    label: 'Total Skills', 
    value: '2,987', 
    icon: Layers, 
    color: 'from-purple-500 to-purple-600',
    change: '+12%'
  },
  { 
    label: 'Specialized Agents', 
    value: '6', 
    icon: Bot, 
    color: 'from-blue-500 to-blue-600',
    change: '+2'
  },
  { 
    label: 'Slash Commands', 
    value: '7', 
    icon: Terminal, 
    color: 'from-green-500 to-green-600',
    change: 'New!'
  },
  { 
    label: 'Categories', 
    value: '32', 
    icon: FolderTree, 
    color: 'from-yellow-500 to-yellow-600',
    change: '+3'
  },
];

const recentActivity = [
  { action: 'Skill installed', skill: 'brave-search', time: '2 min ago' },
  { action: 'Agent task completed', skill: 'coding-agent', time: '5 min ago' },
  { action: 'Skill updated', skill: 'github', time: '10 min ago' },
  { action: 'New skill added', skill: 'deep-research', time: '1 hour ago' },
];

const topCategories = [
  { name: 'AI & LLMs', count: 286, color: 'bg-purple-500' },
  { name: 'Search & Research', count: 250, color: 'bg-blue-500' },
  { name: 'DevOps & Cloud', count: 212, color: 'bg-green-500' },
  { name: 'Web & Frontend', count: 201, color: 'bg-yellow-500' },
  { name: 'Marketing & Sales', count: 142, color: 'bg-pink-500' },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/20 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Zap size={16} />
            <span className="text-sm font-medium">ATHENA_TERMINAL</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Intelligent Multi-Agent Orchestration
          </h1>
          <p className="text-gray-400 max-w-2xl mb-6">
            Supercharge your AI coding agents with 2,987+ community-built skills, 
            6 specialized agents, and powerful slash commands.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors">
              Get Started
            </button>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors border border-gray-700">
              Browse Skills
            </button>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-xs text-green-400 font-medium">{stat.change}</span>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold">Top Categories</h2>
          </div>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center gap-4">
                <span className="text-gray-500 text-sm w-6">{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.count} skills</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${category.color} rounded-full`}
                      style={{ width: `${(category.count / 286) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.skill}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock size={12} />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal Preview */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-gray-700">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-sm text-gray-500">athena-terminal</span>
        </div>
        <div className="p-6 font-mono text-sm">
          <div className="text-gray-500">$ athena --version</div>
          <div className="text-green-400">Athena Agent v2.0.0</div>
          <div className="text-gray-500 mt-2">$ athena /list agents</div>
          <div className="text-blue-400">
            ├── coding-agent     [ACTIVE]<br/>
            ├── research-agent   [ACTIVE]<br/>
            ├── devops-agent     [IDLE]<br/>
            ├── frontend-agent   [ACTIVE]<br/>
            ├── data-agent       [IDLE]<br/>
            └── general-agent    [ACTIVE]
          </div>
          <div className="text-gray-500 mt-2">$ athena /search web scraping</div>
          <div className="text-purple-400">Found 45 matching skills...</div>
          <div className="mt-2 flex items-center">
            <span className="text-gray-500">$ </span>
            <span className="ml-1 w-2 h-5 bg-purple-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
