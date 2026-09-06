import './globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="pt-32 sm:pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
