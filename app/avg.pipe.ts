import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: "avg",
  pure: false
})

export class AvgPipe implements PipeTransform {
    transform(input) {
      var total = 0;
      for (var i = 0; i < input.length; i++) {
        total += parseFloat(input[i].attempts);
      }

      return ((17 / (total / input.length)) * 100).toFixed(2);
    }
}