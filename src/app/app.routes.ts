import { Routes } from '@angular/router';
import { ProductFormComponent } from './components/product-form/product-form.component';

export const routes: Routes = [
  { path: 'product-form', component: ProductFormComponent },
  { path: '**', component: ProductFormComponent },
];
