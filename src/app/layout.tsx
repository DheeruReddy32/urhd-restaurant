import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'URHD – Unified Rustic Health Delights | Modern Café, Restaurant & Workspace',
  description:
    'Where Rustic Tradition Meets Healthy Luxury. Immersive digital dining, healthy Indian & international cuisine, One Piece anime café experience, and corporate workspace in Bangalore.',
  keywords: [
    'URHD',
    'Unified Rustic Health Delights',
    'Bangalore Cafe',
    'One Piece Cafe',
    'Anime Restaurant',
    'Healthy Luxury Dining',
    'Corporate Coworking Cafe',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-brand-offwhite text-brand-charcoal selection:bg-brand-orange selection:text-white antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
