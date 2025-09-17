// app/layout.js
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import { Providers } from './providers'; // Ise import karein

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-lora' });

export const metadata = {
  title: 'Panchkarma Ayurveda | Holistic Healing & Wellness',
  description: 'Rediscover balance with authentic Panchkarma treatments.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} antialiased`}>
        <Providers> {/* Children ko isse wrap karein */}
          {children}
        </Providers>
      </body>
    </html>
  );
}