import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PrimeComponentsModule } from '../../prime-components/prime-components.module';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../app.toast.service';
import { AuthService } from '../../core/services/shared/auth.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, PrimeComponentsModule, CommonModule],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
    sidebarVisible: boolean = false;
    location: string = '';
    isAdmin: boolean = false;

    constructor(
        private router: Router,
        private notification: ToastService,
        private authService: AuthService
    ) {}

    toggleSidebar() {
        this.router.navigate(['dashboard']);
    }
    goToUserManagement() {
        this.router.navigate(['user-management']);
    }

    toggleMenu(element: HTMLElement) {
        element.classList.toggle('hidden');
    }

    logout() {
        localStorage.clear();
        this.notification.show('success', '', 'Logged out.');
        this.router.navigate(['login']);
    }

    ngOnInit(): void {
        this.location = this.authService.getDataFromStorage('location');
        this.isAdmin = this.authService.hasRole('ADMIN');
    }
}
