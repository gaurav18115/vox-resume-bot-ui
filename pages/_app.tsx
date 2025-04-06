// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Noto_Sans } from 'next/font/google';

// Configure the font with Latin and Devanagari subsets
const notoSans = Noto_Sans({
    subsets: ['latin', 'devanagari'],
    // weight: ['400', '700'],
    variable: '--font-noto-sans',
});

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className={`${notoSans.variable} antialiased dark`}>
            <Component {...pageProps} />
        </div>
    );
}