import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export function LoginPage() {
  const [email, setEmail] = useState('admin@futurekawa.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/countries');
    } catch {
      setError('Identifiants invalides.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-brand-700">☕ FutureKawa</h1>
        <p className="text-gray-500 text-sm">Supervision des lots café vert</p>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit"
          className="w-full bg-brand-700 text-white py-2 rounded-lg font-medium hover:bg-brand-900 transition-colors">
          Connexion
        </button>

        <p className="text-xs text-gray-400 text-center">admin@futurekawa.com / admin123</p>
      </form>
    </div>
  );
}
