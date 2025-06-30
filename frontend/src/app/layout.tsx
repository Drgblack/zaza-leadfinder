export const metadata = {
  title: 'Zaza LeadFinder',
  description: 'AI-powered lead submission form for growth teams.',
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
