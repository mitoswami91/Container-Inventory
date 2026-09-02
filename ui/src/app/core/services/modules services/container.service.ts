import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../../constant/endpoints/api';

@Injectable({
    providedIn: 'root',
})
export class ContainerService {
    constructor(private apiClient: HttpClient) {}

    Add(addContainer: any) {
        let url: string = `${Constant.BASE_URL}${Constant.ADD_CONTAINER}`;
        return this.apiClient.post(url, addContainer);
    }

    View(data: any) {
        let url: string = `${Constant.BASE_URL}${Constant.VIEW_CONTAINER_BY_USER_ID}`;
        return this.apiClient.post(url, data);
    }

    ViewAll() {
        let url: string = `${Constant.BASE_URL}${Constant.VIEW_ALL_CONTAINER}`;
        return this.apiClient.post(url, '');
    }

    // Bilkul sahi aur fixed Delete function
    DeleteContainer(id: number) {
        let url: string = `${Constant.BASE_URL}container/${id}`; // NestJS ka backend delete route format
        return this.apiClient.delete(url);
    }

    ClearAllContainers() {
        let url: string = `${Constant.BASE_URL}container/clear-all`;
        return this.apiClient.delete(url);
    }

    getSuggestions(query: string) {
        let url: string = `${Constant.BASE_URL}container/suggest?query=${query}`;
        return this.apiClient.get(url);
    }
}
