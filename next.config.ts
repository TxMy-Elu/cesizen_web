import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Extrait l'origine (scheme://host:port) d'une URL, ou "" si invalide.
 * Sert à n'autoriser dans la CSP que le strict nécessaire.
 */
function origin(url: string | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

const apiOrigin = origin(process.env.NEXT_PUBLIC_API_BASE_URL);
const supabaseOrigin = origin(process.env.NEXT_PUBLIC_SUPABASE_URL);

// Origines externes légitimes du front : l'API Spring et Supabase (stockage + API).
const externalOrigins = [apiOrigin, supabaseOrigin].filter(Boolean).join(" ");

/**
 * Content-Security-Policy.
 *
 * `'unsafe-inline'` sur script/style est un compromis assumé : le App Router de
 * Next.js injecte des scripts d'hydratation et des styles inline. La solution
 * propre (nonce par requête via middleware) est hors périmètre pour ce projet ;
 * le choix est documenté dans le plan de sécurisation.
 *
 * `connect-src` et `img-src` n'ouvrent que vers l'API et Supabase, pas plus.
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: ${supabaseOrigin}`.trim(),
  `font-src 'self'`,
  `connect-src 'self' ${externalOrigins}`.trim(),
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
]
  .join("; ")
  .replace(/\s+/g, " ")
  .trim();

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=(), payment=()",
  },
  { key: "Content-Security-Policy", value: csp },
  // HSTS uniquement en prod : en local (HTTP) il forcerait le navigateur à
  // basculer localhost en HTTPS, ce qui casse le dev.
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
