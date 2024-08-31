import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConstructorBasedService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  getProducts(
    limit: number = 10,
    sortBy: string = 'price-asc'
  ): Observable<any> {
    let sortParam = '';
    switch (sortBy) {
      case 'price-asc':
        sortParam = 'price';
        break;
      case 'price-desc':
        sortParam = '-price';
        break;
      case 'title-asc':
        sortParam = 'title';
        break;
      case 'title-desc':
        sortParam = '-title';
        break;
      case 'category-asc':
        sortParam = 'category';
        break;
      case 'category-desc':
        sortParam = '-category';
        break;
    }
    return this.http.get(`${this.apiUrl}?limit=${limit}&sort=${sortParam}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  editProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProductsWithParams(limit: number, sortBy: string): Observable<any> {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (sortBy) {
      params = params.append('sort', sortBy);
    }
    return this.http.get(this.apiUrl, { params });
  }
}
