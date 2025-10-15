// web/src/app/layout.tsx
"use client"; // Nécessaire car QueryClientProvider est un composant client.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '../styles/globals.css'; // Assurez-vous que vos styles sont bien importés

// Crée une seule instance de QueryClient pour éviter les re-créations à chaque render.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Les données sont considérées "fraîches" pendant 5 minutes.
      // Pendant ce temps, React Query ne refera pas d'appel réseau pour la même clé.
      staleTime: 1000 * 60 * 5, 
      // Empêche les requêtes automatiques lorsque l'utilisateur revient sur l'onglet du navigateur.
      // À ajuster selon vos préférences.
      refetchOnWindowFocus: false, 
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {/* Le Provider rend le client et le cache accessibles à toute l'application */}
        <QueryClientProvider client={queryClient}>
          {children}

          {/* Un outil de développement génial pour voir le cache, les requêtes, etc. */}
          {/* Ne s'affiche qu'en environnement de développement. */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}