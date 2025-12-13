import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchInventoryItems, deleteInventoryItem } from "@/services/inventoryApi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import InventoryDialog from "@/components/InventoryDialog";

const InventoryPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["inventory-items"],
    queryFn: fetchInventoryItems,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast({
        title: "Item deleted",
        description: "The item has been removed from inventory.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading inventory...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6 animate-fade-in">
          {/* Header with back button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Inventory Management</h1>
                <p className="text-muted-foreground">Add, edit, and delete makeup products</p>
              </div>
            </div>
            <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 h-12 px-6 text-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total Items</p>
              <p className="text-2xl font-bold text-foreground">{items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Products</p>
              <p className="text-2xl font-bold text-foreground">{items?.length || 0}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-destructive">{items?.filter(item => item.quantity <= (item.min_stock_level || 10)).length || 0}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total Value</p>
              <p className="text-2xl font-bold text-foreground">${items?.reduce((sum, item) => sum + (item.total_value || 0), 0).toFixed(2) || "0.00"}</p>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Min Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items && items.length > 0 ? (
                  items.map((item) => (
                    <TableRow 
                      key={item._id}
                      className={(item.quantity <= (item.min_stock_level || 10)) ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/50"}
                    >
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.brand || "-"}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.sku || "-"}</TableCell>
                      <TableCell className="text-right font-semibold">{item.quantity}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.min_stock_level}</TableCell>
                      <TableCell className="text-right font-medium">${item.unit_price?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">${item.total_value?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="hover:bg-primary/10"
                            title="Edit item"
                          >
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item._id)}
                            className="hover:bg-destructive/10"
                            title="Delete item"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="space-y-2">
                        <p className="text-muted-foreground">No inventory items yet</p>
                        <Button onClick={handleAdd} variant="outline" className="mt-2">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Item
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add/Edit Dialog */}
        <InventoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          item={selectedItem}
        />
      </div>
    </div>
  );
};

export default InventoryPage;
