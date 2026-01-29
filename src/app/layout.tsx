import "./globals.css";

export const metadata = {
  title: "Mailto Link Logger",
  description: "Dynamic mailto link generator with Supabase logging",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
