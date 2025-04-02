import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { Task } from '../task/task';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { TaskComponent } from '../task/task.component';
import { TaskService } from '../../services/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, DragDropModule, TaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit, OnDestroy {
  showMessage = false;
  submitted = false;
  showForm = false;
  
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  
  private todoSubscription!: Subscription;
  private inProgressSubscription!: Subscription;
  private doneSubscription!: Subscription;

  addTaskForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
  });

  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    // Suscribirse a los cambios en las listas de tareas
    this.todoSubscription = this.taskService.todo$.subscribe(tasks => {
      this.todo = tasks;
    });
    
    this.inProgressSubscription = this.taskService.inProgress$.subscribe(tasks => {
      this.inProgress = tasks;
    });
    
    this.doneSubscription = this.taskService.done$.subscribe(tasks => {
      this.done = tasks;
    });
  }
  
  ngOnDestroy(): void {
    // Limpiar suscripciones
    if (this.todoSubscription) {
      this.todoSubscription.unsubscribe();
    }
    if (this.inProgressSubscription) {
      this.inProgressSubscription.unsubscribe();
    }
    if (this.doneSubscription) {
      this.doneSubscription.unsubscribe();
    }
  }
  
  get title() { return this.addTaskForm.get('title')!; }
  get description() { return this.addTaskForm.get('description')!; }
  
  async addTask(): Promise<void> {
    if (this.addTaskForm.valid) {
      const newTask: Task = {
        title: this.title.value || '',
        description: this.description.value || '',
        list: 'todo'
      };
      
      try {
        console.log('Agregando tarea:', newTask);
        await this.taskService.addTask(newTask);
        this.addTaskForm.reset();
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      } catch (error) {
        console.error('Error al agregar tarea:', error);
      }
    }
  }
  
  editTask(list: string, task: Task): void {
    // Por ahora solo lo mostramos en la consola
    console.log('Editar tarea:', task);
  }
  
  async drop(event: CdkDragDrop<Task[]>): Promise<void> {
    if (event.previousContainer === event.container) return;
    
    if (!event.container.data || !event.previousContainer.data) return;
    
    // Obtener la tarea que se está moviendo
    const task = event.previousContainer.data[event.previousIndex];
    
    // Determinar la nueva lista
    let newList: string;
    if (event.container.id === 'todo') {
      newList = 'todo';
    } else if (event.container.id === 'inProgress') {
      newList = 'inProgress';
    } else {
      newList = 'done';
    }
    
    // 1. Actualizar la UI inmediatamente para mejor UX
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    
    // Crear una copia de la tarea con la lista actualizada
    const updatedTask = { ...task, list: newList };
    
    // 2. Luego actualizar en Firebase (en segundo plano)
    try {
      console.log('Moviendo tarea:', task, 'a lista:', newList);
      this.taskService.moveTask(updatedTask, newList).catch(error => {
        console.error('Error al mover la tarea:', error);
        // Si hay error, revertir el cambio en la UI
        alert('Error al mover la tarea. Se revertirá el cambio.');
        this.taskService.loadTasks();
      });
    } catch (error) {
      console.error('Error al mover la tarea:', error);
    }
  }
  
  async deleteIt(list: string, task: Task): Promise<void> {
    try {
      console.log('Eliminando tarea:', task);
      await this.taskService.deleteTask(task);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  }
}
