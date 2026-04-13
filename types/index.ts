export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "album" | "photocard" | "season_md";
  member: string | null;
  images: string[];
  options: ProductOption[];
  stock: number;
  is_new: boolean;
  is_popular: boolean;
  created_at: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions: Record<string, string>;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_amount: number;
  status: "ordered" | "preparing" | "shipping" | "delivered";
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  selected_options: Record<string, string>;
}
