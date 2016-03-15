import {
  Pipe,
  PipeTransform
} from 'angular2/core';
import {School} from '../school';

let compare = (a: School, b: School, prop: string = 'ep') => {
  if (a[prop] === b[prop]) { return 0; }
  return a[prop] > b[prop] ? 1 : -1;
};

@Pipe({name: 'orderBy'})
export class OrderByPipe implements PipeTransform {

  transform(input: any, config: any = ['+']) {
    if (!Array.isArray(input)) { return input; } // value isn't even an array can't sort

    let desc = config[0].substr(0, 1) === '-';

    if (!config || !config[0] || config[0] === '-' || config[0] === '+') {
      // is a basic array that is sorting on the array's object itself
      return !desc ? input.sort(compare) : input.sort(compare).reverse();
    }

    let prop = config[0].substr(1);
    let sorted = input.sort((a, b) => compare(a, b, prop));
    return !desc ? sorted : sorted.reverse();
  }

}
