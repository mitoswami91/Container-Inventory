import { AbstractControl } from '@angular/forms';
import { ValidateContainerNoService } from './validate-container-no.service'


export function ValidateContNo(control: AbstractControl) {
    const validate = new ValidateContainerNoService();
  if (!validate.IsValid(control.value)) {
    return {inValidContNo:true}
  }
return null
  
}