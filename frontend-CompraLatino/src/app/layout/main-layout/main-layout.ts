import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CartDrawer } from '../cart-drawer/cart-drawer';
import { Navbar } from '../navbar/navbar';

/** Shell for the store pages: navbar, routed content and the global cart panel. */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar, CartDrawer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
