import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }
}
