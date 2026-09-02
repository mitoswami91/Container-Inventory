import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModule } from '../../prime-components/prime-components.module';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../app.toast.service';
import { UserService } from '../../core/services/modules services/user.service';
import { AuthService } from '../../core/services/shared/auth.service';
import { CommonModule } from '@angular/common';

interface iLocations {
  name: string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PrimeComponentsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {

  locations: iLocations[] | undefined
  constructor(
    private router: Router,
    private notification: ToastService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.locations = [{ name: 'SMS1' }, { name: 'SMS2' }, { name: 'SMS3' },{name: 'SMS4'},{name: 'SMS5'}]
  }

  login_form: FormGroup = new FormGroup({
    user_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
    ]),
    location: new FormControl('', [
      Validators.required
    ])
  });

  login() {
    const { location, ...rest } = this.login_form.value;

    this.userService.Login(rest).subscribe({
      next: (res: any) => {
        this.authService.clearStorage()
        this.authService.saveDataInStorage('location', location.name)
        this.authService.setTokenInLocalStorage(res.data?.access_token);
        this.notification.show('success', 'Authentication Success', 'Login Sucess');
        this.router.navigate(['dashboard']);
      },
      error: (err: any) => {
        this.notification.show('error', 'Authentication Error', err.error.message);
      }
    })

  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
  }
}
