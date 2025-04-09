// sign-in.ts:

import { Pool, QueryResult} from 'pg';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase-config"; // Импортируйте auth из файла с конфигом
import { NotAllowedEmailError } from './NotAllowedEmailError'

const provider = new GoogleAuthProvider();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sem-2-project-db',
    password: '3255',
    port: 5432,
});

async function isEmailAllowed(email: string): Promise<boolean> {
    try {
        const query =
            'SELECT EXISTS(' +
            '   SELECT 1 ' +
            '   FROM users ' +
            '   WHERE mail = $1' +
            ')';
        const result = await pool.query(query, [email]);
        return result.rows[0].exists;
    } catch (error) {
        console.error('Error checking email in database:', error);
        throw error;
    }
}

signInWithPopup(auth, provider)
    .then(async (result) => {
        const user = result.user;
        if (!user.email) {
            throw new Error("User has no email");
        }

        const allowed = await isEmailAllowed(user.email);

        if (!allowed) {
            throw new NotAllowedEmailError('Email is not allowed');
        }

        console.log('User signed in: ', user);
    })
    .catch((error) => {
        console.error('Error during sign in: ', error);
    });






/*
import pkg from 'pg'; // Импортировать весь пакет как объект
const { Pool } = pkg; // Деструктурируем Pool из объекта
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sem-2-project-db',
    password: '3255',
    port: 5432,
});

const query =
    'SELECT EXISTS(' +
    '   SELECT 1 ' +
    '   FROM users ' +
    '   WHERE mail = $1' +
    ')';

const query2 = 'insert into users (mail, password_hash) values (\'qwe\', \'asd\');';
try {
    await pool.query(query2);
    const result = await pool.query(query, ['qwe']);
    console.log(result.rows[0].exists); // Здесь result.rows доступен, так как мы ждем результат
} catch (error) {
    console.error('Error executing query', error);
}
*/