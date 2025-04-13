import {AuthService, NUMBER} from './service.ts';
import {readFileSync} from 'node:fs';

function main (): void {

    let serviceConfigFileContent = readFileSync('./configs/service-config.json', 'utf8');
    let dataBaseFileContent = readFileSync('./configs/database-config.json', 'utf8');
    // let serviceConfigFileContent = readFileSync('C:\\All_Random\\git\\DB-project\\db-querry-service\\configs\\service-config.json', 'utf8');
    // let dataBaseFileContent = readFileSync('C:\\All_Random\\git\\DB-project\\db-querry-service\\configs\\database-config.json', 'utf8');

    let serviceConfig = JSON.parse(serviceConfigFileContent);
    let dataBaseConfig = JSON.parse(dataBaseFileContent)
    let service: AuthService = new AuthService({
            port: serviceConfig.port,
            host: serviceConfig.host,
        },
        {
            host: dataBaseConfig.host,
            port: dataBaseConfig.port,
            database: dataBaseConfig.database,
            user: dataBaseConfig.user,
            password: dataBaseConfig.password,
        });

    service.start();

    // console.log(NUMBER);
    // console.log(serviceConfig);
    // console.log(dataBaseConfig);



}


main()