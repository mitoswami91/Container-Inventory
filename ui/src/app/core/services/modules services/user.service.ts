import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constant } from '../../constant/endpoints/api';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiClient:HttpClient) {
   }

   Login(loginDetails:any){
    let url:string = `${Constant.BASE_URL}${Constant.AUTH}`
    return this.apiClient.post(url,loginDetails);
   }

   GetAllUsers() {
    let url: string = `${Constant.BASE_URL}user/all`;
    return this.apiClient.get(url);
   }

   CreateUser(userData: any) {
    let url: string = `${Constant.BASE_URL}user/save`;
    return this.apiClient.post(url, userData);
   }

   UpdateUser(id: number, userData: any) {
    let url: string = `${Constant.BASE_URL}user/update/${id}`;
    return this.apiClient.post(url, userData);
   }

   DeactivateUser(id: number) {
    let url: string = `${Constant.BASE_URL}user/deactivate/${id}`;
    return this.apiClient.delete(url);
   }
}
