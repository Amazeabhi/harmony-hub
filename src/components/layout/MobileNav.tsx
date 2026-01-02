import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-20 left-0 right-0 bg-gradient-to-t from-sidebar to-sidebar/80 border-t border-border">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 transition-colors',
              location.pathname === item.path
                ? 'text-foreground'
                : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
