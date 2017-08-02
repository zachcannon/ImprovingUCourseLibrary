export declare enum Direction {
    Predecessor = 0,
    Successor = 1,
}
export declare enum Quantifier {
    Exists = 0,
    NotExists = 1,
}
export declare class Step {
    construtor(): void;
    toDeclarativeString(): string;
}
export declare class ExistentialCondition extends Step {
    quantifier: Quantifier;
    steps: Array<Step>;
    constructor(quantifier: Quantifier, steps: Array<Step>);
    toDeclarativeString(): string;
}
export declare class PropertyCondition extends Step {
    name: string;
    value: any;
    constructor(name: string, value: any);
    toDeclarativeString(): string;
}
export declare class Join extends Step {
    direction: Direction;
    role: string;
    constructor(direction: Direction, role: string);
    toDeclarativeString(): string;
}
export declare class Query {
    steps: Array<Step>;
    constructor(steps: Array<Step>);
    concat(other: Query): Query;
    toDescriptiveString(): string;
}
export declare class ConditionalSpecification {
    specification: Object;
    conditions: Array<(target: Proxy) => Object>;
    isAny: boolean;
    constructor(specification: Object, conditions: Array<(target: Proxy) => Object>, isAny: boolean);
}
export declare class InverseSpecification {
    specification: Object;
    constructor(specification: Object);
}
export declare function fromDescriptiveString(descriptive: string): Query;
export declare function isPredecessor(value: any): boolean;
export declare function computeHash(fact: Object): number;
export interface UserIdentity {
    provider: string;
    id: string;
    profile: Object;
}
export interface Coordinator {
    onSaved(fact: Object, source: any): any;
    send(fact: Object, source: any): any;
    onReceived(fact: Object, userFact: Object, source: any): any;
    onDelivered(token: number, destination: any): any;
    onDone(token: number): any;
    onProgress(queueCount: number): any;
    onError(err: string): any;
    onLoggedIn(userFact: Object, profile: Object): any;
    resendMessages(): any;
}
export interface StorageProvider {
    init(coordinator: Coordinator): any;
    save(fact: Object, source: any): any;
    executeQuery(start: Object, query: Query, readerFact: Object, result: (error: string, facts: Array<Object>) => void): any;
    sendAllFacts(): any;
    push(fact: Object): any;
    dequeue(token: number, destination: any): any;
}
export interface PersistenceProvider {
    init(coordinator: Coordinator): any;
    save(fact: Object, source: any): any;
    executePartialQuery(start: Object, query: Query, result: (error: string, facts: Array<Object>) => void): any;
}
export interface KeystoreProvider {
    getUserFact(userIdentity: UserIdentity, done: (userFact: Object) => void): any;
}
export interface NetworkProvider {
    init(coordinator: Coordinator): any;
    watch(start: Object, query: Query, token: number): any;
    stopWatch(start: Object, query: Query): any;
    query(start: Object, query: Query, token: number): any;
    fact(fact: Object): any;
}
export interface Spoke {
    distribute(fact: Object): any;
}
export interface Proxy {
    has(name: string): Proxy;
}
