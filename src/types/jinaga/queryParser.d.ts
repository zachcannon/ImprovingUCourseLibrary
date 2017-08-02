import Interface = require("./interface");
import Query = Interface.Query;
import Proxy = Interface.Proxy;
declare function parse(templates: Array<(target: Proxy) => Object>): Query;
export = parse;
