declare class Pool<Connection> {
    private createConnection;
    private closeConnection;
    private connection;
    private actions;
    private running;
    constructor(createConnection: (done: (connection: Connection) => void) => void, closeConnection: (connection: Connection) => void);
    begin(action: (connection: Connection, done: () => void) => void): void;
    private callAction(action);
}
export default Pool;
