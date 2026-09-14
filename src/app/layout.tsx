import { AuthProvider } from "@/context/AuthContext";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { Container } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <Container maxWidth="lg" sx={{ marginTop: '50px' }}>
              {children}
            </Container>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}