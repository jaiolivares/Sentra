import { category } from "./catergory";
import { IRating } from "./rating";

export interface IProducto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: category;
  image: string;
  rating: IRating;
}
