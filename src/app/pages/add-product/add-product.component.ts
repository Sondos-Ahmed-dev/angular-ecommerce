import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastComponent } from '../../shared/toast/toast.component';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/Product-Service/product.service';
import { Product } from '../../models/Products';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  @ViewChild('toast') toastComponent!: ToastComponent;

  productForm!: FormGroup;
  categories: string[] = ['Phones', 'Laptops', 'Accessories'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(1)]],
      image: ['', Validators.required],
    });
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const newProduct: Product = this.productForm.value;
    this.productService.addProduct(newProduct).subscribe({
      next: () => {
        this.toastComponent.showToast('Product added successfully');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);

        // this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.toastComponent.showToast('Error adding product');
      },
    });
  }
}
