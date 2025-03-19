import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { Task } from '../task/task';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, NgIf, NgFor, DragDropModule, TaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  showMessage = false;
  submitted = false;
  todo: Task[] = [
    {
      title: 'Buy milk',
      description: 'Go to the store and buy milk',
      list: 'todo'
    },
    {
      title: 'Drawing on canvas',
      description: 'buy 3 canvas and pens!',
      list: 'todo'
    }
  ];
  inProgress: Task[] = [];
  done: Task[] = [];

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

  constructor() {}
  
  ngOnInit(): void {}
  
  get title() { return this.addTaskForm.get('title')!; }
  get description() { return this.addTaskForm.get('description')!; }
  
  onSubmit(): void {
    this.submitted = false;
    if (this.addTaskForm.invalid) return;
  }
  
  addTask(): void {
    if (this.addTaskForm.valid) {
      const newTask: Task = {
        title: this.title.value || '',
        description: this.description.value || '',
        list: 'todo'
      };
      
      this.todo.push(newTask);
      this.addTaskForm.reset();
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 3000);
    }
  }
  
  editTask(list: string, task: Task): void {
    // Implement edit functionality if needed
    console.log('Edit task', task);
  }
  
  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) return;
    
    if (!event.container.data || !event.previousContainer.data) return;
    
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
  
  deleteIt(list: string, task: Task): void {
    if (list === 'todo') {
      const index = this.todo.indexOf(task);
      if (index > -1) {
        this.todo.splice(index, 1);
      }
    }
    else if (list === 'inProgress') {
      const index = this.inProgress.indexOf(task);
      if (index > -1) {
        this.inProgress.splice(index, 1);
      }
    }
    else if (list === 'done') {
      const index = this.done.indexOf(task);
      if (index > -1) {
        this.done.splice(index, 1);
      }
    }
  }
}
