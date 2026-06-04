import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Registration } from './RegistrationsTable';
import { format, parseISO, subDays } from 'date-fns';

export function RegistrationsChart({ registrations }: { registrations: Registration[] }) {
  const data = useMemo(() => {
    if (registrations.length === 0) return [];

    // Create last 14 days map
    const daysMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = subDays(new Date(), i);
      daysMap[format(d, 'MMM dd')] = 0;
    }

    registrations.forEach(r => {
      const day = format(parseISO(r.created_at), 'MMM dd');
      if (daysMap[day] !== undefined) {
        daysMap[day]++;
      }
    });

    return Object.keys(daysMap).map(day => ({
      name: day,
      leads: daysMap[day]
    }));
  }, [registrations]);

  return (
    <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Lead Generation Trends (Last 14 Days)</h3>
      <div style={{ height: '220px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-field-mid)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-field-mid)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-sand)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-dry-clay)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-dry-clay)' }} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ borderRadius: 'var(--radius-sm)', border: 'none', boxShadow: 'var(--shadow-card)' }}
              itemStyle={{ color: 'var(--color-field-deep)', fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="leads" stroke="var(--color-field-mid)" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
