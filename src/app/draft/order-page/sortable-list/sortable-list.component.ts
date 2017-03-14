import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter
} from 'angular2/core';

import 'script-loader!uglify-loader!./sortable.js';
declare var Sortable: any;

@Component({
  selector: 'sortable-list',
  template: require('./sortable-list.component.html'),
  styles: [require('./sortable-list.component.scss')]
})
export class SortableList {

  editing: number = null;

  _list: Array<any>;
  @Input() set list(list: Array<any>) {
    if (!list) { return; }

    if (!this.list) {
      this._list = list;
      Sortable.create(this._el.nativeElement.querySelector('md-list'), {
        draggable: '.sortable-item',
        store: {
          get: () => this.setOrder(),
          set: (sortable) => this.onUpdate(sortable)
        }
      });
    } else {
      this._list = list;
    }

  }
  get list(): Array<any> {
    return this._list;
  }

  @Output() orderChanged: EventEmitter<Array<any>> = new EventEmitter();
  @Output() nameChanged: EventEmitter<Array<any>> = new EventEmitter();

  constructor(private _el: ElementRef) { }

  setOrder() {
    let order = [];
    for (let i = 0; i < this.list.length; i++) {
        order.push(i);
    }
    return order;
  }

  onUpdate(sortable) {
    this.list = sortable.toArray()
                  .map((s: string) => parseInt(s, 10))
                  .map((n: number) => this.list[n]);
    this.orderChanged.next(this.list);
  }

  edited(event, id) {
    this.nameChanged.next({id: id, name: event.srcElement.value});
  }

  entered(event, i) {
    event.preventDefault();
    this.editing = null;
  }

  blur(event, i) {
    this.editing = null;
  }

}
