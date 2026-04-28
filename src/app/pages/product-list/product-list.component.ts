import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { Product } from '../../models/Products';
import { ProductService } from '../../services/Product-Service/product.service';
import { CartService } from '../../services/Cart-Service/cart-services.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { NgForm } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    ToastComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  @ViewChild('toast') toastComponent!: ToastComponent;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}
  private router = inject(Router);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  loading: boolean = false;
  error: string = '';
  selectedProduct: Product | null = null;
  productToDeleteId: number | null = null;
  deleteModal: any;

  ngOnInit(): void {
    this.loadProducts();
    const modalEl = document.getElementById('deleteConfirmModal');
    this.deleteModal = new bootstrap.Modal(modalEl);
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      },
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter((product) => {
      const productName = product?.name?.toLowerCase() || '';
      const productCategory = product?.category?.toLowerCase() || '';
      const searchTermLower = this.searchTerm.toLowerCase();

      const matchesSearch =
        !this.searchTerm ||
        productName.startsWith(searchTermLower) ||
        productCategory.startsWith(searchTermLower);

      const matchesCategory =
        !this.selectedCategory || product?.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  addToCart(product: Product) {
    if (product.stock <= 0) {
      return; // لو مفيش مخزون
    }

    this.cartService.getCart().subscribe((cartItems) => {
      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
        this.cartService.updateItem(updatedItem).subscribe(() => {
          this.cartService
            .updateProductStock(product.id, product.stock - 1)
            .subscribe(() => {
              product.stock -= 1;
              this.toastComponent.showToast(
                `${product.name} has been added to the cart!`
              );
            });
        });
      } else {
        const cartItem = {
          id: product.id,
          name: product.name,
          category: product.category,
          description: product.description,
          price: product.price,
          quantity: 1,
          image: product.image,
        };

        this.cartService.addToCart(cartItem).subscribe(() => {
          this.cartService
            .updateProductStock(product.id, product.stock - 1)
            .subscribe(() => {
              product.stock -= 1;
              this.toastComponent.showToast(
                `${product.name} has been added to the cart!`
              );
            });
        });
      }
    });
  }

  openEditModal(product: Product) {
    this.selectedProduct = { ...product };
    const modal = new bootstrap.Modal(
      document.getElementById('editProductModal')
    );
    modal.show();
  }

  saveEditedProduct(form: NgForm) {
    if (!this.selectedProduct) return;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.productService
      .updateProduct(this.selectedProduct.id, this.selectedProduct)
      .subscribe({
        next: () => {
          this.loadProducts();
          this.toastComponent.showToast('Product updated successfully');
          const modalEl = document.getElementById('editProductModal');
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal.hide();
        },
        error: (err) => {
          console.error(err);
          this.toastComponent.showToast('Error updating product');
        },
      });
  }

  openDeleteModal(id: number) {
    this.productToDeleteId = id;
    this.deleteModal.show();
  }

  confirmDelete() {
    if (this.productToDeleteId === null) return;

    this.productService.deleteProduct(this.productToDeleteId).subscribe({
      next: () => {
        this.products = this.products.filter(
          (p) => p.id !== this.productToDeleteId
        );
        this.filteredProducts = this.filteredProducts.filter(
          (p) => p.id !== this.productToDeleteId
        );
        this.deleteModal.hide();
        this.toastComponent.showToast('Product deleted successfully');
        this.productToDeleteId = null;
      },
      error: (err) => {
        console.error(err);
        this.toastComponent.showToast('Error deleting product');
      },
    });
  }
}
