import {Observable} from 'rxjs/Observable';

import 'firebase/lib/firebase-web';

export function observableFirebaseObject<T>(ref: FirebaseQuery, keyName?: string): Observable<T> {
  return Observable.create(function(observer: any) {
    const keyFieldName = keyName ? keyName : "$$fbKey";

    function value(snapshot: FirebaseDataSnapshot) {
      let child = snapshot.val();
      child[keyFieldName] = snapshot.key();
      observer.next(child);
    }
    ref.on('value', value);
    return function() {
      ref.off('value', value);
    };
  });
}

export function observableFirebaseArray<T>(ref: FirebaseQuery, keyName?: string): Observable<T[]> {

  return Observable.create(function(observer: any) {
    // Looking for how to type this well.
    let arr: any[] = [];
    const keyFieldName = keyName ? keyName : "$$fbKey";
    let lastIdInSnapshot = null;

    function child_added(snapshot: FirebaseDataSnapshot, prevChildKey: string) {
      let child = snapshot.val();
      child[keyFieldName] = snapshot.key();
      let prevEntry = arr.find((y) => y[keyFieldName] === prevChildKey);
      arr.splice(prevChildKey ? arr.indexOf(prevEntry) + 1 : 0, 0, child);
      observer.next(arr.slice()); // Safe copy
    }

    function child_changed(snapshot: FirebaseDataSnapshot) {
      let key = snapshot.key();
      let child = snapshot.val();
      child[keyFieldName] = key;
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
      if (x) {
        arr.splice(arr.indexOf(x), 1);
      }
      // Add in new slot
      let prevEntry = arr.find((y) => y[keyFieldName] === prevChildKey);
      if (prevEntry) {
        arr.splice(arr.indexOf(prevEntry) + 1, 0, child);
      } else {
        arr.splice(0, 0, child);
      }
      observer.next(arr.slice()); // Safe copy
    }

    // Start out with entire array
    ref.once('value', (snapshot) => {
      let array = snapshot.val();
      let a = [];
      let keys = Object.keys(array);
      for (let key of keys) {
        array[key][keyFieldName] = key;
        a.push(array[key]);
      }
      observer.next(a);
      lastIdInSnapshot = keys[keys.length-1];

      ref.limitToLast(1).on('child_added', (snap, prev) => {
        if (snap.key() !== lastIdInSnapshot) {
          child_added(snap, prev);
        }
      });
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
}
