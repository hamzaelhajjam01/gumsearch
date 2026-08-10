-- Create the product_price_history table
CREATE TABLE IF NOT EXISTS public.product_price_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    price NUMERIC NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and add public read access
ALTER TABLE public.product_price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to price history" ON public.product_price_history FOR SELECT USING (true);

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.log_price_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is an UPDATE and the price has changed, or if it's an INSERT
    IF (TG_OP = 'UPDATE' AND OLD.price IS DISTINCT FROM NEW.price) OR (TG_OP = 'INSERT') THEN
        INSERT INTO public.product_price_history (product_id, price, recorded_at)
        VALUES (NEW.id, NEW.price, timezone('utc'::text, now()));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the products table
DROP TRIGGER IF EXISTS trigger_log_price_change ON public.products;
CREATE TRIGGER trigger_log_price_change
    AFTER INSERT OR UPDATE OF price
    ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.log_price_change();
