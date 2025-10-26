import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Product, ProductService} from '../../service/product.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {finalize} from 'rxjs';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-product-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatDialogActions,
    MatButton,
    MatProgressSpinner
  ],
  templateUrl: './add-product-dialog.component.html',
  styleUrl: './add-product-dialog.component.scss'
})
export class AddProductDialogComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  isEditMode = false;

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  public dialogRef = inject(MatDialogRef<AddProductDialogComponent>);
  private data: { product: Product } = inject(MAT_DIALOG_DATA, { optional: true });

  constructor() {
    this.isEditMode = !!this.data;

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      imageUrl: ['default-image.png', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      price: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.productForm.patchValue(this.data.product);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const operation = this.isEditMode
      ? this.productService.updateProduct({ ...this.data.product, ...this.productForm.value })
      : this.productService.addProduct(this.productForm.value);

    operation.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (savedProduct) => {
        this.dialogRef.close(savedProduct);
      },
      error: (err) => {
        console.error('Error saving product:', err);
        this.errorMessage = 'Failed to save product. Please try again.';
      }
    });
  }
}
