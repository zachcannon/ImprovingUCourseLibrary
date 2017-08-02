import Interface = require('./interface');
import Step = Interface.Step;
export declare class Point {
    fact: Object;
    hash: number;
    constructor(fact: Object, hash: number);
}
export declare type Processor = (start: Point, result: (error: string, facts: Array<Point>) => void) => void;
export declare function pipelineProcessor(collection: any, steps: Step[]): Processor;
