import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Building2, 
  Fingerprint, 
  LogOut,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeContext';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/projets',    icon: FolderKanban, label: 'Projets' },
  { to: '/employes',   icon: Users, label: 'Employés' },
  { to: '/organismes', icon: Building2, label: 'Organismes' },
];

export default function Sidebar() {
  const { user, logoutUser, hasRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <aside className="w-72 h-screen sticky top-0 bg-card border-r border-border flex flex-col p-6 gap-8 z-50">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <FolderKanban className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">SuiviProjet</span>
      </div>

      <NavLink 
        to="/profile"
        className={({ isActive }) => cn(
          "bg-secondary/50 rounded-2xl p-4 flex items-center gap-3 border border-border/50 group hover:border-orange-500/30 transition-all duration-300",
          isActive && "border-orange-500/50 bg-orange-500/5"
        )}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
          {user?.nom?.charAt(0) || 'U'}
        </div>
        <div className="flex flex-col truncate">
          <span className="text-sm font-semibold text-foreground truncate">{user?.nom} {user?.prenom}</span>
          <span className="text-[11px] uppercase tracking-wider text-orange-400 font-bold">{user?.profil}</span>
        </div>
      </NavLink>

      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative",
              isActive 
                ? "bg-orange-600/10 text-orange-400" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-orange-400" : "text-muted-foreground group-hover:text-zinc-500 dark:group-hover:text-zinc-300")} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 rounded-full bg-orange-500" 
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        {hasRole('ADMIN') && (
          <NavLink
            to="/profils"
            className={({ isActive }) => cn(
              "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative mt-4 border-t border-border pt-6",
              isActive 
                ? "bg-orange-600/10 text-orange-400" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <Fingerprint className={cn("w-5 h-5", isActive ? "text-orange-400" : "text-muted-foreground group-hover:text-zinc-500 dark:group-hover:text-zinc-300")} />
                  <span className="text-sm font-medium">Profils (Rôles)</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 rounded-full bg-orange-500" 
                  />
                )}
              </>
            )}
          </NavLink>
        )}
      </nav>

      <div className="flex flex-col gap-2">
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-sm font-medium">{theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}</span>
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
