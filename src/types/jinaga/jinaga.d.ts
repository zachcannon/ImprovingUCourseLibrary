import Interface = require("./interface");
import StorageProvider = Interface.StorageProvider;
import NetworkProvider = Interface.NetworkProvider;
import Proxy = Interface.Proxy;
declare class Jinaga {
    private coordinator;
    constructor();
    onError(handler: (message: string) => void): void;
    onLoading(handler: (loading: boolean) => void): void;
    onProgress(handler: (queueCount: number) => void): void;
    save(storage: StorageProvider): void;
    sync(network: NetworkProvider): void;
    fact(message: Object): Object;
    watch(start: Object, templates: Array<(target: Proxy) => Object>, resultAdded: (result: Object) => void, resultRemoved: (result: Object) => void): any;
    subscribe(start: Object, templates: Array<(target: Proxy) => Object>): any;
    query(start: Object, templates: Array<(target: Proxy) => Object>, done: (result: Array<Object>) => void): void;
    login(callback: (userFact: Object) => void): void;
    preload(cachedFacts: Array<any>): void;
    where(specification: Object, conditions: Array<(target: Proxy) => Object>): Interface.ConditionalSpecification;
    not(condition: (target: Proxy) => Object): (target: Proxy) => Object;
    not(specification: Object): Object;
}
export = Jinaga;
