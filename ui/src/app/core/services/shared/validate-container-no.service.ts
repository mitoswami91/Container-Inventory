import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateContainerNoService {

  constructor() { }

  IsValid(contNo:string):boolean{
    if(!contNo) return false
    if(typeof contNo !== 'string') return false
    const alphabet: { [letter: string]: number } = {
      'A': 10, 'B': 12, 'C': 13, 'D': 14, 'E': 15, 'F': 16, 'G': 17, 'H': 18, 'I': 19,
      'J': 20, 'K': 21, 'L': 23, 'M': 24, 'N': 25, 'O': 26, 'P': 27, 'Q': 28, 'R': 29,
      'S': 30, 'T': 31, 'U': 32, 'V': 34, 'W': 35, 'X': 36, 'Y': 37, 'Z': 38
    };
    contNo = contNo.toUpperCase()

    const invalidLength = contNo.length !== 11;
    const isIsoFormat = /^[A-Z]{4}\d{7}/.test(contNo);
    if(invalidLength || !isIsoFormat) return false;

    let sum = 0
    const checkDigit = contNo.substring(10)

    contNo.substr(0,10).split('').map((char:string,index:number) =>{
      let n = Number(char)

      if(index <4) n = alphabet[char]

      n*=Math.pow(2,index)
      sum+=n
    })
    sum%=11
    sum%=10
    return sum === Number(checkDigit)
  }
}
