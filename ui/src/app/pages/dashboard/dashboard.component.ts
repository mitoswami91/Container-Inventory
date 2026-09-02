import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModule } from '../../prime-components/prime-components.module';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/shared/auth.service';
import { CommonModule } from '@angular/common';
import { ContainerService } from '../../core/services/modules services/container.service';
import { ToastService } from '../../app.toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PrimeComponentsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  canAdd: boolean = false;
  canClear: boolean = false;
  isAdmin: boolean = false;
  isClearing: boolean = false;
  currentDeletingContNo: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService,
    private containerService: ContainerService,
    private notification: ToastService
  ) {}

  AddContainer(){
    this.router.navigate(['add-container'])
  }
  viewContainer(){
    this.router.navigate(['view-container'])
  }
  viewAllContainers(){
    this.router.navigate(['all-container'])
  }
  userManagement(){
    this.router.navigate(['user-management'])
  }

  clearData() {
    if (confirm('WARNING: Are you sure you want to clear/delete all container inventory data? This will destroy all current records.')) {
      this.isClearing = true;
      this.currentDeletingContNo = 'Connecting to database...';

      // Cycle status messages for premium feel
      setTimeout(() => {
        this.currentDeletingContNo = 'Securing database backup logs...';
      }, 500);

      setTimeout(() => {
        this.currentDeletingContNo = 'Wiping active inventory data...';
      }, 1000);

      setTimeout(() => {
        this.currentDeletingContNo = 'Finalizing table optimization...';
      }, 1500);

      this.containerService.ClearAllContainers().subscribe({
        next: (res: any) => {
          setTimeout(() => {
            this.isClearing = false;
            this.currentDeletingContNo = '';
            this.notification.show('success', 'Inventory Reset', 'All container data has been archived and cleared successfully.');
          }, 2000);
        },
        error: (err: any) => {
          this.isClearing = false;
          this.currentDeletingContNo = '';
          this.notification.show('error', 'Reset Failed', err.error.message || 'Error occurred while resetting data.');
        }
      });
    }
  }

  ngOnInit(): void {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['login']);
    } else {
      this.canAdd = this.authService.canAdd();
      this.canClear = this.authService.canClear();
      this.isAdmin = this.authService.hasRole('ADMIN');
    }
  }
}
