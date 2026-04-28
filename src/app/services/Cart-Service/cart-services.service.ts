import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { Product, ProductCart } from '../../models/Products';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:3000/cart';
  private productsUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getCart(): Observable<ProductCart[]> {
    return this.http.get<ProductCart[]>(this.baseUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`);
  }

  addToCart(item: ProductCart): Observable<ProductCart> {
    return this.http.post<ProductCart>(this.baseUrl, item);
  }

  removeItem(id: number): Observable<void> {
    return this.http.get<ProductCart>(`${this.baseUrl}/${id}`).pipe(
      switchMap((cartItem) =>
        this.getProductById(cartItem.id).pipe(
          switchMap((product) => {
            const updatedStock = product.stock + cartItem.quantity;
            return this.updateProductStock(product.id, updatedStock).pipe(
              switchMap(() => this.http.delete<void>(`${this.baseUrl}/${id}`))
            );
          })
        )
      )
    );
  }

  updateItem(item: ProductCart): Observable<ProductCart> {
    return this.http.put<ProductCart>(`${this.baseUrl}/${item.id}`, item);
  }

  updateProductStock(id: number, stock: number): Observable<Product> {
    return this.http.patch<Product>(`${this.productsUrl}/${id}`, { stock });
  }

  clearCart(): Observable<void[]> {
    return this.getCart().pipe(
      switchMap((items) =>
        forkJoin(items.map((item) => this.removeItem(item.id)))
      )
    );
  }
}
