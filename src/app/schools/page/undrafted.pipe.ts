import {
  Pipe,
  PipeTransform
} from 'angular2/core';

import {School} from '../school';

@Pipe({
  name: 'undrafted'
})
export class UndraftedPipe implements PipeTransform {

  transform(schools: School[], args: any) {
    if (!args || args[0]) {
      return schools.filter((school: School) => { return !school.drafted; });
    }

    return schools;
  }
}
