import { useEffect, useState, useMemo } from 'react';
import { RefreshCw, Download, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import { DashboardLayout } from './components/DashboardLayout';
import { RegistrationsTable } from './components/RegistrationsTable';
import { RegistrationsChart } from './components/RegistrationsChart';
import { Login } from './components/Login';
import type { Registration } from './components/RegistrationsTable';

function App() {
  const [session, setSession] = useState<any>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  // Edit Modal State
  const [editingReg, setEditingReg] = useState<Registration | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (err: any) {
      console.error('Error fetching:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchRegistrations();
    }
  }, [session]);



  // Filter Data
  const filteredData = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch = 
        reg.name.toLowerCase().includes(search.toLowerCase()) || 
        reg.phone.includes(search);
      const matchesRole = roleFilter ? reg.role === roleFilter : true;
      const matchesService = serviceFilter ? reg.service_interest === serviceFilter : true;
      
      return matchesSearch && matchesRole && matchesService;
    });
  }, [registrations, search, roleFilter, serviceFilter]);

  // Analytics Calculations
  const analytics = useMemo(() => {
    const roles: Record<string, number> = {};
    const districts: Record<string, number> = {};
    
    filteredData.forEach(r => {
      roles[r.role] = (roles[r.role] || 0) + 1;
      districts[r.district] = (districts[r.district] || 0) + 1;
    });

    const topRole = Object.keys(roles).sort((a, b) => roles[b] - roles[a])[0] || 'N/A';
    const topDistrict = Object.keys(districts).sort((a, b) => districts[b] - districts[a])[0] || 'N/A';

    return { total: filteredData.length, topRole, topDistrict };
  }, [filteredData]);

  // Actions
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      const { error } = await supabase.from('registrations').delete().eq('id', id);
      if (error) throw error;
      setRegistrations(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingReg) return;
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          name: editingReg.name,
          phone: editingReg.phone,
          district: editingReg.district,
          role: editingReg.role,
          service_interest: editingReg.service_interest,
          status: editingReg.status || 'New',
          notes: editingReg.notes || '',
        })
        .eq('id', editingReg.id);
        
      if (error) throw error;
      
      setRegistrations(prev => prev.map(r => r.id === editingReg.id ? editingReg : r));
      setEditingReg(null);
    } catch (err: any) {
      alert('Error updating: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Export CSV
  const exportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ['Date', 'Name', 'Phone', 'District', 'Role', 'Interest', 'Status', 'Notes'];
    const rows = filteredData.map(reg => [
      new Date(reg.created_at).toISOString(),
      `"${reg.name}"`,
      `"${reg.phone}"`,
      `"${reg.district}"`,
      `"${reg.role}"`,
      `"${reg.service_interest}"`,
      `"${reg.status || 'New'}"`,
      `"${(reg.notes || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Unique filters for dropdowns
  const allRoles = Array.from(new Set(registrations.map(r => r.role))).sort();
  const allServices = Array.from(new Set(registrations.map(r => r.service_interest))).sort();

  if (!session) {
    return <Login onLogin={(newSession) => {
      if (newSession) {
        setSession(newSession);
      } else {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
      }
    }} />;
  }

  return (
    <DashboardLayout>
      {/* Analytics Grid */}
      <div className="analytics-grid">
        <div className="card analytics-card">
          <span className="analytics-label">Total Leads</span>
          <span className="analytics-value">{analytics.total}</span>
        </div>
        <div className="card analytics-card">
          <span className="analytics-label">Top Role</span>
          <span className="analytics-value" style={{textTransform: 'capitalize'}}>{analytics.topRole}</span>
        </div>
        <div className="card analytics-card">
          <span className="analytics-label">Top District</span>
          <span className="analytics-value">{analytics.topDistrict}</span>
        </div>
      </div>

      {/* Leads Chart */}
      {!loading && !error && filteredData.length > 0 && (
        <RegistrationsChart registrations={filteredData} />
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <input 
          type="text" 
          placeholder="Search name or phone..." 
          className="input-field"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select 
          className="select-field" 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        
        <select 
          className="select-field" 
          value={serviceFilter} 
          onChange={(e) => setServiceFilter(e.target.value)}
        >
          <option value="">All Services</option>
          {allServices.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={fetchRegistrations} title="Refresh">
            <RefreshCw size={18} />
          </button>
          <button className="btn btn-primary" onClick={exportCSV}>
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Table */}
      {error && (
        <div className="card" style={{ padding: '24px', backgroundColor: '#fdf2f2', borderColor: '#f9c8c8', color: '#b91c1c', marginBottom: '24px' }}>
          <strong>Error loading data:</strong> {error}
        </div>
      )}
      
      {loading ? (
        <div className="card loading-state">
          <p>Loading registrations...</p>
        </div>
      ) : (
        !error && <RegistrationsTable registrations={filteredData} onEdit={setEditingReg} onDelete={handleDelete} />
      )}

      {/* Edit Modal */}
      {editingReg && (
        <div className="modal-overlay" onClick={() => setEditingReg(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Lead</h2>
              <button className="btn btn-icon btn-secondary" style={{border: 'none'}} onClick={() => setEditingReg(null)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Name</label>
                  <input required className="input-field" type="text" value={editingReg.name} onChange={e => setEditingReg({...editingReg, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input required className="input-field" type="text" value={editingReg.phone} onChange={e => setEditingReg({...editingReg, phone: e.target.value})} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Role</label>
                  <input required className="input-field" type="text" value={editingReg.role} onChange={e => setEditingReg({...editingReg, role: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Service Interest</label>
                  <input required className="input-field" type="text" value={editingReg.service_interest} onChange={e => setEditingReg({...editingReg, service_interest: e.target.value})} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>District</label>
                  <input required className="input-field" type="text" value={editingReg.district} onChange={e => setEditingReg({...editingReg, district: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="select-field" value={editingReg.status || 'New'} onChange={e => setEditingReg({...editingReg, status: e.target.value})}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Internal Notes</label>
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="E.g., Called on Tuesday, wants to buy seeds next month"
                  value={editingReg.notes || ''} 
                  onChange={e => setEditingReg({...editingReg, notes: e.target.value})} 
                />
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingReg(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default App;
