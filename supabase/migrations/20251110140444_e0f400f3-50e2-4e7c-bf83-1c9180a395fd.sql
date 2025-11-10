-- Create inventory items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL,
  sku TEXT UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  unit_price DECIMAL(10, 2),
  total_value DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create stock movements table to track changes
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('add', 'remove', 'adjust', 'missing')),
  quantity INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for now, can be restricted later with auth)
CREATE POLICY "Allow all access to inventory_items" 
ON public.inventory_items 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all access to stock_movements" 
ON public.stock_movements 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX idx_inventory_items_quantity ON public.inventory_items(quantity);
CREATE INDEX idx_stock_movements_item_id ON public.stock_movements(item_id);
CREATE INDEX idx_stock_movements_created_at ON public.stock_movements(created_at DESC);