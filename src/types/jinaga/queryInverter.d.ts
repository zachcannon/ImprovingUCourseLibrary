import Interface = require("./interface");
import Query = Interface.Query;
export declare class Inverse {
    affected: Query;
    added: Query;
    removed: Query;
    constructor(affected: Query, added: Query, removed: Query);
}
export declare function invertQuery(query: Query): Array<Inverse>;
export declare function completeInvertQuery(query: Query): Query;
