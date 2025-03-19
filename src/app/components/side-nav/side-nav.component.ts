import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();
  
  constructor() {}
  
  ngOnInit(): void {}
  
  onClose() {
    this.sidenavClose.emit();
  }
}
