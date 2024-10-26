import { AfterViewInit, Component, inject, OnInit, ViewChild } from "@angular/core";
import { MaterialModule } from "../../shared/material.module";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
//import { MatFormFieldModule } from "@angular/material/form-field";
import { ProductoService } from "../../services/producto.service";
import { IProducto } from "../../models/producto";

import { CurrencyPipe } from "@angular/common";
import { category } from "../../models/catergory";
import { ProdDetalleComponent } from "./prod-detalle/prod-detalle.component";

import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ProdEliminarComponent } from "./prod-eliminar/prod-eliminar.component";
import { ProdCrearComponent } from "./prod-crear/prod-crear.component";
import { ProdModificarComponent } from "./prod-modificar/prod-modificar.component";

@Component({
  selector: "app-productos",
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CurrencyPipe, MatMenuModule, MatButtonModule, MatTooltipModule],
  templateUrl: "./productos.component.html",
  styleUrl: "./productos.component.css",
})
export class ProductosComponent implements AfterViewInit, OnInit {
  constructor(private dialog: MatDialog) {}

  private _productoService = inject(ProductoService);

  busquedaText: string = "";

  toppings = new FormControl<string[]>([]);
  toppingList: string[] = Object.values(category);

  displayedColumns: string[] = ["id", "title", "price", "category", "acciones"];

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

  abrirModalNuevo(): void {
    const dialogRef = this.dialog.open(ProdCrearComponent, {
      width: "800px",
      maxWidth: "800px",
      data: { ultimoId: this.dataSource.data.reduce((a, b) => (a.id > b.id ? a : b)).id },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.confirmaAccion(result);
      }
    });
  }

  abrirModalDetalle(producto: IProducto): void {
    this.dialog.open(ProdDetalleComponent, {
      width: "600px",
      data: { producto },
    });
  }

  abrirModalModificar(producto: IProducto): void {
    const dialogRef = this.dialog.open(ProdModificarComponent, {
      width: "800px",
      maxWidth: "800px",
      data: { producto },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.confirmaAccion(result);
      }
    });
  }

  abrirModalEliminar(producto: IProducto): void {
    const dialogRef = this.dialog.open(ProdEliminarComponent, {
      width: "600px",
      data: { producto },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.confirmaAccion(result);
      }
    });
  }

  //Método para controlar el DataSource ya que estoy trabajando con la BD en memoria en vez de agregar, modificar o eliminar directamente en los métodos del Product.Service
  confirmaAccion(result: string) {
    let accion: string = result.split("|")[0];
    let producto: IProducto = JSON.parse(result.split("|")[1]);

    switch (accion) {
      case "deleted":
        const index = this.dataSource.data.findIndex((prod) => prod.id === producto.id);
        if (index !== -1) {
          this.dataSource.data.splice(index, 1);
          this.dataSource.data = [...this.dataSource.data];
        }
        break;

      case "created":
        this.dataSource.data.push(producto);
        this.dataSource.data = [...this.dataSource.data];
        break;

      case "updated":
        this.dataSource.data.map((prod) => {
          if (prod.id === producto.id) {
            prod.title = producto.title;
            prod.price = producto.price;
            prod.description = producto.description;
            prod.image = producto.image;
            prod.category = producto.category;
          }
        });

        this.dataSource.data = [...this.dataSource.data];

        break;

      default:
        break;
    }
  }
}
