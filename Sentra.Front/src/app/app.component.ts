import { Component, OnInit, ViewChild } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MaterialModule } from "./shared/material.module";
import { MatSidenav } from "@angular/material/sidenav";
import { CommonModule } from "@angular/common";
import { BreakpointObserver, LayoutModule } from "@angular/cdk/layout";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, MaterialModule, CommonModule, LayoutModule],

  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav, { static: true })
  sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver) {}

  ngOnInit(): void {
    this.observer.observe(["(max-width: 800px)"]).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = "over";
        this.sidenav.close();
      } else {
        this.sidenav.mode = "side";
        this.sidenav.open();
      }
    });
  }
}
