import "./globals.css";
import { AuthProvider } from "@/app/lib/authContext"; 

export const metaData = {
  title: "Ticz",
  description: "A robust ticket management app"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
