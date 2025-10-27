import {Component, inject, OnInit} from '@angular/core';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle, MatCardTitle
} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Product, ProductService} from '../../service/product.service';
import {finalize} from 'rxjs';
import {AddProductDialogComponent} from '../../components/add-product-dialog/add-product-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-products',
  imports: [
    CurrencyPipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle,
    MatDivider,
    MatIcon,
    MatProgressSpinner,
    NgOptimizedImage,
    MatCardActions,
    MatIconButton
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
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

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.products.unshift(result);
      }
    });
  }

  openEditProductDialog(product: Product): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.products.findIndex(p => p.id === result.id);
        if (index > -1) {
          this.products[index] = result;
          this.snackBar.open('Product updated successfully!', 'Close', { duration: 3000 });
        }
      }
    });
  }

  confirmDeleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete "${product.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== product.id);
            this.snackBar.open('Product deleted successfully!', 'Close', {duration: 3000});
          },
          error: (err) => {
            console.error('Error deleting product:', err);
            this.snackBar.open('Failed to delete product.', 'Close', {duration: 3000});
          }
        });
      }
    });
  }

}
