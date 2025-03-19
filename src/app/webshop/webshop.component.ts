import {Component, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardTitle
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Product, ProductService} from '../product.service';
import {DecimalPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-webshop',
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardTitle,
    MatIcon,
    MatProgressSpinner,
    DecimalPipe,
    MatCardImage,
    MatButton
  ],
  templateUrl: './webshop.component.html',
  styleUrl: './webshop.component.css'
})
export class WebshopComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  buyProduct(product: Product): void {
    // Implement your buy logic here
    console.log('Buying product:', product);
  }

}
