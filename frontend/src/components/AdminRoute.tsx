import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";


export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();


  if (user?.role !== 'admin') {
    return <Navigate to={'/'} replace />;
  }

  return <>{ children }</>;
}