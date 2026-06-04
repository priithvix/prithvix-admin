import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export interface Registration {
  id: string;
  name: string;
  phone: string;
  district: string;
  role: string;
  service_interest: string;
  created_at: string;
  status?: string;
  notes?: string;
}

interface Props {
  registrations: Registration[];
  onEdit: (reg: Registration) => void;
  onDelete: (id: string) => void;
}

export function RegistrationsTable({ registrations, onEdit, onDelete }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (registrations.length === 0) {
    return (
      <div className="card loading-state">
        <p>No registrations found.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(registrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = registrations.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Phone</th>
              <th>District</th>
              <th>Role</th>
              <th>Interest</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((reg) => (
              <tr key={reg.id}>
                <td>{format(new Date(reg.created_at), 'MMM d, yyyy h:mm a')}</td>
                <td style={{ fontWeight: 500, color: 'var(--color-charcoal-root)' }}>{reg.name}</td>
                <td>{reg.phone}</td>
                <td>{reg.district}</td>
                <td>
                  <span className="badge badge-role">{reg.role}</span>
                </td>
                <td>
                  <span className="badge badge-service">{reg.service_interest.replace(/_/g, ' ')}</span>
                </td>
                <td>
                  <span className={`badge`} style={{
                    backgroundColor: reg.status === 'Contacted' ? 'var(--color-amber-deep)' : 
                                     reg.status === 'Converted' ? 'var(--color-field-mid)' : 
                                     reg.status === 'Rejected' ? '#dc2626' : 'var(--color-dry-grass)',
                    color: reg.status === 'Contacted' || reg.status === 'Converted' || reg.status === 'Rejected' ? '#fff' : 'var(--color-earth-brown)'
                  }}>
                    {reg.status || 'New'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn btn-secondary btn-icon" 
                      onClick={() => onEdit(reg)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn btn-danger btn-icon" 
                      onClick={() => onDelete(reg.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, registrations.length)} of {registrations.length} results
          </div>
          <div className="pagination-controls">
            <button 
              className="btn btn-secondary" 
              onClick={handlePrev} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleNext} 
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
