import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, LogOut, Bell } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useSpotify';
import { logout } from '@/lib/spotify';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-transparent">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="bg-sidebar/80 rounded-full hover:bg-sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(1)}
          className="bg-sidebar/80 rounded-full hover:bg-sidebar"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {location.pathname === '/search' && (
          <div className="ml-4">
            {/* Search input is in the Search page */}
          </div>
        )}
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full p-0.5 bg-sidebar hover:bg-accent"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.images?.[0]?.url} alt={user?.display_name} />
                <AvatarFallback className="bg-accent text-foreground">
                  {user?.display_name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
