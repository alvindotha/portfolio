import '@mantine/core/styles.css';
import './globals.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getAppVersion, getContactLinks } from '@/lib/queries';

export const metadata = {
  title: 'Thalvindo',
  description: 'Personal portfolio and blog',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [contact, appVersion] = await Promise.all([getContactLinks(), getAppVersion()]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer contact={contact} appVersion={appVersion} />
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
