import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IProducto } from "../../../models/producto";
import { MaterialModule } from "../../../shared/material.module";
import { CurrencyPipe } from "@angular/common";

@Component({
  selector: "app-prod-detalle",
  standalone: true,
  imports: [MaterialModule, CurrencyPipe],
  templateUrl: "./prod-detalle.component.html",
  styleUrl: "./prod-detalle.component.css",
})
export class ProdDetalleComponent {
  constructor(
    public dialogRef: MatDialogRef<ProdDetalleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dataProducto: { producto: IProducto }
  ) {}
}
