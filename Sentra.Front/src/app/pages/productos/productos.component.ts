import { AfterViewInit, Component, inject, OnInit, ViewChild } from "@angular/core";
import { MaterialModule } from "../../shared/material.module";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ProductoService } from "../../services/producto.service";
import { IProducto } from "../../models/producto";

import { CurrencyPipe } from "@angular/common";
import { category } from "../../models/catergory";

@Component({
  selector: "app-productos",
  standalone: true,
  imports: [MaterialModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: "./productos.component.html",
  styleUrl: "./productos.component.css",
})
export class ProductosComponent implements AfterViewInit, OnInit {
  private _productoService = inject(ProductoService);

  busquedaText: string = "";

  toppings = new FormControl<string[]>([]);
  toppingList: string[] = Object.values(category);

  displayedColumns: string[] = ["id", "title", "price", "category"];

  dataSource = new MatTableDataSource<IProducto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.cargarListaProductos();
    this.dataSource.filterPredicate = this.createFilter();

    this.toppings.valueChanges.subscribe(() => this.applyFilter());
  }

  cargarListaProductos() {
    this._productoService.listarTodo().subscribe((data: IProducto[]) => {
      this.dataSource.data = data;
    });
  }

  applyFilter() {
    const filterText = this.busquedaText.trim().toLowerCase();
    const filterCategories = this.toppings.value || [];
    this.dataSource.filter = JSON.stringify({ filterText, filterCategories });
  }

  createFilter(): (producto: IProducto, filter: string) => boolean {
    return (producto: IProducto, filter: string): boolean => {
      const { filterText, filterCategories } = JSON.parse(filter);

      const matchesText =
        producto.id.toString().toLowerCase().includes(filterText) || producto.title.toLowerCase().includes(filterText) || producto.price.toString().toLowerCase().includes(filterText) || producto.category.toLowerCase().includes(filterText);

      const matchesCategory = filterCategories.length === 0 || filterCategories.includes(producto.category);

      return matchesText && matchesCategory;
    };
  }
}