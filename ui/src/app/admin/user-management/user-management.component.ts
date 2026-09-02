import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, HttpClientModule], // Clean structural directives ke liye
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
    usersList: any[] = [];
    isLoading: boolean = false;
    private apiUrl = 'http://localhost:3000/user'; // Apne NestJS port ke mutabik change karein

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.loadAllUsers();
    }

    loadAllUsers(): void {
        this.isLoading = true;
        this.http.get<any>(`${this.apiUrl}/all`).subscribe({
            next: res => {
                // NestJS standard response me actual data 'data' property me hota hai
                this.usersList = res.data || [];
                this.isLoading = false;
            },
            error: err => {
                console.error('Users load karne me dikkat hui:', err);
                this.isLoading = false;
            },
        });
    }

    onDeactivateUser(id: number, name: string): void {
        if (
            confirm(
                `Kya aap sach me "${name}" ko deactivate karna chahte hain?`
            )
        ) {
            this.http.delete(`${this.apiUrl}/deactivate/${id}`).subscribe({
                next: () => {
                    alert('User safalata purvak deactivate ho gaya!');
                    this.loadAllUsers(); // List refresh karne ke liye
                },
                error: err => {
                    alert('Deactivation fail ho gaya!');
                    console.error(err);
                },
            });
        }
    }
}
