import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, query, where, getDocs, orderBy, Timestamp } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface Order {
  id?: string;
  milk: number;
  syrup: number;
  caffeine: boolean;
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  couponCode?: string | null;
  createdAt: Date;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private currentOrderSubject = new BehaviorSubject<Order | null>(null);
  currentOrder$ = this.currentOrderSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService
  ) { }

  async createOrder(orderData: Partial<Order>): Promise<string> {
    // Calcular precios
    const milkPrice = orderData.milk! * 0.5; // $0.50 por unidad de leche
    const syrupPrice = orderData.syrup! * 0.25; // $0.25 por unidad de jarabe
    const caffeinePrice = orderData.caffeine ? 1 : 0; // $1 por cafeína
    
    const subtotal = milkPrice + syrupPrice + caffeinePrice;
    
    // Aplicar descuento si hay cupón
    let discount = 0;
    if (orderData.couponCode) {
      // Puedes implementar lógica más compleja para validar cupones
      if (orderData.couponCode === 'DISCOUNT10') {
        discount = subtotal * 0.1; // 10% de descuento
      } else if (orderData.couponCode === 'DISCOUNT20') {
        discount = subtotal * 0.2; // 20% de descuento
      }
    }
    
    // Calcular impuestos (8% por ejemplo)
    const taxes = (subtotal - discount) * 0.08;
    
    // Calcular total
    const total = subtotal - discount + taxes;
    
    // Crear objeto de orden completo
    const order: Order = {
      milk: orderData.milk!,
      syrup: orderData.syrup!,
      caffeine: orderData.caffeine!,
      subtotal,
      discount,
      taxes,
      total,
      couponCode: orderData.couponCode || null,
      createdAt: new Date()
    };
    
    try {
      console.log('Intentando guardar orden en Firebase:', order);
      console.log('Usando colección:', 'orders');
      console.log('Firestore inicializado:', this.firestore ? 'Sí' : 'No');
      
      // Obtener el ID del usuario actual
      const user = await firstValueFrom(this.authService.getCurrentUser());
      if (user) {
        order.userId = user.uid;
      }
      
      // Guardar en Firebase
      const ordersCollection = collection(this.firestore, 'orders');
      console.log('Colección obtenida:', ordersCollection ? 'Sí' : 'No');
      
      const docRef = await addDoc(ordersCollection, order);
      console.log('Orden guardada en Firebase con ID:', docRef.id);
      
      // Actualizar el ID y guardar en el estado actual
      order.id = docRef.id;
      this.currentOrderSubject.next(order);
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar la orden: ', error);
      console.error('Detalles del error:', JSON.stringify(error, null, 2));
      console.error('Mensaje de error:', error instanceof Error ? error.message : 'Error desconocido');
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No disponible');
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(this.firestore, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Order;
        data.id = docSnap.id;
        this.currentOrderSubject.next(data);
        return data;
      } else {
        console.log('No se encontró la orden');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la orden: ', error);
      return null;
    }
  }

  setCurrentOrder(order: Order): void {
    this.currentOrderSubject.next(order);
  }

  clearCurrentOrder(): void {
    this.currentOrderSubject.next(null);
  }

  // Método para aplicar un cupón simulado
  applyCoupon(couponCode: string): number {
    if (couponCode === 'DISCOUNT10') {
      return 0.1; // 10% de descuento
    } else if (couponCode === 'DISCOUNT20') {
      return 0.2; // 20% de descuento
    }
    return 0; // No hay descuento
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const ordersCollection = collection(this.firestore, 'orders');
      // Solo ordenamos por fecha, sin filtrar por usuario
      const q = query(
        ordersCollection,
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Convertir Timestamp a Date si es necesario
        let createdAtDate: Date;
        
        if (data['createdAt'] && typeof (data['createdAt'] as Timestamp).toDate === 'function') {
          createdAtDate = (data['createdAt'] as Timestamp).toDate();
        } else {
          createdAtDate = new Date(data['createdAt']);
        }
        
        orders.push({
          ...data as Omit<Order, 'createdAt'>,
          id: doc.id,
          createdAt: createdAtDate
        });
      });
      
      return orders;
    } catch (error) {
      console.error('Error al obtener todas las órdenes: ', error);
      return [];
    }
  }

  async getUserOrders(): Promise<Order[]> {
    try {
      const user = await firstValueFrom(this.authService.getCurrentUser());
      if (!user) {
        console.log('No hay usuario autenticado');
        return [];
      }
      
      console.log('Usuario autenticado:', user.uid);
      console.log('Email del usuario:', user.email);

      const ordersCollection = collection(this.firestore, 'orders');
      const q = query(
        ordersCollection, 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      console.log('Buscando órdenes para el usuario:', user.uid);
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Convertir Timestamp a Date si es necesario
        let createdAtDate: Date;
        
        if (data['createdAt'] && typeof (data['createdAt'] as Timestamp).toDate === 'function') {
          createdAtDate = (data['createdAt'] as Timestamp).toDate();
        } else {
          createdAtDate = new Date(data['createdAt']);
        }
        
        orders.push({
          ...data as Omit<Order, 'createdAt'>,
          id: doc.id,
          createdAt: createdAtDate
        });
      });
      
      console.log(`Se encontraron ${orders.length} órdenes para el usuario ${user.uid}`);
      
      return orders;
    } catch (error) {
      console.error('Error al obtener las órdenes del usuario: ', error);
      return [];
    }
  }
}
