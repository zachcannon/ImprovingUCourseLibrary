import Interface = require('./interface');
import Coordinator = Interface.Coordinator;
import Query = Interface.Query;
import UserIdentity = Interface.UserIdentity;
declare class MongoProvider implements Interface.PersistenceProvider, Interface.KeystoreProvider {
    url: string;
    private coordinator;
    private count;
    private pools;
    private quiet;
    constructor(url: string);
    init(coordinator: Coordinator): void;
    save(fact: Object, source: any): void;
    private getPredecessors(fact);
    executePartialQuery(start: Object, query: Query, result: (error: string, facts: Array<Object>) => void): void;
    getUserFact(userIdentity: UserIdentity, done: (userFact: Object) => void): void;
    whenQuiet(quiet: () => void): void;
    private withCollection(collectionName, action);
}
export = MongoProvider;
