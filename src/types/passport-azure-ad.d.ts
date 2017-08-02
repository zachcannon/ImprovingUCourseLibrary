import * as Passport from 'passport';
import * as Express from 'express';

export class WsfedStrategy implements Passport.Strategy {
    constructor(options: {
            realm: string,
            logoutUrl: string,
            identityProviderUrl: string,
            identityMetadata: string
        }, login: (profile: any, done: (error: any, result: any) => void) => void);

    name?: string;
    authenticate(req: Express.Request, options?: any): void;
}
