import { Navigation } from "@/components/organisms/Navigation";
import { AuthProvider } from "@/context/AuthContext";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { Container } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <Navigation />
            <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '80px' }}>
              {children}
            </Container>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}