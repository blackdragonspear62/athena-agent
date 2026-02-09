import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Layers, 
  Bot, 
  FileText, 
  Menu, 
  X,
  Github,
  Twitter,
  Terminal
} from 'lucide-react';
import { cn } from '../utils/cn';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/skills', label: 'Skills', icon: Layers },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/docs', label: 'Documentation', icon: FileText },
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Terminal size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ATHENA
                </h1>
                <p className="text-xs text-gray-500">v2.0.0</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/yourusername/athena-agent" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://twitter.com/athenaagent" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-16 left-0 bottom-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" 
                    : "hover:bg-gray-800 text-gray-400 hover:text-gray-100"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Stats Card */}
        <div className="absolute bottom-4 left-4 right-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Platform Stats</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-2xl font-bold text-purple-400">2,987</p>
              <p className="text-gray-500">Skills</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">6</p>
              <p className="text-gray-500">Agents</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">7</p>
              <p className="text-gray-500">Commands</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">32</p>
              <p className="text-gray-500">Categories</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
