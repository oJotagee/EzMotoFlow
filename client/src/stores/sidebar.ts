import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setMobile: (isMobile: boolean) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isOpen: true,
  isMobile: false,
  
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setMobile: (isMobile: boolean) => set({ isMobile })
}));