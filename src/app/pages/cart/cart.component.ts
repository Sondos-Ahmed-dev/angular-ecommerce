import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgClass, NgStyle, NgIf, NgFor } from '@angular/common';
import { CartService } from '../../services/Cart-Service/cart-services.service';
import { ProductCart } from '../../models/Products';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, NgClass, NgStyle, NgIf, NgFor],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: (ProductCart & { isRemoving?: boolean })[] = [];
  totalPrice = 0;
  stockWarnings = new Map<number, boolean>();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.fetchCartItems();
  }

  fetchCartItems() {
    this.cartService.getCart().subscribe((items) => {
      this.cartItems = items;
      this.calculateTotalPrice();
    });
  }

  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  increaseQuantity(item: ProductCart) {
    this.cartService.getProductById(item.id).subscribe((product) => {
      const currentStock = product.stock;

      if (currentStock > 0) {
        item.quantity++;
        this.calculateTotalPrice();

        const newStock = currentStock - 1;
        this.cartService.updateProductStock(item.id, newStock).subscribe();
        this.stockWarnings.set(item.id, false);
      } else {
        this.stockWarnings.set(item.id, true);
      }
    });
  }

  decreaseQuantity(item: ProductCart) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotalPrice();

      this.cartService.getProductById(item.id).subscribe((product) => {
        const newStock = product.stock + 1;
        this.cartService.updateProductStock(item.id, newStock).subscribe();
      });

      this.stockWarnings.set(item.id, false);
    }
  }

  removeItem(id: number) {
    const index = this.cartItems.findIndex((item) => item.id === id);
    if (index > -1) {
      this.cartItems[index].isRemoving = true;
      setTimeout(() => {
        this.cartService.removeItem(id).subscribe(() => {
          this.cartItems.splice(index, 1);
          this.calculateTotalPrice();
        });
      }, 300);
    }
  }

  clearCart() {
    this.cartItems.forEach((item) => (item.isRemoving = true));
    setTimeout(() => {
      this.cartService.clearCart().subscribe(() => {
        this.cartItems = [];
        this.totalPrice = 0;
      });
    }, this.cartItems.length * 100 + 300);
  }
}
