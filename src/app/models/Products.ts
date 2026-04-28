export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}
export interface ProductCart {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}
export interface Category {
  id: number;
  name: string;
}
