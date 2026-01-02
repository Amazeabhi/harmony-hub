import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Player from './Player';
import MobileNav from './MobileNav';
import { PlayerProvider } from '@/contexts/PlayerContext';

const MainLayout = () => {
  return (
    <PlayerProvider>
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-spotify-dark-elevated to-background">
            <Header />
            <div className="flex-1 overflow-y-auto px-4 pb-4 lg:px-6 lg:pb-6">
              <Outlet />
            </div>
          </main>
        </div>
        <Player />
        <MobileNav />
      </div>
    </PlayerProvider>
  );
};

export default MainLayout;
