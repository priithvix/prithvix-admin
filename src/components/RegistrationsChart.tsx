import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Registration } from './RegistrationsTable';
import { format, parseISO, subDays, subMonths } from 'date-fns';

export function RegistrationsChart({ registrations }: { registrations: Registration[] }) {
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly'>('daily');

  const data = useMemo(() => {
    if (registrations.length === 0) return [];

    if (timeframe === 'daily') {
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
    } else {
      const monthsMap: Record<string, number> = {};
      for (let i = 11; i >= 0; i--) {
        const m = subMonths(new Date(), i);
        monthsMap[format(m, 'MMM yyyy')] = 0;
      }

      registrations.forEach(r => {
        const month = format(parseISO(r.created_at), 'MMM yyyy');
        if (monthsMap[month] !== undefined) {
          monthsMap[month]++;
        }
      });

      return Object.keys(monthsMap).map(month => ({
        name: month,
        leads: monthsMap[month]
      }));
    }
  }, [registrations, timeframe]);

  return (
    <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', margin: 0 }}>Lead Generation Trends</h3>
        <select 
          className="select-field" 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value as 'daily' | 'monthly')}
          style={{ width: '130px', padding: '6px 12px', fontSize: '14px', height: 'auto' }}
        >
          <option value="daily">Daily (14d)</option>
          <option value="monthly">Monthly (1y)</option>
        </select>
      </div>
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
