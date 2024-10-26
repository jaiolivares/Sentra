import { category } from "./catergory";

export interface IProducto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: category;
  image: string;
}
