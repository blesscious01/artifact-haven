export interface Product {
  id: string;
  name: string;
  series: string;            // <--- ADD THIS
  brand: string;
  category: string;
  price: number;
  price_php: number | null;
  cost_price: number; 
  source: string;
  condition: string;
  description: string;
  status: 'Available' | 'Sold Out' | 'Hidden';
  image_url: string;
  gallery_urls: string[];
  is_featured: boolean;
  is_negotiable: boolean;
  created_at: string;
}