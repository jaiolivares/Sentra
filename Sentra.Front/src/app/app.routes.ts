import { Routes } from "@angular/router";
import { ProductosComponent } from "./pages/productos/productos.component";
import { HomeComponent } from "./pages/home/home.component";
import { ContactoComponent } from "./pages/contacto/contacto.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "product", component: ProductosComponent },
  { path: "contacto", component: ContactoComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
