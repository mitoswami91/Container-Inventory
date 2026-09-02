import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from '../../prime-components/prime-components.module';
import { UserService } from '../../core/services/modules services/user.service';
import { AuthService } from '../../core/services/shared/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../app.toast.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [PrimeComponentsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  cols: any[] = [];
  displayDialog: boolean = false;
  dialogTitle: string = 'Add New User';
  userForm!: FormGroup;
  isEditMode: boolean = false;
  currentUserId: number | null = null;
  rolesList: any[] = [
    { name: 'Administrator', value: 'ADMIN' },
    { name: 'Field User', value: 'USER' }
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notification: ToastService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn() || !this.authService.hasRole('ADMIN')) {
      this.notification.show('error', 'Access Denied', 'केवल एडमिन ही इस पेज को एक्सेस kar sakte hain.');
      this.router.navigate(['dashboard']);
      return;
    }
    
    this.cols = [
      { field: 'full_name', header: 'Full Name' },
      { field: 'user_name', header: 'Username' },
      { field: 'login_count_text', header: 'Logins' },
      { field: 'status_text', header: 'Status' }
    ];

    this.initForm();
    this.loadUsers();
  }

  initForm() {
    this.userForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      user_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      status: [true, [Validators.required]],
      role: ['USER', [Validators.required]],
      can_add: [true],
      can_delete: [false],
      can_clear: [false]
    });
  }

  loadUsers() {
    this.userService.GetAllUsers().subscribe({
      next: (res: any) => {
        const rawUsers = res.data || [];
        this.users = rawUsers.map((user: any) => ({
          ...user,
          status_text: user.status ? 'Active' : 'Inactive',
          login_count_text: user._count?.login_logs || 0
        }));
      },
      error: err => {
        console.error('Error fetching users:', err);
        this.notification.show('error', 'Failed to Load Users', 'डेटाबेस से यूजर्स लोड करने में विफलता।');
      }
    });
  }

  showAddDialog() {
    this.isEditMode = false;
    this.currentUserId = null;
    this.dialogTitle = 'Add New User';
    this.userForm.reset({
      full_name: '',
      user_name: '',
      password: '',
      status: true,
      role: 'USER',
      can_add: true,
      can_delete: false,
      can_clear: false
    });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.displayDialog = true;
  }

  showEditDialog(user: any) {
    this.isEditMode = true;
    this.currentUserId = user.id;
    this.dialogTitle = `Edit User: ${user.full_name}`;
    this.userForm.patchValue({
      full_name: user.full_name,
      user_name: user.user_name,
      password: '', // Leave empty unless modifying password
      status: user.status,
      role: user.role,
      can_add: user.can_add,
      can_delete: user.can_delete,
      can_clear: user.can_clear
    });
    // Password is not required during edit
    this.userForm.get('password')?.setValidators([Validators.minLength(8)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.displayDialog = true;
  }

  saveUser() {
    if (this.userForm.invalid) {
      return;
    }

    const formVal = this.userForm.value;
    const userData: any = {
      full_name: formVal.full_name,
      user_name: formVal.user_name,
      status: formVal.status,
      role: formVal.role,
      can_add: formVal.can_add,
      can_delete: formVal.can_delete,
      can_clear: formVal.can_clear
    };

    if (formVal.password) {
      userData.password = formVal.password;
    }

    if (this.isEditMode && this.currentUserId) {
      this.userService.UpdateUser(this.currentUserId, userData).subscribe({
        next: (res: any) => {
          this.notification.show('success', 'User Updated', 'यूजर की जानकारी सफलतापूर्वक अपडेट कर दी गई है।');
          this.displayDialog = false;
          this.loadUsers();
        },
        error: err => {
          console.error('Error updating user:', err);
          this.notification.show('error', 'Update Failed', err.error.message || 'यूजर अपडेट करने में त्रुटि आई।');
        }
      });
    } else {
      // In create mode, password is required
      if (!formVal.password) {
        this.notification.show('error', 'Validation Error', 'नए यूजर के लिए पासवर्ड आवश्यक है।');
        return;
      }
      userData.password = formVal.password;
      this.userService.CreateUser(userData).subscribe({
        next: (res: any) => {
          this.notification.show('success', 'User Created', 'नया यूजर सफलतापूर्वक बना दिया गया है।');
          this.displayDialog = false;
          this.loadUsers();
        },
        error: err => {
          console.error('Error creating user:', err);
          this.notification.show('error', 'Creation Failed', err.error.message || 'नया यूजर बनाने में त्रुटि आई।');
        }
      });
    }
  }

  toggleUserStatus(user: any) {
    this.userService.DeactivateUser(user.id).subscribe({
      next: (res: any) => {
        this.notification.show('success', 'Status Changed', `यूजर "${user.full_name}" का स्टेटस बदल दिया गया है।`);
        this.loadUsers();
      },
      error: err => {
        console.error('Error toggling user status:', err);
        this.notification.show('error', 'Action Failed', 'स्टेटस बदलने में विफलता।');
      }
    });
  }
}
