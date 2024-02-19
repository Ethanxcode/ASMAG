export interface Brand {
  name: string;
  narrowCategoryId: string;
  narrowCategory: string;
}

export interface NarrowBrand {
  narrowBrandId: string;
  narrowBrand: string;
}

export interface Category {
  id: string;
  name: string;
  group: group[];
}

export interface group {
  narrowCategoryId: string;
  narrowCategoryName: string;
  narrowCategory: NarrowCategory[];
}

export interface NarrowCategory {
  narrowCategoryId: string;
  narrowCategoryName: string;
}

export interface Sizes {
  label: string;
  items: Item[];
}

export interface Item {
  label: number;
  quantity: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  brand: Brand;
  colorway: string;
  releaseDate: Date;
  sizes: Sizes[];
  soldQuantity: number;
  inventoryStatus: string;
  category: string;
  image: string[];
  likes: number;
  rating: number;
}

export interface ApiResponseItem {
  month: string;
  userCount: number;
  orderCount: number;
}

export interface Subcategory {
  narrowCategoryId: string;
  narrowCategoryName: string;
}

export interface Group {
  narrowCategoryId: string;
  narrowCategoryName: string;
  narrowCategory: Subcategory[];
}

export interface MainCategory {
  id: string;
  name: string;
  group: Group[];
}

export interface Order {
  id: string;
  userId: string;
  orderItems: OrderItem[];
  total: number;
  shipping: number;
  vatTax: number;
  address: string;
  deliveryDate: string;
  updatedAt: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  description: string;
  image: string[];
  price: number;
  brand: Brand;
  quantity: number;
}

export interface Brand {
  name: string;
  narrowCategoryId: string;
  narrowCategory: string;
}

