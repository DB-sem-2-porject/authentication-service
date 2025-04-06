import { readFileSync } from 'fs';
import { AuthService } from "./service";

function main(): void {
    const file_content = readFileSync('./config.json');
    const config = JSON.parse(file_content.toString());
    let authService: AuthService = new AuthService(config.port);
}