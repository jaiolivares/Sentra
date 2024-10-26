import { Component, Inject, inject } from "@angular/core";
import { ProductoService } from "../../../services/producto.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProdDetalleComponent } from "../prod-detalle/prod-detalle.component";
import { IProducto } from "../../../models/producto";
import { MaterialModule } from "../../../shared/material.module";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { category } from "../../../models/catergory";

@Component({
  selector: "app-prod-modificar",
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./prod-modificar.component.html",
  styleUrl: "./prod-modificar.component.css",
})
export class ProdModificarComponent {
  private _productoService = inject(ProductoService);

  categorias = new FormControl<string[]>([]);
  categoriaList: string[] = Object.values(category);
  productForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProdDetalleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dataProducto: { producto: IProducto },
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      title: [this.dataProducto.producto.title, Validators.required],
      price: [this.dataProducto.producto.price, [Validators.required, Validators.min(0)]],
      description: [this.dataProducto.producto.description, Validators.required],
      category: [this.dataProducto.producto.category, Validators.required],
      image: [this.dataProducto.producto.image, Validators.required],
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const producto: IProducto = {
        id: this.dataProducto.producto.id,
        title: this.productForm.get("title")?.value,
        category: this.productForm.get("category")?.value,
        description: this.productForm.get("description")?.value,
        image: this.productForm.get("image")?.value,
        price: this.productForm.get("price")?.value,
      };

      this._productoService.modificar(producto).subscribe((data: IProducto) => {
        console.log("Producto modificado", data);
        this.dialogRef.close(`updated|${JSON.stringify(data)}`);
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
