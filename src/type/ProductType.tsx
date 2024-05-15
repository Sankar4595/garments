interface Variation {
  color: string;
  colorCode: string;
  colorImage: string;
  newprice: number;
  image: string;
  size: string;
  sku: string;
  oldPrice: number;
  price: number;
  quantity: number;
  _id: string;
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
  category: ICategory[];
  type: Itype[];
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
  variation: Variation[];
  thumbImage: Array<string>;
  images: Array<string>;
  description: string;
  action: string;
  slug: string;
  discount: string;
  shippingdays?: number;
  selectedSize?: string;
  selectedColor?: string;
  video: string;
  weight: string;
  discountenddate: string;
  cgst: string;
  gstvariation: string;
  discountType: string;
  cod: boolean;
}
