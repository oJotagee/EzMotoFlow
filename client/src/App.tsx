import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/stores/auth";

import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import UsersList from "@/pages/users/UsersList";
import CreateUserPage from "@/pages/users/cadastrar/index";
import EditUserPage from "@/pages/users/[id]/index";
import ClientsList from "@/pages/clients/ClientsList";
import MotorcyclesList from "@/pages/motorcycles/MotorcyclesList";
import CreateMotorcyclePage from "@/pages/motorcycles/cadastrar/index";
import EditMotorcyclePage from "@/pages/motorcycles/[id]/index";
import ContractsList from "@/pages/contracts/ContractsList";
import CreateContractPage from "@/pages/contracts/cadastrar/index";
import EditContractPage from "@/pages/contracts/[id]/index";
import NotFound from "./pages/NotFound";
import CreateClientPage from "./pages/clients/cadastrar/index";
import EditClientPage from "./pages/clients/[id]/index";

// Páginas públicas (layout simples)
import SignContractPage from '@/pages/signature';
import PublicLayout from "./components/layout/Public";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/signature/:id" element={<PublicLayout />}>
        <Route index element={<SignContractPage />} />
      </Route>

      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="users" element={<UsersList />} />
        <Route path="users/cadastrar" element={<CreateUserPage />} />
        <Route path="users/:id" element={<EditUserPage />} />
        
        <Route path="clients" element={<ClientsList />} />
        <Route path="clients/cadastrar" element={<CreateClientPage />} />
        <Route path="clients/:id" element={<EditClientPage />} />
        
        <Route path="motorcycles" element={<MotorcyclesList />} />
        <Route path="motorcycles/cadastrar" element={<CreateMotorcyclePage />} />
        <Route path="motorcycles/:id" element={<EditMotorcyclePage />} />
        
        <Route path="contracts" element={<ContractsList />} />
        <Route path="contracts/cadastrar" element={<CreateContractPage />} />
        <Route path="contracts/:id" element={<EditContractPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
