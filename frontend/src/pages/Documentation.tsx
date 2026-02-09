import { Book, Code, Terminal, Zap, ExternalLink } from 'lucide-react';

const docs = [
  {
    title: 'Getting Started',
    description: 'Learn how to set up and configure Athena Agent',
    icon: Zap,
    href: '/docs/getting-started'
  },
  {
    title: 'API Reference',
    description: 'Complete API documentation for all endpoints',
    icon: Code,
    href: '/docs/api-reference'
  },
  {
    title: 'Skill Development',
    description: 'Guide to creating custom skills for the platform',
    icon: Terminal,
    href: '/docs/skill-development'
  },
  {
    title: 'Deployment Guide',
    description: 'Deploy Athena to production environments',
    icon: Book,
    href: '/docs/deployment'
  },
];

const codeExample = `# Install a skill using the CLI
npx clawhub@latest install brave-search

# Or use slash commands
/install brave-search

# Run a skill
/run brave-search "latest AI news"

# List all agents
/list agents`;

export function Documentation() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Documentation</h1>
        <p className="text-gray-400">Everything you need to know about using Athena Agent</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => {
          const Icon = doc.icon;
          return (
            <a
              key={doc.title}
              href={doc.href}
              className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-600/20 text-purple-400">
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg group-hover:text-purple-400 transition-colors">
                      {doc.title}
                    </h3>
                    <ExternalLink size={16} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{doc.description}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Quick Start Code */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold">Quick Start</h2>
          <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Copy code
          </button>
        </div>
        <pre className="p-6 overflow-x-auto text-sm">
          <code className="text-gray-300">{codeExample}</code>
        </pre>
      </div>

      {/* Slash Commands Reference */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
        <h2 className="font-semibold text-lg mb-4">Slash Commands Reference</h2>
        <div className="space-y-4">
          {[
            { cmd: '/search', desc: 'Search for skills in the registry', usage: '/search <query>' },
            { cmd: '/install', desc: 'Install a skill from the registry', usage: '/install <skill-slug>' },
            { cmd: '/run', desc: 'Run a skill with given input', usage: '/run <skill-slug> <input>' },
            { cmd: '/list', desc: 'List installed skills or available agents', usage: '/list [skills|agents]' },
            { cmd: '/help', desc: 'Get help for a command or skill', usage: '/help [command|skill]' },
            { cmd: '/status', desc: 'Check system or agent status', usage: '/status [agent-id]' },
            { cmd: '/config', desc: 'View or modify configuration', usage: '/config [key] [value]' },
          ].map((item) => (
            <div key={item.cmd} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
              <code className="text-purple-400 font-mono whitespace-nowrap">{item.cmd}</code>
              <div className="flex-1">
                <p className="text-sm text-gray-300">{item.desc}</p>
                <p className="text-xs text-gray-500 mt-1 font-mono">{item.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
