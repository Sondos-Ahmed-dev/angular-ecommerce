import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/Product-Service/product.service';
import { Product } from '../../models/Products';
import { CartService } from '../../services/Cart-Service/cart-services.service';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ToastComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('toast') toastComponent!: ToastComponent;

  product!: Product;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading product details';
        console.error(err);
        this.loading = false;
      },
    });
  }

  addToCart(product: Product) {
    if (product.stock <= 0) {
      return;
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

  private updateStock(product: Product): void {
    this.cartService
      .updateProductStock(product.id, product.stock - 1)
      .subscribe(() => {
        product.stock -= 1;
      });
  }
}
