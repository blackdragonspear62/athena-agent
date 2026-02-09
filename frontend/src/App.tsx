import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Skills } from './pages/Skills';
import { Agents } from './pages/Agents';
import { Documentation } from './pages/Documentation';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/docs" element={<Documentation />} />
      </Routes>
    </Layout>
  );
}

export default App;
