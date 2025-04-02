import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../services/order.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  order: Order | null = null;
  couponCode: string = '';
  private orderSubscription: Subscription | null = null;
  appliedDiscount: number = 0;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.orderSubscription = this.orderService.currentOrder$.subscribe(order => {
      if (order) {
        this.order = order;
      } else {
        // Si no hay una orden activa, redirigir a la página de productos
        this.router.navigate(['/products']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  applyCoupon(): void {
    if (!this.couponCode || !this.order) return;

    // Usar el servicio para verificar el cupón
    const discountRate = this.orderService.applyCoupon(this.couponCode);
    
    if (discountRate > 0) {
      // Actualizar la orden con el descuento
      const updatedOrder: Order = {
        ...this.order,
        couponCode: this.couponCode,
        discount: this.order.subtotal * discountRate,
      };
      
      // Recalcular el total
      updatedOrder.total = updatedOrder.subtotal - updatedOrder.discount + updatedOrder.taxes;
      
      // Actualizar la orden en el servicio
      this.orderService.setCurrentOrder(updatedOrder);
      this.appliedDiscount = discountRate * 100;
    } else {
      alert('Invalid or expired coupon');
    }
  }

  downloadInvoice(): void {
    if (!this.order) return;
    
    // Create the PDF
    const doc = new jsPDF();
    
    // Add content to the PDF
    doc.setFontSize(20);
    doc.text('Purchase Invoice', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Order ID: ${this.order.id || 'N/A'}`, 20, 50);
    
    doc.text('Order Details:', 20, 70);
    doc.text(`Milk: ${this.order.milk} units`, 30, 80);
    doc.text(`Syrup: ${this.order.syrup} units`, 30, 90);
    doc.text(`Caffeine: ${this.order.caffeine ? 'Yes' : 'No'}`, 30, 100);
    
    doc.text('Summary:', 20, 120);
    doc.text(`Subtotal: $${this.order.subtotal.toFixed(2)}`, 30, 130);
    
    if (this.order.discount > 0) {
      doc.text(`Coupon applied: ${this.order.couponCode}`, 30, 140);
      doc.text(`Discount: -$${this.order.discount.toFixed(2)}`, 30, 150);
      doc.text(`Taxes: $${this.order.taxes.toFixed(2)}`, 30, 160);
      doc.text(`Total: $${this.order.total.toFixed(2)}`, 30, 170);
    } else {
      doc.text(`Taxes: $${this.order.taxes.toFixed(2)}`, 30, 140);
      doc.text(`Total: $${this.order.total.toFixed(2)}`, 30, 150);
    }
    
    // Save the PDF
    doc.save('invoice.pdf');
  }
}
