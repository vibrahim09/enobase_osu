import './globals.css';
import { ReactNode } from 'react';
import Head from 'next/head';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        {/* Meta tags, links, and other head elements can go here */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{"Enobase"}</title>
        <meta name="description" content={"POC for Enobase"} />
        {/* Add other meta tags as needed */}
      </Head>
      <body className="Enobase">
            {children}
      </body>
    </html>
  );
}