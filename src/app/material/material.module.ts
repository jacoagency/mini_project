import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatListModule } from '@angular/material/list';


@NgModule({
  imports: [
      MatSidenavModule, MatToolbarModule, MatIconModule,
      MatButtonModule, MatListModule, MatMenuModule,
      MatTabsModule,
  ],
  exports: [
      MatSidenavModule, MatToolbarModule, MatIconModule,
      MatButtonModule, MatListModule, MatMenuModule,
      MatTabsModule,
  ]
})
export class MaterialModule {}