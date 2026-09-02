import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModule } from '../../prime-components/prime-components.module';
import { iContainer } from './container';
import { ContainerService } from '../../core/services/modules services/container.service';
import { AuthService } from '../../core/services/shared/auth.service';
import { DatePipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'view-container',
    standalone: true,
    imports: [PrimeComponentsModule, DatePipe, CommonModule],
    templateUrl: './view-container.component.html',
    styleUrl: './view-container.component.scss',
})
export class ViewContainerComponent implements OnInit {
    container: iContainer[] = [];
    canDelete: boolean = false;
    viewMode: 'table' | 'cards' = 'table';
    selectedContainer: any = null;
    displayInspectDialog: boolean = false;

    constructor(
        private containerService: ContainerService,
        private authService: AuthService,
        private router: Router
    ) {}

    openInspect(item: any) {
        this.selectedContainer = item;
        this.displayInspectDialog = true;
    }

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['login']);
            return;
        }
        if (!this.authService.hasRole('ADMIN')) {
            this.router.navigate(['dashboard']);
            return;
        }

        this.canDelete = this.authService.canDelete();

        const data = {
            user_id: Number(this.authService.getDataFromStorage('id')),
        };

        this.containerService.View(data).subscribe({
            next: (res: any) => {
                // Safe check: If backend sends data wrapped inside an object or directly as an array
                const fetchedData = res.data ? res.data : res;

                if (Array.isArray(fetchedData)) {
                    // Map and add a sequential serial number (sr) to each container object
                    this.container = fetchedData.map((object, index) => ({
                        ...object,
                        sr: index + 1,
                    }));
                }
            },
            error: error => {
                console.error('Failed to fetch container data:', error);
            },
        });
    }

    deleteRow(id?: number): void {
        if (!id) return;
        if (!this.canDelete) {
            alert('आपके पास एंट्री डिलीट करने की अनुमति नहीं है।');
            return;
        }
        if (confirm('क्या आप वाकई इस कंटेनर की एंट्री डिलीट करना चाहते हैं?')) {
            this.containerService.DeleteContainer(id).subscribe({
                next: (res: any) => {
                    this.container = this.container.filter(
                        item => (item as any).id !== id
                    );
                    this.container = this.container.map((object, index) => ({
                        ...object,
                        sr: index + 1,
                    }));
                },
                error: err => {
                    console.error('Delete call failed:', err);
                    alert('Error: Entry delete nahi ho payi!');
                },
            });
        }
    }
}
