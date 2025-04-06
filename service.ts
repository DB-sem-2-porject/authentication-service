import Hapi, {server} from '@hapi/hapi';

export class AuthService {
    private server: Hapi.Server;

    constructor(private readonly port: number) {
        this.server = Hapi.server({
            port: port,
            host: 'localhost',
        });
    }

    public async start(): Promise<void> {




        await this.server.start();

    }
}