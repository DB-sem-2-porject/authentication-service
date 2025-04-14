
import jwt from 'jsonwebtoken'
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
interface AuthPayload {
    email: string;
    password: string;
}

export class AuthService {
    private port: number;
    private host: string;
    private server: Hapi.Server;
    private pool: pg.Pool;
    private secretPhrase: string = "secret";


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
            method: 'POST',
            path: '/login',
            handler: this.authenticationHandler.bind(this)
        });
    }

    private generateToken(payload: object): string {
        return jwt.sign(payload, this.secretPhrase, {
            expiresIn: '1d',
        });
    }


    private async login(data: AuthPayload): Promise<boolean> {
        const { email, password } = data;

        try {
            const result: QueryResult = await this.pool.query(
                'select password from users where email = $1',
                [email]
            );

            if (result.rowCount === 0) {
                return false;
            }

            const storedPassword = result.rows[0].password;

            // Тут можно добавить хеширование через bcrypt:
            // return await bcrypt.compare(password, storedPassword);

            return storedPassword === password; // временная проверка без хеширования
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }

    private async authenticationHandler(request: Hapi.Request, responseToolkit: Hapi.ResponseToolkit) {
        const data: AuthPayload = request.payload as AuthPayload;
        const isLogin: boolean = await this.login(data);

        if (!isLogin) {
            return responseToolkit
                .response({ error: 'Invalid email or password' })
                .code(401); // Unauthorized
        }
        console.log("login success");
        const token = this.generateToken(data);
        return responseToolkit
            .response({ token })
            .code(200); // OK
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