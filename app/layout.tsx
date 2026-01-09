import "./globals.css";
import { AuthProvider } from "@/app/lib/authContext"; 

export const metaData = {
  title: "",
  description: ""
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
