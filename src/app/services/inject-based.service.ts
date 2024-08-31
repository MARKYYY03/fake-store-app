import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InjectBasedService {
  constructor(@Inject(HttpClient) private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get('https://fakestoreapi.com/products');
  }
}
