import { AfterViewInit, Component, OnInit, ViewChild, inject } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CurrencyPipe } from "@angular/common";
import { IProducto } from "../../models/producto";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MaterialModule } from "../../shared/material.module";
import { ProdCrearComponent } from "./prod-crear/prod-crear.component";
import { ProdDetalleComponent } from "./prod-detalle/prod-detalle.component";
import { ProdEliminarComponent } from "./prod-eliminar/prod-eliminar.component";
import { ProdModificarComponent } from "./prod-modificar/prod-modificar.component";
import { ProductoService } from "../../services/producto.service";
import { category } from "../../models/catergory";

@Component({
  selector: "app-productos",
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: "./productos.component.html",
  styleUrl: "./productos.component.css",
})
export class ProductosComponent implements AfterViewInit, OnInit {
  private _productoService = inject(ProductoService);

  categorias = new FormControl<string[]>([]);
  categoriasLista: string[] = Object.values(category);

  columnas: string[] = ["id", "title", "price", "category", "acciones"];

  dataSource = new MatTableDataSource<IProducto>();
  busquedaText: string = "";

  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarListaProductos();
    this.dataSource.filterPredicate = this.creaFiltros();
    this.categorias.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginador;
    this.dataSource.sort = this.sort;
  }

  cargarListaProductos() {
    this._productoService.listarTodo().subscribe((data: IProducto[]) => {
      this.dataSource.data = data;
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
    });
  }

  creaFiltros(): (producto: IProducto, filtro: string) => boolean {
    return (producto: IProducto, filtro: string): boolean => {
      const { filtroText, filtroCategorias } = JSON.parse(filtro);

      const matchesText =
        producto.id.toString().toLowerCase().includes(filtroText) || producto.title.toLowerCase().includes(filtroText) || producto.price.toString().toLowerCase().includes(filtroText) || producto.category.toLowerCase().includes(filtroText);

      const matchesCategoria = filtroCategorias.length === 0 || filtroCategorias.includes(producto.category);

      return matchesText && matchesCategoria;
    };
  }

  aplicarFiltros() {
    const filtroText = this.busquedaText.trim().toLowerCase();
    const filtroCategorias = this.categorias.value || [];
    this.dataSource.filter = JSON.stringify({ filtroText, filtroCategorias });
  }

  abrirModalNuevo(): void {
    const dialogRef = this.dialog.open(ProdCrearComponent, {
      width: "800px",
      maxWidth: "800px",
      maxHeight: "90vh",
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
      maxHeight: "90vh",
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
    }
  }
}
