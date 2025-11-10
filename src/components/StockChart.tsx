import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--destructive))", "hsl(var(--muted))"];

const StockChart = () => {
  const { data: items, isLoading } = useQuery({
    queryKey: ["inventory-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-[400px] bg-muted rounded" />
      </Card>
    );
  }

  const categoryData = items?.reduce((acc: any, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = { name: category, value: 0, quantity: 0 };
    }
    acc[category].value += item.total_value || 0;
    acc[category].quantity += item.quantity;
    return acc;
  }, {});

  const pieData = Object.values(categoryData || {}) as any[];
  const barData = items?.slice(0, 10).map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    quantity: item.quantity,
  })) || [];

  return (
    <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
      <Card className="p-6 border-border/50 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Stock by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 border-border/50 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Top 10 Items by Quantity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default StockChart;
