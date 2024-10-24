// import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { MatPaginatorModule } from "@angular/material/paginator";

import { MatSelectModule } from "@angular/material/select";

// import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
// import { MatTableDataSource } from "@angular/material/table";

@NgModule({
  declarations: [],
  //   imports: [CommonModule],

  exports: [MatToolbarModule, MatSidenavModule, MatButtonModule, MatIconModule, MatDividerModule, MatListModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSelectModule],
  //   providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: "dynamic", appearance: "outline" } }],
})
export class MaterialModule {}
