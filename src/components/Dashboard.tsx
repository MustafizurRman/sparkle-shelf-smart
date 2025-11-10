import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Package, AlertCircle, TrendingUp, DollarSign } from "lucide-react";

const Dashboard = () => {
  const { data: items, isLoading } = useQuery({
    queryKey: ["inventory-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const lowStockItems = items?.filter(item => item.quantity <= item.min_stock_level).length || 0;
  const totalValue = items?.reduce((sum, item) => sum + (item.total_value || 0), 0) || 0;
  const uniqueItems = items?.length || 0;

  const stats = [
    {
      title: "Total Items",
      value: totalItems.toString(),
      icon: Package,
      gradient: "from-primary to-accent",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockItems.toString(),
      icon: AlertCircle,
      gradient: "from-destructive to-orange-400",
    },
    {
      title: "Unique Products",
      value: uniqueItems.toString(),
      icon: TrendingUp,
      gradient: "from-accent to-primary",
    },
    {
      title: "Total Value",
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      gradient: "from-primary to-primary/70",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Dashboard;
