import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  milkQuantity: number = 0;
  syrupQuantity: number = 0;
  caffeine: boolean = true;
  isProcessing: boolean = false;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  increaseMilk() {
    this.milkQuantity++;
  }

  decreaseMilk() {
    if (this.milkQuantity > 0) {
      this.milkQuantity--;
    }
  }

  increaseSyrup() {
    this.syrupQuantity++;
  }

  decreaseSyrup() {
    if (this.syrupQuantity > 0) {
      this.syrupQuantity--;
    }
  }

  setCaffeine(value: boolean) {
    this.caffeine = value;
  }

  async confirmOrder() {
    if (this.isProcessing) return;
    
    try {
      this.isProcessing = true;
      
      // Crear objeto de orden parcial para enviar al servicio
      const orderData: Partial<Order> = {
        milk: this.milkQuantity,
        syrup: this.syrupQuantity,
        caffeine: this.caffeine
      };
      
      console.log('Creando pedido:', orderData);
      
      // Guardar en Firebase usando el método createOrder
      const orderId = await this.orderService.createOrder(orderData);
      console.log('Orden guardada en Firebase con ID:', orderId);
      
      // Navegar a la página de factura
      this.router.navigate(['/invoice']);
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      
      // Mostrar un mensaje más específico según el error
      if (error instanceof Error) {
        if (error.message.includes('permission-denied') || error.message.includes('Missing or insufficient permissions')) {
          alert('Error de permisos: Verifica que las reglas de seguridad de Firebase permitan escritura.');
        } else {
          alert(`Error al procesar el pedido: ${error.message}`);
        }
      } else {
        alert('Hubo un problema al procesar tu pedido. Por favor, inténtalo de nuevo.');
      }
    } finally {
      this.isProcessing = false;
    }
  }
}
