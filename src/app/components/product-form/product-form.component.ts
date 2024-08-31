import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstructorBasedService } from '../../services/constructor-based.service';
import { ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core'; // Add this import
import { CommonModule } from '@angular/common'; // Add this import
import { HttpClientModule } from '@angular/common/http'; // Add this import
import Swal from 'sweetalert2'; // Add this import

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule], // Add HttpClientModule here
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  providers: [ConstructorBasedService], // Ensure ConstructorBasedService is provided
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup; // Add definite assignment assertion
  products: any[] = []; // Add a property to hold the products
  isModalOpen = false; // Add this property
  isDescriptionModalOpen = false; // Add this property
  selectedProduct: any; // Add this property
  sortBy: string = 'price-asc'; // Default sort option
  limit: number = 10; // Default limit

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    @Inject(ConstructorBasedService) private apiService: ConstructorBasedService
  ) {} // Use @Inject decorator

  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required],
    });

    this.fetchProducts(); // Fetch products on initialization
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;

      try {
        if (this.selectedProduct) {
          // Edit existing product
          const index = this.products.findIndex(
            (product) => product.id === this.selectedProduct.id
          );
          this.products[index] = { ...this.selectedProduct, ...productData }; // Update the product
        } else {
          // Add new product
          const newProduct = { id: this.products.length + 1, ...productData }; // Assign a new ID
          this.products.push(newProduct); // Add the new product to the products array
        }

        this.productForm.reset(); // Reset the form
        this.closeModal(); // Close the modal after submission

        Swal.fire('Success', 'Product added successfully!', 'success');
      } catch (error) {
        console.error('Error adding product:', error); // Log the error
        Swal.fire('Error', 'There was an error adding the product.', 'error');
      }
    } else {
      console.error('Form is invalid'); // Log if the form is invalid
      Swal.fire('Error', 'Please fill out all required fields.', 'error');
    }
  }

  editProduct(index: number): void {
    const product = this.products[index];
    this.productForm.patchValue(product);
    this.products.splice(index, 1);
    this.openModal(); // Open the modal for editing
  }

  deleteProduct(index: number): void {
    console.log('Delete product called'); // Add this line
    const product = this.products[index];
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteProduct(product.id).subscribe(() => {
          this.products.splice(index, 1);
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        });
      }
    });
  }

  fetchProducts(): void {
    console.log(
      'Fetching products with limit:',
      this.limit,
      'and sort by:',
      this.sortBy
    );
    this.apiService.getProductsWithParams(this.limit, this.sortBy).subscribe(
      (data) => {
        this.products = data;
        Swal.fire('Success', 'Products fetched successfully!', 'success');
      },
      (error) => {
        console.error('Error fetching products:', error);
        Swal.fire(
          'Error',
          'There was an error fetching the products.',
          'error'
        );
      }
    );
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  viewProductDescription(product: any): void {
    this.selectedProduct = product; // Set the selected product
    this.isDescriptionModalOpen = true; // Open the description modal
  }

  closeDescriptionModal(): void {
    this.isDescriptionModalOpen = false; // Close the description modal
    this.selectedProduct = null; // Clear the selected product
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productForm.patchValue({ image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value;
    this.products = this.sortProducts([...this.products]);
  }

  onLimitChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.limit = +selectElement.value; // Update limit option
  }

  sortProducts(products: any[]): any[] {
    return products.sort((a, b) => {
      const aValue = this.sortBy.startsWith('-')
        ? b[this.sortBy.slice(1)]
        : a[this.sortBy];
      const bValue = this.sortBy.startsWith('-')
        ? a[this.sortBy.slice(1)]
        : b[this.sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue); // Use localeCompare for string comparison
      }
      return aValue - bValue; // For numerical comparison
    });
  }
}
