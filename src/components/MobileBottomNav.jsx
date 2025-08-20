import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Bookmark, ClipboardList, BookText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const leftNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Kütüphane' },
  { to: '/saved-stories', icon: Bookmark, label: 'Kaydedilenler' },
];

const rightNavItems = [
  { to: '/lessons', icon: ClipboardList, label: 'Dersler' },
  { to: '/activities', icon: BookText, label: 'Aktiviteler' },
];

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-200 w-full',
        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      )
    }
  >
    <Icon className="h-6 w-6" />
    <span className="text-xs font-medium">{label}</span>
  </NavLink>
);

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isExitConfirmOpen, setIsExitConfirmOpen] = React.useState(false);
  const [nextPath, setNextPath] = React.useState(null);

  const handleGuardedNavigation = (path, e) => {
    if (e) e.preventDefault();
    if (location.pathname.startsWith('/quiz')) {
      setNextPath(path);
      setIsExitConfirmOpen(true);
    } else {
      navigate(path);
    }
  };

  const proceedWithNavigation = () => {
    if (nextPath) {
      navigate(nextPath);
    }
    setIsExitConfirmOpen(false);
    setNextPath(null);
  };

  const cancelNavigation = () => {
    setIsExitConfirmOpen(false);
    setNextPath(null);
  };

  const noNavRoutes = ['/story'];
  if (noNavRoutes.some(path => location.pathname.startsWith(path))) {
    return null;
  }
  
  const displayName = profile?.name || user?.email?.split('@')[0] || 'Kullanıcı';
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.id}`;

  return (
    <>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', stiffness: 150, damping: 25 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm lg:hidden"
      >
        <div className="flex items-center justify-around h-16 px-1">
          {leftNavItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={(e) => handleGuardedNavigation(item.to, e)} />
          ))}

          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center justify-center gap-1 p-2 w-full"
            onClick={(e) => handleGuardedNavigation('/settings', e)}
          >
            <Avatar className="h-8 w-8 border-2 border-primary/50">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-muted-foreground">Profil</span>
          </motion.div>

          {rightNavItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={(e) => handleGuardedNavigation(item.to, e)} />
          ))}
          
        </div>
      </motion.div>
      <AlertDialog open={isExitConfirmOpen} onOpenChange={setIsExitConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quiz'den ayrılmak istediğine emin misin?</AlertDialogTitle>
            <AlertDialogDescription>
              Mevcut ilerlemen kaydedilmeyecek. Yine de devam etmek istiyor musun?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelNavigation}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={proceedWithNavigation} className="bg-destructive hover:bg-destructive/90">Ayrıl</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MobileBottomNav;