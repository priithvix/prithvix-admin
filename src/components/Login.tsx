import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock } from 'lucide-react';

export function Login({ onLogin }: { onLogin: (session: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      onLogin(data.session);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-rabi-dust)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <img src="/logo.png" alt="PrithviX" style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
          <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
            <span style={{ color: 'var(--color-charcoal-root)' }}>Prithvi</span>
            <span style={{ color: 'var(--color-turmeric)' }}>X</span>
            <span style={{ color: 'var(--color-charcoal-root)', fontWeight: 500, marginLeft: '12px', fontSize: '18px', letterSpacing: '0.5px', opacity: 0.7 }}>ADMIN</span>
          </div>
          <p style={{ color: 'var(--color-dry-clay)' }}>Sign in to manage leads.</p>
        </div>
        
        {error && (
          <div style={{ padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Email</label>
            <input required type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input required type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
