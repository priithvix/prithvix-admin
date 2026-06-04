import React, { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from './ui/Sidebar';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard (Soon)",
      href: "#",
      icon: <LayoutDashboard size={20} style={{ flexShrink: 0 }} />,
    },
    {
      label: "Registrations",
      href: "#",
      icon: <Users size={20} style={{ flexShrink: 0 }} />,
    },
  ];

  return (
    <div className="app-container" style={{ display: 'flex' }}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody style={{ justifyContent: 'space-between' }}>
          <div className="acet-sidebar-body-inner">
            <Logo open={open} />
            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column' }}>
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          
          <div>
            <SidebarLink 
              link={{
                label: "Sign Out",
                href: "#",
                icon: <LogOut size={20} style={{ color: '#fca5a5', flexShrink: 0 }} />,
                onClick: async () => {
                  await supabase.auth.signOut();
                }
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      
      <main className="main-content" style={{ flex: 1, minWidth: 0 }}>
        <header className="page-header">
          <h1>New Registrations</h1>
          <p>Review and manage leads from the marketing site.</p>
        </header>
        
        {children}
      </main>
    </div>
  );
}

const Logo = ({ open }: { open: boolean }) => {
  return (
    <a href="#" className="acet-logo-link" style={{ padding: '8px', overflow: 'hidden' }}>
      <img src="/logo.png" alt="PrithviX" style={{ height: '32px', width: '32px', flexShrink: 0, borderRadius: '50%' }} />
      <motion.span
        initial={{ opacity: 0, width: 0 }}
        animate={{ 
          opacity: open ? 1 : 0,
          width: open ? "auto" : 0,
          marginLeft: open ? "12px" : "0px"
        }}
        style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}
      >
        <span style={{ color: 'var(--color-rabi-dust)' }}>Prithvi</span>
        <span style={{ color: 'var(--color-turmeric)' }}>X</span>
        <span style={{ color: 'var(--color-rabi-dust)', fontWeight: 500, marginLeft: '8px', fontSize: '14px', letterSpacing: '0.5px', opacity: 0.7 }}>ADMIN</span>
      </motion.span>
    </a>
  );
};
