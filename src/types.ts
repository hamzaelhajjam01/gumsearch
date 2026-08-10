export interface Product {
  id: string;
  name: string;
  creator: string;
  category: string;
  price: number;
  sales: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  reviewBreakdown?: {
    stars5: number;
    stars4: number;
    stars3: number;
    stars2: number;
    stars1: number;
  };
  tags: string[];
  aiInsights: string;
  productUrl?: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  price: number;
  recorded_at: string;
}
