import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { Subtitle } from "@/components/ui/Subtitle";
import { Bike, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
          <Bike className="w-10 h-10 text-white" />
        </div>
        
        <Title size="3xl" className="text-foreground mb-2">
          404
        </Title>
        <Title size="xl" className="text-foreground mb-4">
          Página não encontrada
        </Title>
        <Subtitle className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </Subtitle>
        
        <Link to="/dashboard">
          <Button testID="back-to-dashboard" type="primary" className="shadow-primary">
            <Home className="w-5 h-5 mr-2" />
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
