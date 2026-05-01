import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="pt-24 min-h-screen">
        {children}
      </div>
    </ProtectedRoute>
  );
}
