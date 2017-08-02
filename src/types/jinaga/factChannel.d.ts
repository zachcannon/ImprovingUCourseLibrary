declare class FactChannel {
    private output;
    private onFactReceived;
    private nextId;
    private nodes;
    constructor(nextId: number, output: (fact: Object) => void, onFactReceived: (fact: Object) => void);
    sendFact(fact: Object): any;
    messageReceived(message: any): void;
    private findExistingFact(hash, fact);
    private sendNewFact(hash, fact);
    private addNewFact(hash, id, fact);
    private parseMessageValue(value);
    private lookupFact(hash, id);
}
export = FactChannel;
