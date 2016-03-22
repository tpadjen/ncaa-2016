import {
  ComponentRef,
  Injectable,
  Injector,
  provide,
  Provider
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';

import 'firebase/lib/firebase-web';


@Injectable()
export class FirebaseData {}

export function extend(obj: {}, data: {}) {
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      obj[key] = data[key];
    }
  }
}

interface FirebaseModel0<T> {
  new(obj: FirebaseData): T;
}
interface FirebaseModel1<T> {
  new(obj: FirebaseData, b: any): T;
}
interface FirebaseModel2<T> {
  new(obj: FirebaseData, b: any, c: any): T;
}
interface FirebaseModel3<T> {
  new(obj: FirebaseData, b: any, c: any, d: any): T;
}


export class NgFirebase {

  static appRef: ComponentRef;

  static object<T>(
    ref: FirebaseQuery,
    type?: FirebaseModel0<T> |
           FirebaseModel1<T> |
           FirebaseModel2<T> |
           FirebaseModel3<T>,
    opts?: { load: boolean, keyName?: string; }
  ): Observable<T> {
    return Observable.create(function(observer: any) {
      opts = opts || {
        load: true,
        keyName: 'id'
      };
      const keyFieldName = type && type['FirebaseKeyName'] ?
                            type['FirebaseKeyName'] : opts.keyName;

      function value(snapshot: FirebaseDataSnapshot) {
        let child = snapshot.val();
        child[keyFieldName] = snapshot.key();
        if (type && NgFirebase.appRef) {
          let providers = [provide(FirebaseData, {useValue: child})];
          let injector = NgFirebase.appRef.injector;
          if (!opts.load) injector = Injector.resolveAndCreate([]);
          let childInjector = injector.resolveAndCreateChild(providers);
          child = childInjector.resolveAndInstantiate(type);
        }
        observer.next(child);
      }
      ref.on('value', value);
      return function() {
        ref.off('value', value);
      };
    });
  }

  static array<T>(
    ref: FirebaseQuery,
    type?: FirebaseModel0<T> |
           FirebaseModel1<T> |
           FirebaseModel2<T> |
           FirebaseModel3<T>,
    keyName?: string): BehaviorSubject<T[]> {

    let observableArray = Observable.create(function(observer: Observer<T[]>) {
      // Looking for how to type this well.
      let arr: T[] = [];
      const keyFieldName = keyName ? keyName :
            (type && type['FirebaseKeyName'] ? type['FirebaseKeyName'] : 'id');
      let lastIdInSnapshot = null;

      function child_added(snapshot: FirebaseDataSnapshot, prevChildKey: string) {
        if (snapshot.key() === lastIdInSnapshot) return;

        let child = snapshot.val();
        child[keyFieldName] = snapshot.key();
        if (type) child = NgFirebase._instantiateObject(child, type);
        let prevEntry = arr.find((y) => y[keyFieldName] === prevChildKey);
        arr.splice(prevChildKey ? arr.indexOf(prevEntry) + 1 : 0, 0, child);
        observer.next(arr.slice()); // Safe copy
      }

      function child_changed(snapshot: FirebaseDataSnapshot) {
        let key = snapshot.key();
        let child = snapshot.val();
        child[keyFieldName] = key;
        if (type) child = NgFirebase._instantiateObject(child, type);
        let i = arr.findIndex((y) => y[keyFieldName] === key);
        if (i !== -1) { arr[i] = child; }
        observer.next(arr.slice()); // Safe copy
      }

      function child_removed(snapshot: FirebaseDataSnapshot) {
        let key = snapshot.key();
        let child = snapshot.val();
        let x = arr.find((y) => y[keyFieldName] === key);
        if (x) {
          arr.splice(arr.indexOf(x), 1);
        }
        observer.next(arr.slice()); // Safe copy
      }

      function child_moved(snapshot: FirebaseDataSnapshot, prevChildKey: string) {
        let key = snapshot.key();
        let child = snapshot.val();
        child[keyFieldName] = key;
        // Remove from old slot
        let x = arr.find((y) => y[keyFieldName] === key);
        let changed = null;
        if (x) {
          changed = arr.splice(arr.indexOf(x), 1);
        } else {
          if (type) child = NgFirebase._instantiateObject(child, type);
          changed = child;
        }
        // Add in new slot
        let prevEntry = arr.find((y) => y[keyFieldName] === prevChildKey);
        if (prevEntry) {
          arr.splice(arr.indexOf(prevEntry) + 1, 0, changed);
        } else {
          arr.splice(0, 0, changed);
        }
        observer.next(arr.slice()); // Safe copy
      }

      // Start out with entire array
      ref.once('value', (snapshot) => {
        let array = snapshot.val();
        arr = [];
        let keys = Object.keys(array);
        for (let key of keys) {
          array[key][keyFieldName] = key;
          if (type) array[key] = NgFirebase._instantiateObject(array[key], type);
          arr.push(array[key]);
        }
        observer.next(arr.slice());
        lastIdInSnapshot = keys[keys.length-1];

        ref.limitToLast(1).on('child_added', child_added);
        ref.on('child_changed', child_changed);
        ref.on('child_removed', child_removed);
        ref.on('child_moved', child_moved);
      });

      return function() {
        ref.off('child_added', child_added);
        ref.off('child_changed', child_changed);
        ref.off('child_removed', child_removed);
        ref.off('child_moved', child_moved);
      };
    });

    let subject: BehaviorSubject<T[]> = new BehaviorSubject([]);
    observableArray.subscribe(subject);
    return subject;
  }


  static _instantiateObject(obj: {}, type: any) {
    return NgFirebase.appRef.injector.resolveAndCreateChild(
      [provide(FirebaseData, {useValue: obj})]
    ).resolveAndInstantiate(type);
  }
}
