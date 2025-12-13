import Dashboard from "@/components/Dashboard";
import StockChart from "@/components/StockChart";
import AIChat from "@/components/AIChat";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <header className="text-center space-y-2 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Glamour Inventory
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Smart makeup inventory management system
          </p>
        </header>

        <Dashboard />

        <StockChart />

        <div className="flex justify-center">
          <Link to="/inventory">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
              Manage Inventory
            </Button>
          </Link>
        </div>

        <AIChat />
      </div>
    </div>
  );
};

export default Index;
