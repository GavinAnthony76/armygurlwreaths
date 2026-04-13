import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import AnnouncementBar from './AnnouncementBar';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
