import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from './task';
import { MaterialModule } from '../../material/material.module';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MaterialModule, NgIf],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();
  
  constructor() {}
  
  ngOnInit(): void {}
}
