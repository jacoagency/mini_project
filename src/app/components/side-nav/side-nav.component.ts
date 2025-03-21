import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MaterialModule, RouterLink, AsyncPipe, NgIf],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();
  isLoggedIn$!: Observable<boolean>;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }
  
  onClose() {
    this.sidenavClose.emit();
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
        this.onClose();
      })
      .catch(error => console.error('Logout failed', error));
  }
}
