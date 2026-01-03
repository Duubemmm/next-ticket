import "./globals.css";
import Header from "@/app/components/header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
      <Header/>
 <main className="px-6 md:px-16">
          {children}
        </main>
      </body>
    </html>
  );
 }