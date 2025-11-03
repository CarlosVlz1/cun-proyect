export declare const configuration: () => {
    nodeEnv: string;
    port: number;
    database: {
        uri: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    frontend: {
        url: string;
    };
    throttle: {
        ttl: number;
        limit: number;
    };
};
