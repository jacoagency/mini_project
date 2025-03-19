import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    MaterialModule,
    HeaderComponent,
    HomeComponent,
    SideNavComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'material1';
  
  onToggleSidenav() {
    console.log('Toggle sidenav');
    // Aquí puedes implementar la lógica para abrir/cerrar el sidenav
  }
}
