import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter
} from 'angular2/core';

declare var Sortable: any;

@Component({
  selector: 'sortable-list',
  template: require('./sortable-list.component.html'),
  styles: [require('./sortable-list.component.scss')]
})
export class SortableList {

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

  @Output() changed: EventEmitter<Array<any>> = new EventEmitter();

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
    this.changed.next(this.list);
  }

}
