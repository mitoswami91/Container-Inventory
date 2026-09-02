import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModule } from '../../prime-components/prime-components.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ValidateContNo } from '../../core/services/shared/container-no-validator';
import { AuthService } from '../../core/services/shared/auth.service';
import { ToastService } from '../../app.toast.service';
import { ContainerService } from '../../core/services/modules services/container.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface iSize {
  size: number
}

@Component({
  selector: 'add-container',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeComponentsModule, CommonModule, FormsModule],
  templateUrl: './add-container.component.html',
  styleUrl: './add-container.component.scss'
})
export class AddContainerComponent implements OnInit {

  size: iSize[] | undefined
  saveLocation: string = ''
  saveUserId: number = 0

  // Offline Mode and Syncing properties
  isOfflineMode: boolean = false;
  localQueueLength: number = 0;
  isSyncing: boolean = false;
  isSaving: boolean = false;
  suggestions: string[] = [];
  suggestionDetails: any[] = [];

  searchContainer(event: any) {
    const query = event.query;
    if (!query || query.trim() === '') {
      this.suggestions = [];
      this.suggestionDetails = [];
      return;
    }

    this.containerService.getSuggestions(query).subscribe({
      next: (res: any) => {
        const dataList = res.data || [];
        this.suggestionDetails = dataList;
        this.suggestions = dataList.map((item: any) => item.cont_no);
        this.autoSelectSize(query);
      },
      error: (err) => {
        console.error('Failed to fetch suggestions:', err);
      }
    });
  }

  onSelectSuggestion(event: any) {
    const selectedContNo = typeof event === 'string' ? event : event?.value || event?.cont_no || this.add_container_form.value.cont_no;
    if (selectedContNo) {
      this.autoSelectSize(selectedContNo);
    }
  }

  onContainerBlur() {
    const contNo = this.add_container_form.value.cont_no;
    if (contNo && contNo.trim().length >= 4) {
      const cleanCont = contNo.toUpperCase().trim();
      const matched = this.suggestionDetails.find(item => item.cont_no.toUpperCase() === cleanCont);
      if (matched && matched.size) {
        this.applyMatchedSize(matched.size);
      } else {
        this.containerService.getSuggestions(cleanCont).subscribe({
          next: (res: any) => {
            const dataList = res.data || [];
            const exact = dataList.find((item: any) => item.cont_no.toUpperCase() === cleanCont);
            if (exact && exact.size) {
              this.applyMatchedSize(exact.size);
            }
          }
        });
      }
    }
  }

  autoSelectSize(contNo: string) {
    if (!contNo) return;
    const cleanCont = contNo.toUpperCase().trim();
    const matched = this.suggestionDetails.find(item => item.cont_no.toUpperCase() === cleanCont);
    if (matched && matched.size) {
      this.applyMatchedSize(matched.size);
    }
  }

  applyMatchedSize(sizeValue: number | string) {
    const numSize = Number(sizeValue);
    const matchedSizeObj = this.size?.find(s => s.size === numSize);
    if (matchedSizeObj) {
      this.add_container_form.patchValue({ size: matchedSizeObj });
    }
  }

