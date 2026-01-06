import "./globals.css";
import Header from "@/app/components/ui/header";
import { AuthProvider } from "@/app/lib/authContext"; // 1. Import it

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>
          <Header />
          <main className="px-6 md:px-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
