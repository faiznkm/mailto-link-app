import "./globals.css";

export const metadata = {
  title: "Mailto Link App",
  description: "Dynamic mailto logger",
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
