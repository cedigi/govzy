// === GOVZY - Layout racine ===
// Définit la structure HTML de base, les métadonnées SEO, et le manifest PWA
// Utilisé par toutes les pages de l'application

import type { Metadata, Viewport } from "next";
import Script from "next/script"; // Composant officiel Next.js pour les scripts tiers
import "./globals.css";

// ─── IDs de tracking (à renseigner dans .env.local) ───────────────────────
// NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX       ← Google Analytics 4
// NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX ← Meta (Facebook) Pixel
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Métadonnées SEO et PWA pour Govzy
export const metadata: Metadata = {
  title: "Govzy - L'administration belge enfin sous contrôle",
  description:
    "Govzy simplifie vos démarches administratives belges grâce à l'IA. " +
    "Comprendre vos documents, ne plus rater d'aides, gérer vos échéances. " +
    "SPF Finances, mutualités, primes régionales — tout en un seul endroit.",
  keywords: [
    "administration belge",
    "aide administrative",
    "SPF Finances",
    "mutualité",
    "primes Wallonie",
    "primes Bruxelles",
    "Renolution",
    "documents administratifs",
    "assistant IA Belgique",
  ],
  authors: [{ name: "Govzy" }],
  openGraph: {
    title: "Govzy - L'administration belge enfin sous contrôle",
    description:
      "Transformez le chaos administratif belge en clarté totale grâce à l'IA",
    url: "https://govzy.be",
    siteName: "Govzy",
    locale: "fr_BE",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Govzy",
  },
};

// Viewport séparé de metadata (requis par Next.js 14)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1B3F8B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Polices Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="antialiased">
        {children}

        {/* ── Google Analytics 4 ─────────────────────────────────────────────
            strategy="afterInteractive" = chargé après que la page est interactive
            Cela ne bloque PAS le rendu de la page (meilleur score Lighthouse)
            Le script est ignoré si NEXT_PUBLIC_GA_ID n'est pas défini         */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* ── Meta (Facebook) Pixel ─────────────────────────────────────────
            Permet de mesurer les conversions depuis vos pubs Facebook/Instagram
            Ignoré si NEXT_PUBLIC_META_PIXEL_ID n'est pas défini              */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
