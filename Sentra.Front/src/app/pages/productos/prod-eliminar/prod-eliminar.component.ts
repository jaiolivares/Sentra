import { Component, inject, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IProducto } from "../../../models/producto";
import { ProdDetalleComponent } from "../prod-detalle/prod-detalle.component";
import { MaterialModule } from "../../../shared/material.module";
import { ProductoService } from "../../../services/producto.service";

@Component({
  selector: "app-prod-eliminar",
  standalone: true,
  imports: [MaterialModule],
  templateUrl: "./prod-eliminar.component.html",
  styleUrl: "./prod-eliminar.component.css",
})
export class ProdEliminarComponent implements OnInit {
  private _productoService = inject(ProductoService);

  titulo: string = "";

  constructor(
    public dialogRef: MatDialogRef<ProdDetalleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dataProducto: { producto: IProducto }
  ) {}

  ngOnInit(): void {
    this.titulo = this.dataProducto.producto.title;
  }

  aceptarEliminar(): void {
    this._productoService.eliminar(this.dataProducto.producto.id).subscribe((data: IProducto) => {
      console.log("Producto eliminado", data);
      this.dialogRef.close(`deleted|${JSON.stringify(data)}`);
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
