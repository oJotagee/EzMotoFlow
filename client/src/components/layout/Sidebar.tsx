'use client'

import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Bike, 
  FileText,
  Menu,
  X
} from 'lucide-react';
import { useSidebar } from '@/stores/sidebar';
import { useThemeStore } from '@/stores/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Title } from '@/components/ui/Title';
import clsx from 'clsx';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    title: 'Usuários',
    icon: Users,
    path: '/users'
  },
  {
    title: 'Clientes',
    icon: UserCheck,
    path: '/clients'
  },
  {
    title: 'Motocicletas',
    icon: Bike,
    path: '/motorcycles'
  },
  {
    title: 'Contratos',
    icon: FileText,
    path: '/contracts'
  }
];

export function Sidebar() {
  const { isOpen, toggle, close, isMobile, setMobile } = useSidebar();
  const { darkMode } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setMobile]);

  useEffect(() => {
    if (isMobile) {
      close();
    }
  }, [location.pathname, isMobile, close]);

  const sidebarContent = (
    <motion.div
      initial={false}
      animate={{ 
        width: isOpen ? (isMobile ? '100vw' : '280px') : '0px' 
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full bg-sidebar border-r border-sidebar-border shadow-xl overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div>
              <Title size="lg" className="text-sidebar-foreground font-bold">
                EzMotoFlow
              </Title>
            </div>
          </div>
          
          {isMobile && (
            <button
              onClick={close}
              className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group',
                  'hover:bg-sidebar-accent hover:shadow-lg transform hover:scale-[1.02]',
                  {
                    'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow': isActive,
                    'text-sidebar-foreground hover:text-sidebar-accent-foreground': !isActive
                  }
                )}
              >
                <Icon className={clsx(
                  'w-5 h-5 transition-colors',
                  {
                    'text-sidebar-primary-foreground': isActive,
                    'text-sidebar-foreground group-hover:text-primary': !isActive
                  }
                )} />
                <span className="font-medium">{item.title}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-secondary rounded-full shadow-glow"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="text-center">
            <p className="text-xs text-sidebar-foreground/60">
              EzMotoFlow v1.0
            </p>
            <p className="text-xs text-sidebar-foreground/40 mt-1">
              © 2025 Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 h-full z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="h-full">
      {sidebarContent}
    </div>
  );
}

export function MobileMenuButton() {
  const { toggle, isOpen } = useSidebar();
  
  return (
    <button
      onClick={toggle}
      className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
    >
      <Menu className="w-6 h-6 text-foreground" />
    </button>
  );
}