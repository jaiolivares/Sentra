import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Settings } from "../environments/environment";
import { Observable } from "rxjs";
import { IProducto } from "../models/producto";

@Injectable({
  providedIn: "root",
})
export class ProductoService {
  private _http = inject(HttpClient);
  private apiMock: string = Settings.API_MOCK.url;

  listarTodo(): Observable<IProducto[]> {
    return this._http.get<IProducto[]>(`${this.apiMock}products`);
  }

  eliminar(id: number): Observable<IProducto> {
    return this._http.delete<IProducto>(`${this.apiMock}products/${id}`);
  }

  agregar(producto: IProducto): Observable<IProducto> {
    return this._http.post<IProducto>(`${this.apiMock}products`, producto);
  }

  modificar(producto: IProducto): Observable<IProducto> {
    return this._http.put<IProducto>(`${this.apiMock}products/${producto.id}`, producto);
  }

  constructor() {}
}
