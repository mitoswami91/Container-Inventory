import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  declarations: [],
  imports: [
    InputTextModule, 
    ButtonModule, 
    SidebarModule, 
    DropdownModule, 
    InputMaskModule, 
    TableModule,
    DialogModule,
    InputSwitchModule,
    CheckboxModule,
    TooltipModule,
    AutoCompleteModule
  ],
  exports: [
    InputTextModule, 
    ButtonModule, 
    SidebarModule, 
    DropdownModule, 
    InputMaskModule, 
    TableModule,
    DialogModule,
    InputSwitchModule,
    CheckboxModule,
    TooltipModule,
    AutoCompleteModule
  ],
})
export class PrimeComponentsModule { }
