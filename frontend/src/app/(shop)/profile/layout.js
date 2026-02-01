import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProfileLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
