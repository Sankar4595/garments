interface OrderItem {
  product: string; // You can use the type that represents your Product ID
  quantity: number;
  price: number;
  selectedSize: string;
  selectedColor: string;
}

export interface IOrder {
  _id?: string;
  user?: string;
  items: OrderItem[];
  name?: string;
  lastName?: string;
  total?: number;
  totalItem?: number;
  voucher?: string;
  taxFee?: number;
  shippingAddress?: string;
  shippingCost?: number;
  phoneNumber?: string;
  email?: string;
  paymentMethod?: string;
  status?: string;
  createDate?: string;
  modifyDate?: string;
  country?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
}
