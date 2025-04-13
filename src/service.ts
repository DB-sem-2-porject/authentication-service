
import * as Hapi from "@hapi/hapi";
import pg from 'pg';
import { QueryResult } from "pg";
const { Pool } = pg;



export interface AuthServiceOptions {
    port: number;
    host?: string;
}
export interface DatabaseOptions {
    user: string;
    host?: string;
    database: string;
    password: string;
    port: number;
}

export class AuthService {
    private port: number;
    private host: string;
    private server: Hapi.Server;
    private pool: pg.Pool;


    constructor(serviceOptions: AuthServiceOptions, databaseOptions: DatabaseOptions) {
        this.port = serviceOptions.port;
        this.host = serviceOptions.host || 'localhost';

        this.server = Hapi.server({
            port: serviceOptions.port,
            host: serviceOptions.host || 'localhost',
        });

        this.pool = new Pool({
            host: databaseOptions.host || 'localhost',
            port: databaseOptions.port,
            database: databaseOptions.database,
            user: databaseOptions.user,
            password: databaseOptions.password,
        });

        this.server.route({
            method: 'GET',
            path: '/auth',
            handler: this.authentficationHandler.bind(this)
        });
    }


    private async authentficationHandler(request: Hapi.Request, responseToolkit: Hapi.ResponseToolkit) {
        const { query } = request.query;
        // const token = request.headers.authorization;
        try {
            const result: QueryResult = await this.pool.query(query);
            return responseToolkit.response(result.rows).code(200); // Отправка данных в JSON
        } catch (error) {
            console.error('Query failed with error: ', error);
            return responseToolkit.response({ error: 'Query failed' }).code(500); // Ошибка запроса
        }
    }


    public start(): void {

        try {
            this.server.start().then(r => {
            });
            process.on('SIGINT', async () => {
                console.log('\nStopping server...');
                await this.server.stop();
                process.exit(0);
            });
            console.log(`Server running at: ${this.server.info.uri}`);
        } catch (err) {
            console.error('Failed to start server:', err);
            process.exit(1);
        }
    }


}