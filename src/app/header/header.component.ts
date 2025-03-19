import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatAnchor} from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    RouterLinkActive,
    MatAnchor,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
