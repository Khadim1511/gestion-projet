import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-background to-background">
        <div className="max-w-7xl mx-auto p-8 pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Subtle decorative elements for premium feel */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none z-0" />
        <div className="fixed bottom-0 left-72 w-[300px] h-[300px] bg-red-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none z-0" />
      </main>
    </div>
  );
}
