import Interface = require('./interface');
import Step = Interface.Step;
declare function buildPipeline(startHash: number, steps: Array<Step>): Object[];
export = buildPipeline;
