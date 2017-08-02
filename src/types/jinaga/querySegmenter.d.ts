import Interface = require('./interface');
import Query = Interface.Query;
declare function splitSegments(query: Query): Query[];
export = splitSegments;
