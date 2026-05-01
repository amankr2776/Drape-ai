import { ProtectedRoute } from '@/components/auth/protected-route';

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="pt-20">
        {children}
      </div>
    </ProtectedRoute>
  );
}
