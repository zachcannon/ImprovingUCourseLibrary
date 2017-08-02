import JinagaJS = require("jinaga/jinaga");
import JinagaDistributorJS = require("jinaga/jinaga.distributor.client");

declare global {
    const Jinaga: typeof JinagaJS;
    const JinagaDistributor: typeof JinagaDistributorJS;
    const distributorUrl: string;
}

export {};