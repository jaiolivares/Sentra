import { Category } from "./Catergory";
import { IRating } from "./rating";

export interface IProducto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  rating: IRating;
}