  constructor(
    private authService: AuthService,
    private notification: ToastService,
    private containerService: ContainerService,
    private router: Router
  ) {
    this.size = [{ size: 20 }, { size: 40 }, { size: 45 }]
    this.saveLocation = this.authService.getDataFromStorage('location');
    this.saveUserId = Number(this.authService.getDataFromStorage('id'));
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['login']);
    } else if (!this.authService.canAdd()) {
      this.notification.show('error', 'Access Denied', 'आपके पास कंटेनर जोड़ने की अनुमति नहीं है।');
      this.router.navigate(['dashboard']);
    }

    // Load offline state preference and queue length
    const storedOfflinePref = localStorage.getItem('offline_mode_pref');
    this.isOfflineMode = storedOfflinePref === 'true';
    this.updateQueueLength();

    // Auto-sync queue if online on page load
    if (navigator.onLine) {
      this.syncQueue();
    }

    // Listen to network status changes to auto-sync when connection is restored
    window.addEventListener('online', () => {
      this.syncQueue();
    });
  }

  add_container_form: FormGroup = new FormGroup({
    cont_no: new FormControl('',
      [
        Validators.required,
        ValidateContNo
      ]),
    size: new FormControl('',
      [Validators.required]),
    location_remarks: new FormControl('')
  });

  toggleOfflineMode(active: boolean) {
    localStorage.setItem('offline_mode_pref', String(active));
    this.isOfflineMode = active;
    if (active) {
      this.notification.show('info', 'Offline Mode Enabled', 'Entries will be saved locally to sync later.');
    } else {
      this.notification.show('info', 'Online Mode Enabled', 'Entries will be sent to the server directly.');
    }
  }

  updateQueueLength() {
    const queue = JSON.parse(localStorage.getItem('offline_containers') || '[]');
    this.localQueueLength = queue.length;
  }

  save() {
    const containerNoUpper = this.add_container_form.value.cont_no.toUpperCase().trim();

    if (this.isOfflineMode) {
      // 1. Offline Mode Saving
      const queue = JSON.parse(localStorage.getItem('offline_containers') || '[]');
      
      // Check for duplicate in the local queue to prevent operator error
      const isDuplicate = queue.some((item: any) => item.cont_no === containerNoUpper);
      if (isDuplicate) {
        this.notification.show('error', 'Duplicate Entry', 'This container is already in your offline sync queue.');
        return;
      }

      queue.push({
        cont_no: containerNoUpper,
        size: this.add_container_form.value.size.size,
        location: this.saveLocation,
        location_remarks: this.add_container_form.value.location_remarks,
        user_id: this.saveUserId
      });

      localStorage.setItem('offline_containers', JSON.stringify(queue));
      this.updateQueueLength();
      
      this.notification.show("success", "Saved Locally", "Saved to offline sync queue successfully.");
      
      // Reset form but retain focus-friendly properties
      this.add_container_form.reset();
    } else {
      // 2. Direct Online Mode Saving
      this.isSaving = true;
      let data: any = {
        cont_no: containerNoUpper,
        size: this.add_container_form.value.size.size,
        location: this.saveLocation,
        location_remarks: this.add_container_form.value.location_remarks,
        user_id: this.saveUserId,
      }

      this.containerService.Add(data).subscribe({
        next: (res: any) => {
          this.notification.show("success", "Saved Online", "Container saved to database successfully.");
          this.add_container_form.reset();
          this.isSaving = false;
        },
        error: (err: any) => {
          this.notification.show('error', 'Save Failed', err.error?.message || 'Server connection failed.');
          this.isSaving = false;
        }
      });
    }
  }

  syncQueue() {
    const queue = JSON.parse(localStorage.getItem('offline_containers') || '[]');
    if (queue.length === 0) return;
    this.isSyncing = true;
    this.syncItem(queue, 0);
  }

  syncItem(queue: any[], index: number) {
    if (index >= queue.length) {
      // All items synced
      localStorage.removeItem('offline_containers');
      this.localQueueLength = 0;
      this.isSyncing = false;
      this.notification.show("success", "Sync Completed", "All offline entries have been uploaded!");
      return;
    }

    const item = queue[index];
    const data = {
      cont_no: item.cont_no,
      size: item.size,
      location: item.location,
      location_remarks: item.location_remarks,
      user_id: item.user_id
    };

    this.containerService.Add(data).subscribe({
      next: () => {
        // Proceed to next item in the sync list
        this.syncItem(queue, index + 1);
      },
      error: (err) => {
        console.error('Failed to sync item:', item, err);
        
        // Skip duplicate entries to prevent interrupting the sync queue
        const isDuplicate = err.status === 409 || 
                            err.status === 400 || 
                            (err.error?.message && (
                              err.error.message.toLowerCase().includes('already exists') || 
                              err.error.message.toLowerCase().includes('duplicate')
                            ));

        if (isDuplicate) {
          console.warn(`Skipping duplicate container in sync queue: ${item.cont_no}`);
          this.syncItem(queue, index + 1);
        } else {
          const remaining = queue.slice(index);
          localStorage.setItem('offline_containers', JSON.stringify(remaining));
          this.localQueueLength = remaining.length;
          this.isSyncing = false;
          this.notification.show("error", "Sync Interrupted", `Failed to sync ${item.cont_no}: ${err.error?.message || 'Connection lost'}`);
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['dashboard']);
  }
}
