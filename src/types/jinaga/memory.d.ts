/// <reference path="jinaga.d.ts" />
import Interface = require("./interface");
import StorageProvider = Interface.StorageProvider;
import PersistenceProvider = Interface.PersistenceProvider;
import Query = Interface.Query;
import Coordinator = Interface.Coordinator;
declare class MemoryProvider implements StorageProvider, PersistenceProvider, Interface.KeystoreProvider {
    nodes: {
        [hash: number]: Array<any>;
    };
    publicKeys: {
        [id: string]: string;
    };
    queue: Array<{
        hash: number;
        fact: Object;
    }>;
    coordinator: Coordinator;
    init(coordinator: Coordinator): void;
    save(fact: Object, source: any): void;
    executeQuery(start: Object, query: Query, readerFact: Object, result: (error: string, facts: Array<Object>) => void): void;
    executePartialQuery(start: Object, query: Query, result: (error: string, facts: Array<Object>) => void): void;
    getUserFact(userIdentity: Interface.UserIdentity, done: (userFact: Object) => void): void;
    private queryNodes(startingNode, steps);
    sendAllFacts(): void;
    push(fact: Object): void;
    dequeue(token: number, destination: any): void;
    private findNodeWithFact(array, fact);
    private insertNode(fact, source);
    private findNode(fact);
}
export = MemoryProvider;
