import './global.css';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { Body } from '@/app/layout.client';
import { Provider } from './provider';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono, Nunito_Sans } from 'next/font/google';
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree';
import { source } from '@/lib/source';
import { NextProvider } from 'fumadocs-core/framework/next';


export const metadata = createMetadata({
  title: {
    template: '%s | Franvy',
    default: 'Franvy',
  },
  description: 'The creators, developers, and innovators leaving the world better than they found it.',
  metadataBase: baseUrl,
});



const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const mono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${mono.variable} ${nunitoSans.variable}`}
      suppressHydrationWarning
    >
      <Body>
        <NextProvider>
          <TreeContextProvider tree={source.pageTree}>
            <Provider>{children}</Provider>
          </TreeContextProvider>
        </NextProvider>
      </Body>
    </html>
  );
}
