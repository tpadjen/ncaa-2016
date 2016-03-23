import {FirebaseData} from './firebase-data';

interface FirebaseModel0<T> {
  new(
    obj: FirebaseData
  ): T;
}
interface FirebaseModel1<T> {
  new(
    obj: FirebaseData,
    b: any
  ): T;
}
interface FirebaseModel2<T> {
  new(
    obj: FirebaseData,
    b: any,
    c: any
  ): T;
}
interface FirebaseModel3<T> {
  new(
    obj: FirebaseData,
    b: any,
    c: any,
    d: any
  ): T;
}
interface FirebaseModel4<T> {
  new(
    obj: FirebaseData,
    b: any,
    c: any,
    d: any,
    e: any
  ): T;
}
interface FirebaseModel5<T> {
  new(
    obj: FirebaseData,
    b: any,
    c: any,
    d: any,
    e: any,
    f: any
  ): T;
}
interface FirebaseModel6<T> {
  new(
    obj: FirebaseData,
    b: any,
    c: any,
    d: any,
    e: any,
    f: any,
    g: any
  ): T;
}
interface FirebaseModel7<T> {
  new(
    obj: FirebaseData,
    b: any,
    c: any,
    d: any,
    e: any,
    f: any,
    g: any,
    h: any
  ): T;
}
export interface FirebaseModel8<T> {
  new(
    obj: FirebaseData,
    b: any,
    c: any,
    d: any,
    e: any,
    f: any,
    g: any,
    h: any,
    i: any
  ): T;
}
interface FirebaseModel9<T> {
  new(
    obj: FirebaseData,
    b: any,
    c: any,
    d: any,
    e: any,
    f: any,
    g: any,
    h: any,
    i: any,
    j: any
  ): T;
}

export type FirebaseModel<T> =  FirebaseModel0<T> |
                                FirebaseModel1<T> |
                                FirebaseModel2<T> |
                                FirebaseModel3<T> |
                                FirebaseModel4<T> |
                                FirebaseModel5<T> |
                                FirebaseModel6<T> |
                                FirebaseModel7<T> |
                                FirebaseModel8<T> |
                                FirebaseModel9<T>;
