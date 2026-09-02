import { inject,Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  messageService = inject(MessageService);
  
  show(severity:string, summary:string,detail:string){
    this.messageService.add({severity:severity,summary:summary,detail:detail});
  }
}
