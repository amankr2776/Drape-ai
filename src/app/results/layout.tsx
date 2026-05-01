export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-24 min-h-screen">
      {children}
    </div>
  );
}
