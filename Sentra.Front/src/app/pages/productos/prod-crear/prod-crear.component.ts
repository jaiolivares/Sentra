import { Component, inject, Inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MaterialModule } from "../../../shared/material.module";

import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProdDetalleComponent } from "../prod-detalle/prod-detalle.component";
import { category } from "../../../models/catergory";
import { ProductoService } from "../../../services/producto.service";
import { IProducto } from "../../../models/producto";

@Component({
  selector: "app-prod-creareditar",
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./prod-crear.component.html",
  styleUrl: "./prod-crear.component.css",
})
export class ProdCrearComponent {
  private _productoService = inject(ProductoService);

  categorias = new FormControl<string[]>([]);
  categoriaList: string[] = Object.values(category);
  productForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProdDetalleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dataProducto: { ultimoId: number },
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      title: ["", Validators.required],
      price: ["", [Validators.required, Validators.min(0)]],
      description: ["", Validators.required],
      category: ["", Validators.required],
      image: ["https://www.sentra.cl/assets/img/logo-sentra.png", Validators.required],
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const producto: IProducto = {
        id: this.dataProducto.ultimoId + 1,
        title: this.productForm.get("title")?.value,
        category: this.productForm.get("category")?.value,
        description: this.productForm.get("description")?.value,
        image: this.productForm.get("image")?.value,
        price: this.productForm.get("price")?.value,
      };

      this._productoService.agregar(producto).subscribe((data: IProducto) => {
        console.log("Producto creado", data);
        data = { ...data, id: producto.id };
        this.dialogRef.close(`created|${JSON.stringify(data)}`);
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
