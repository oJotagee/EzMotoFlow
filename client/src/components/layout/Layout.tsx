import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useSidebar } from '@/stores/sidebar';

export function Layout() {
  const { isOpen, isMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-background flex">
      <div className={`${isMobile ? 'w-0' : isOpen ? 'w-[280px]' : 'w-0'} transition-all duration-300 flex-shrink-0`}>
        <div className="fixed left-0 top-0 h-full z-30">
          <Sidebar />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}