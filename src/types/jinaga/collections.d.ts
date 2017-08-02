export interface Action<T> {
    (item: T): void;
}
export interface Func<T, TResult> {
    (item: T): TResult;
}
export declare function _pairs(obj: Object): any[];
export declare function _some(items: Array<any>, check: Func<any, boolean>): any;
export declare function _isEqual(o1: any, o2: any): any;
