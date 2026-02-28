export interface ProductVariant {
  _id: string
  sku: string;
  color?: string;
  size?: string;
  caratSize?: string;
  price: number;
  stock: number;
  images: string[];
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  description?: string; // Added description field
}

export interface Product {
  _id: string;
  name: string;
  basePrice?: number;
  image?: string;
  slug: string;
  category: Category;
  variants: ProductVariant[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem extends Product {
  quantity: number
  selectedVariant: ProductVariant
}

export type Contact = {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
  updatedAt: string
}

export type Category = {
  _id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  isSubcategory: boolean
  subcategories?: Category[]
  imageUrl?: string
}

export interface OrderProduct {
  product: Product
  quantity: number
  price: number
  selectedVariant: ProductVariant
}

export interface Address {
  _id?: string;
  firstName: string;
  lastName: string;
  address: string;
  aptSuite?: string;
  city?: string;
  country?: string;
  emirates?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface Order {
  _id: string
  userId?: string
  products: OrderProduct[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
  shippingAddress: Address
  totalAmount: number
  paymentIntentId: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: string
  updatedAt: string
  initiatorEmail?: string;
  totalContributed?: number;
  remainingAmount?: number;
  progress?: number;
  childAge?: number;
  message?: string;
  expiryDate?: string;
  remainingTime?: {
    days: number;
    hours: number;
    minutes: number;
  };
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession {
  _id: string
  userId: string
  userAgent: string
  ipAddress: string
  lastAccessed: Date
  isActive: boolean
  revokedAt?: Date
  createdAt: Date
  updatedAt: Date
  deviceName: string
  sessionToken?: string  // Add this field
  userEmail: string;
  userName: string;
}

export interface Blob {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export interface PromoCode {
  _id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  expiresAt: string;
  minPurchaseAmount: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}