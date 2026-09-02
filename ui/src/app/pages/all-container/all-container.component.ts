import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PrimeComponentsModule } from '../../prime-components/prime-components.module';
import { iColumn, iContainer, iExportColumn } from './all-container';
import { ContainerService } from '../../core/services/modules services/container.service';
import { get } from 'lodash';
import * as lsh from 'lodash';
import { AuthService } from '../../core/services/shared/auth.service';
import { Router } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
    selector: 'app-all-container',
    standalone: true,
    imports: [PrimeComponentsModule, DatePipe, CommonModule],
    templateUrl: './all-container.component.html',
    styleUrl: './all-container.component.scss',
})
export class AllContainerComponent implements OnInit {
    _ = get;
    container: iContainer[] = [];
    cols!: iColumn[];
    exportColumn!: iExportColumn[];
    newColumn!: iExportColumn[];
    canDelete: boolean = false;
    canClear: boolean = false;

    isClearing: boolean = false;
    currentDeletingContNo: string = '';

    constructor(
        private containerService: ContainerService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (this.authService.isLoggedIn()) {
            if (!this.authService.hasRole('ADMIN')) {
                this.router.navigate(['dashboard']);
                return;
            }
            this.canDelete = this.authService.canDelete();
            this.canClear = this.authService.canClear();

            this.containerService.ViewAll().subscribe({
                next: (res: any) => {
                    this.container = res.data;
                    // Row index setting for serial numbers
                    this.container = this.container.map((object, index) => ({
                        ...object,
                        sr: index + 1,
                    }));
                },
                error: error => {
                    console.log(error);
                },
            });

            this.cols = [
                { field: 'sr', header: 'Sr', visible: true },
                {
                    field: 'id',
                    header: 'Id',
                    customExportHeader: 'Id',
                    visible: false,
                },
                { field: 'cont_no', header: 'Cont No', visible: true },
                { field: 'size', header: 'Size', visible: true },
                { field: 'location', header: 'Location', visible: true },
                {
                    field: 'location_remarks',
                    header: 'Location Remarks',
                    visible: true,
                },
                { field: 'User.full_name', header: 'User Name', visible: true },
                { field: 'created_at', header: 'Created At', visible: true },
            ];

            this.exportColumn = this.cols.map(col => ({
                title: col.header,
                datakey: col.field,
            }));
        } else {
            this.router.navigate(['login']);
        }
    }

    getEventValue($event: any): string {
        return $event.target.value;
    }
    deleteRow(id: number): void {
        if (!this.canDelete) {
            alert('आपके पास एंट्री डिलीट करने की अनुमति नहीं है।');
            return;
        }
        if (confirm('क्या आप वाकई इस कंटेनर की एंट्री डिलीट करना चाहते हैं?')) {
            this.containerService.DeleteContainer(id).subscribe({
                next: (res: any) => {
                    // Success hone par bina page refresh kiye list ko filter kar dega
                    this.container = this.container.filter(
                        item => this._(item, 'id') !== id
                    );
                    // Serial numbers ko dobara properly order me set karega
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

    clearAllInventory(): void {
        if (!this.canClear) {
            alert('आपके पास डेटा साफ़ करने की अनुमति नहीं है।');
            return;
        }
        if (confirm('WARNING: क्या आप सच में पूरा कंटेनर इन्वेंटरी डेटा साफ़ (clear) करना चाहते हैं? यह प्रक्रिया वापस नहीं ली जा सकती!')) {
            const originalContainers = [...this.container];
            if (originalContainers.length === 0) {
                this.containerService.ClearAllContainers().subscribe({
                    next: () => alert('डेटाबेस पहले से ही साफ़ है!'),
                    error: err => console.error(err)
                });
                return;
            }

            this.isClearing = true;
            this.currentDeletingContNo = 'Securing database backup logs...';

            let index = 0;
            const animateNextRow = () => {
                if (index < this.container.length) {
                    const item = this.container[index];
                    item.isDeleting = true; // Flags row for CSS transition (slide & fade out)
                    this.currentDeletingContNo = `Archiving: ${item.cont_no} (${item.location})`;
                    index++;
                    setTimeout(animateNextRow, 100); // 100ms delay between rows
                } else {
                    // All rows have animated, now trigger backend database clear
                    this.currentDeletingContNo = 'Finalizing table optimization...';
                    this.containerService.ClearAllContainers().subscribe({
                        next: (res: any) => {
                            setTimeout(() => {
                                this.isClearing = false;
                                this.container = [];
                                this.currentDeletingContNo = '';
                                alert('सभी कंटेनर डेटा साफ़ कर दिया गया है और बैकअप सुरक्षित कर दिया गया है!');
                            }, 500); // Small delay to let user see "Finalizing..."
                        },
                        error: err => {
                            this.isClearing = false;
                            this.currentDeletingContNo = '';
                            console.error('Clear call failed:', err);
                            alert('त्रुटि: डेटा साफ़ नहीं किया जा सका!');
                            // Reset state flags
                            originalContainers.forEach(c => c.isDeleting = false);
                            this.container = originalContainers;
                        }
                    });
                }
            };

            animateNextRow();
        }
    }
}
