import { RequestHandler } from "express";

declare function chain(...args: RequestHandler[]): RequestHandler

export = chain;