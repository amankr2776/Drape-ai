import { ProtectedRoute } from '@/components/auth/protected-route';

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
