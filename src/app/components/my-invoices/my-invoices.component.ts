import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';
import jsPDF from 'jspdf';
import { MaterialModule } from '../../material/material.module';
import { MatTableModule } from '@angular/material/table';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-my-invoices',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, MatTableModule],
  templateUrl: './my-invoices.component.html',
  styleUrl: './my-invoices.component.css'
})
export class MyInvoicesComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  async loadOrders() {
    try {
      this.loading = true;
      
      // Cargar todas las órdenes primero para verificar si hay datos
      const allOrders = await this.orderService.getAllOrders();
      console.log('Todas las órdenes en Firebase:', allOrders.length);
      
      if (allOrders.length > 0) {
        console.log('Ejemplo de orden:', allOrders[0]);
        if (allOrders[0].userId) {
          console.log('User ID en la orden:', allOrders[0].userId);
        } else {
          console.log('¡ALERTA! Las órdenes no tienen userId');
        }
      }
      
      // Cargar órdenes del usuario
      this.orders = await this.orderService.getUserOrders();
      console.log('Órdenes del usuario cargadas:', this.orders.length);
      
      // Si no hay órdenes del usuario, pero hay órdenes en general, mostrar todas
      if (this.orders.length === 0 && allOrders.length > 0) {
        console.log('No se encontraron órdenes para el usuario actual, mostrando todas');
        this.orders = allOrders;
      }
      
    } catch (error) {
      this.error = 'Failed to load invoices. Please try again later.';
      console.error('Error loading orders:', error);
    } finally {
      this.loading = false;
    }
  }

  viewInvoiceDetails(order: Order): void {
    this.orderService.setCurrentOrder(order);
  }

  downloadInvoice(order: Order): void {
    if (!order) return;
    
    // Create the PDF
    const doc = new jsPDF();
    
    // Add content to the PDF
    doc.setFontSize(20);
    doc.text('Purchase Invoice', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    const orderDate = this.formatDate(order.createdAt);
    
    doc.text(`Date: ${orderDate}`, 20, 40);
    doc.text(`Order ID: ${order.id || 'N/A'}`, 20, 50);
    
    doc.text('Order Details:', 20, 70);
    doc.text(`Milk: ${order.milk} units`, 30, 80);
    doc.text(`Syrup: ${order.syrup} units`, 30, 90);
    doc.text(`Caffeine: ${order.caffeine ? 'Yes' : 'No'}`, 30, 100);
    
    doc.text('Summary:', 20, 120);
    doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 30, 130);
    
    if (order.discount > 0) {
      doc.text(`Coupon applied: ${order.couponCode}`, 30, 140);
      doc.text(`Discount: -$${order.discount.toFixed(2)}`, 30, 150);
      doc.text(`Taxes: $${order.taxes.toFixed(2)}`, 30, 160);
      doc.text(`Total: $${order.total.toFixed(2)}`, 30, 170);
    } else {
      doc.text(`Taxes: $${order.taxes.toFixed(2)}`, 30, 140);
      doc.text(`Total: $${order.total.toFixed(2)}`, 30, 150);
    }
    
    // Save the PDF with a unique name including the order ID
    doc.save(`invoice-${order.id}.pdf`);
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    
    // Handle Firebase Timestamp
    if (date && typeof (date as Timestamp).toDate === 'function') {
      return (date as Timestamp).toDate().toLocaleDateString();
    }
    
    // Handle string date
    return new Date(date).toLocaleDateString();
  }
}
