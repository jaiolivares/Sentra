import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IProducto } from "../../../models/producto";

@Component({
  selector: "app-prod-detalle",
  standalone: true,
  imports: [],
  templateUrl: "./prod-detalle.component.html",
  styleUrl: "./prod-detalle.component.css",
})
export class ProdDetalleComponent {
  constructor(public dialogRef: MatDialogRef<ProdDetalleComponent>, @Inject(MAT_DIALOG_DATA) public data: { producto: IProducto }) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
