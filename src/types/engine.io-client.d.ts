export declare class Socket {
    constructor(endpoint: string);
    send(message: Object): void;
    on(event: string, handler: any): void;
}
