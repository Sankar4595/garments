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
}

// export interface IProduct {
//   _id: string;
//   name: string;
//   name_slug: string;
//   stock: number;
//   price: string;
//   minPrice: null | string;
//   maxPrice: null | string;
//   newPrice: string;
//   specification: string;
//   description: string;
//   video: string;
//   weight: string;
//   discountenddate: string;
//   cgst: string;
//   sgst: string;
//   shippingdays: string;
//   cod: boolean;
//   productVariation: Array<
//     Array<{
//       key: string;
//       value: string;
//       label: string;
//       _id: string;
//       SKU: string;
//       Price: string;
//       QTY: string;
//     }>
//   >;
//   images: Array<{
//     url: string;
//     _id: string;
//   }>;
//   discount: number;
//   categoryArr: Array<{
//     label: string;
//     value: string;
//   }>;
//   brandArr: Array<{
//     label: string;
//     value: string;
//   }>;
//   attributeArr: Array<{
//     label: string;
//     value: string;
//     data: Array<{
//       key: string;
//       value: string;
//       label: string;
//       _id: string;
//     }>;
//   }>;
//   colorArr: Array<{
//     label: string;
//     value: string;
//     data: Array<{
//       label: string;
//       value: string;
//       data: Array<unknown>;
//     }>;
//   }>;
//   isPublish: boolean;
//   orders: any[];
//   ordersCount: number;
//   __v: number;
//   ordersCountVirtual: number;
//   id: string;
// }
