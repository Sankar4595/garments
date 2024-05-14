interface Variation {
  color: string;
  colorCode: string;
  colorImage: string;
  image: string;
  size: string;
}

interface Itype {
  value: string;
  label: string;
}

interface ICategory {
  value: string;
  label: string;
}

export interface ProductType {
  _id: string;
  category: ICategory[] | any;
  type: Itype[] | any;
  name: string;
  gender: string;
  new: boolean;
  sale: boolean;
  rate: number;
  price: number;
  originPrice: number;
  brand: string;
  sold: number;
  quantity: number;
  quantityPurchase: number;
  variation: Variation[] | any;
  thumbImage: Array<string>;
  images: Array<string>;
  description: string;
  action: string;
  slug: string;
  discount: string;
  shippingdays?: number;
  selectedSize?: string;
  selectedColor?: string;
}
