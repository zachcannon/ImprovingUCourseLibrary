declare class Engine {
    static listen(port: number): any;
    static attach(http: any): any;
    on(event: string, handler: any): any;
}

export = Engine;
