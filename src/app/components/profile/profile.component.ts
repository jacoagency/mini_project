import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MaterialModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any;
  loading = true;
  error = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.getCurrentUser()
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          if (user) {
            this.user = {
              email: user.email,
              uid: user.uid,
              displayName: user.displayName || 'No name set',
              photoURL: user.photoURL || 'assets/default-avatar.svg'
            };
            this.loading = false;
          } else {
            this.error = true;
            this.loading = false;
          }
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
  }
} 