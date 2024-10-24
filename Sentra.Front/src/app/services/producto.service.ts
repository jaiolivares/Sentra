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

  constructor() {}
}
