import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Truck, ShieldAlert } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(username.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <Card className="shadow-xl border border-slate-200/80 p-8 bg-white">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="p-3 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20 mb-4">
          <Truck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">TransitOps ERP</h1>
        <p className="text-xs text-slate-500 mt-1.5 max-w-xs">
          Sign in to access your fleet operations dispatch control panel.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 font-medium">
          <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          placeholder="e.g. administrator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            loading={loading}
            className="w-full text-center"
            size="lg"
          >
            Sign In
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-xxs text-slate-400 font-medium">
        TransitOps Dashboard Portal v1.0.0
      </div>
    </Card>
  );
}

