import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { NgIf, AsyncPipe } from '@angular/common';
import { TasksComponent } from '../tasks/tasks.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIf, AsyncPipe, TasksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }
}
