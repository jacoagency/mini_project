import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Task } from '../components/task/task';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private todoSubject = new BehaviorSubject<Task[]>([]);
  private inProgressSubject = new BehaviorSubject<Task[]>([]);
  private doneSubject = new BehaviorSubject<Task[]>([]);
  
  todo$ = this.todoSubject.asObservable();
  inProgress$ = this.inProgressSubject.asObservable();
  done$ = this.doneSubject.asObservable();
  
  constructor(private firestore: Firestore) {
    this.loadTasks();
  }
  
  async loadTasks(): Promise<void> {
    try {
      console.log('Cargando tareas desde Firebase...');
      const tasksCollection = collection(this.firestore, 'tasks');
      const taskSnapshot = await getDocs(tasksCollection);
      
      const todoTasks: Task[] = [];
      const inProgressTasks: Task[] = [];
      const doneTasks: Task[] = [];
      
      taskSnapshot.forEach(doc => {
        const task = { id: doc.id, ...doc.data() } as Task;
        
        switch(task.list) {
          case 'todo':
            todoTasks.push(task);
            break;
          case 'inProgress':
            inProgressTasks.push(task);
            break;
          case 'done':
            doneTasks.push(task);
            break;
        }
      });
      
      this.todoSubject.next(todoTasks);
      this.inProgressSubject.next(inProgressTasks);
      this.doneSubject.next(doneTasks);
      console.log('Tareas cargadas desde Firebase:', { todo: todoTasks, inProgress: inProgressTasks, done: doneTasks });
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  }
  
  async addTask(task: Task): Promise<string> {
    try {
      console.log('Intentando guardar tarea en Firebase:', task);
      console.log('Usando colección:', 'tasks');
      
      const tasksCollection = collection(this.firestore, 'tasks');
      console.log('Colección obtenida:', tasksCollection ? 'Sí' : 'No');
      
      const docRef = await addDoc(tasksCollection, task);
      console.log('Tarea guardada en Firebase con ID:', docRef.id);
      
      // Actualizar el BehaviorSubject
      const currentTasks = this.todoSubject.value;
      this.todoSubject.next([...currentTasks, { ...task, id: docRef.id }]);
      
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
      console.error('Detalles del error:', JSON.stringify(error, null, 2));
      console.error('Mensaje de error:', error instanceof Error ? error.message : 'Error desconocido');
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No disponible');
      throw error;
    }
  }
  
  async updateTask(task: Task): Promise<void> {
    if (!task.id) return;
    
    try {
      const taskRef = doc(this.firestore, 'tasks', task.id);
      await updateDoc(taskRef, { ...task });
      
      // Actualizar los BehaviorSubjects según la lista actual
      this.loadTasks(); // Recargar todas las tareas para actualizar la UI
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      throw error;
    }
  }
  
  async deleteTask(task: Task): Promise<void> {
    if (!task.id) return;
    
    try {
      const taskRef = doc(this.firestore, 'tasks', task.id);
      await deleteDoc(taskRef);
      
      // Actualizar los BehaviorSubjects
      this.loadTasks(); // Recargar todas las tareas
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      throw error;
    }
  }
  
  async moveTask(task: Task, newList: string): Promise<void> {
    if (!task.id) return;
    
    // Crear una copia de la tarea con la lista actualizada
    const updatedTask = { ...task, list: newList };
    
    try {
      // Actualizar en Firestore
      const taskRef = doc(this.firestore, 'tasks', task.id);
      await updateDoc(taskRef, { list: newList });
      
      // Actualizar los BehaviorSubjects directamente sin recargar todo
      // 1. Remover de la lista original
      if (task.list === 'todo') {
        const currentTasks = this.todoSubject.value;
        this.todoSubject.next(currentTasks.filter(t => t.id !== task.id));
      } else if (task.list === 'inProgress') {
        const currentTasks = this.inProgressSubject.value;
        this.inProgressSubject.next(currentTasks.filter(t => t.id !== task.id));
      } else if (task.list === 'done') {
        const currentTasks = this.doneSubject.value;
        this.doneSubject.next(currentTasks.filter(t => t.id !== task.id));
      }
      
      // 2. Agregar a la nueva lista
      if (newList === 'todo') {
        const currentTasks = this.todoSubject.value;
        this.todoSubject.next([...currentTasks, updatedTask]);
      } else if (newList === 'inProgress') {
        const currentTasks = this.inProgressSubject.value;
        this.inProgressSubject.next([...currentTasks, updatedTask]);
      } else if (newList === 'done') {
        const currentTasks = this.doneSubject.value;
        this.doneSubject.next([...currentTasks, updatedTask]);
      }
    } catch (error) {
      console.error('Error al mover la tarea:', error);
      throw error;
    }
  }
} 