
import Layout from '@/layout';
import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="ru">
      <body>
          <main className="max-w-md relative mx-auto bg-primary shadow-lg h-full">
            <Layout>
            {children}
            </Layout>
          </main>
      </body>
    </html>
  );
}