import {Component, inject, OnInit} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Product, ProductService} from '../../service/product.service';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {finalize} from 'rxjs';
import {CartService} from '../../service/cart.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-webshop',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatIcon,
    MatProgressSpinner,
    MatButton,
    NgOptimizedImage,
    CurrencyPipe,
    MatDivider,
    MatCardSubtitle,
    MatCardActions,
    MatCardImage,
  ],
  templateUrl: './webshop.component.html',
  styleUrl: './webshop.component.css'
})
export class WebshopComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.productService.getProducts()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data) => this.products = data,
        error: (err) => console.error('Error fetching products:', err)
      });
  }
  buyProduct(product: Product): void {
    this.cartService.addItem(product.id, 1).subscribe({
      next: () => {
        this.snackBar.open(`${product.name} added to cart!`, 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        this.snackBar.open('Could not add item to cart.', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
        console.error('Error buying product:', err);
      }
    });
  }

}
