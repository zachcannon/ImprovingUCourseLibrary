import Interface = require("./interface");
import NetworkProvider = Interface.NetworkProvider;
import Coordinator = Interface.Coordinator;
import Query = Interface.Query;
import JinagaDistributor = require("./jinaga.distributor.server");
declare class JinagaConnector implements NetworkProvider {
    private distributor;
    private spoke;
    private coordinator;
    private watches;
    constructor(distributor: JinagaDistributor);
    init(coordinator: Coordinator): void;
    watch(start: Object, query: Query): void;
    stopWatch(start: Object, query: Query): void;
    query(start: Object, query: Query, token: number): void;
    fact(fact: Object): void;
    distribute(fact: Object): void;
}
export = JinagaConnector;
