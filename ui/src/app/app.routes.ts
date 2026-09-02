import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddContainerComponent } from './pages/add-container/add-container.component';
import { ViewContainerComponent } from './pages/view-container/view-container.component';
import { AllContainerComponent } from './pages/all-container/all-container.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'add-container', component: AddContainerComponent },
            { path: 'view-container', component: ViewContainerComponent },
            { path: 'all-container', component: AllContainerComponent },
            { path: 'user-management', component: UserManagementComponent },
        ],
    },
];
