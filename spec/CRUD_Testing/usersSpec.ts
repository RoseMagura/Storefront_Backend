import 'jasmine';
import * as bcrypt from 'bcrypt';
import { testQuery } from '../../src/db/index';
import { SQL } from '../../src/interfaces/SQL';
import { MockUserModel } from './Mock_Models/MockUserModel';
import { User } from '../../src/interfaces/User';

const mockUserModel = new MockUserModel();

beforeAll(async () => {
    const users = await testQuery('SELECT * FROM USERS;');
    if (users.rowCount === 0) {
        await bcrypt
            .hash('C', 10)
            .then(
                async (passwordOne: string) =>
                    await testQuery(
                        `INSERT INTO USERS(FIRST_NAME, LAST_NAME, PASSWORD) VALUES('A', 'B', '${passwordOne}');`
                    )
            );
        await bcrypt
            .hash('F', 10)
            .then(
                async (passwordTwo: string) =>
                    await testQuery(
                        `INSERT INTO USERS(FIRST_NAME, LAST_NAME, PASSWORD) VALUES('D', 'E', '${passwordTwo}');`
                    )
            );
    }
    await testQuery(`DELETE FROM USERS WHERE FIRST_NAME='X';`);
});

describe('Get all users test', () => {
    it('checks that select all works', async () => {
        const dbRes: any = await mockUserModel.getAll();
        expect(dbRes).not.toBeNull();
        dbRes.forEach((element: User) => {
            expect(element.user_id).toBeDefined();
            expect(element.first_name).toBeDefined();
            expect(typeof element.first_name).toBeInstanceOf(String);
            expect(element.last_name).toBeDefined();
            expect(typeof element.last_name).toBeInstanceOf(String);
            expect(element.password).toBeDefined();
            expect(typeof element.password).toBeInstanceOf(String);
        });
    });
});

describe('Get one user test', () => {
    it('checks that selecting by id works', async () => {
        const all = await mockUserModel.getAll();
        const id = all[0].user_id;
        const user = await mockUserModel.getById(id);
        const passwordAuth: boolean = await bcrypt.compare(
            all[0].password,
            user.rows[0].password
        );
        expect(user.rows[0].first_name).toBe(all[0].first_name);
        expect(user.rows[0].last_name).toBe(all[0].last_name);
        expect(passwordAuth).toBeTrue;
    });
});

describe('Post a user test', () => {
    it('checks that a user can be created', async () => {
        const res: SQL = await mockUserModel.create('X', 'Y', 'Z');
        expect(res.command).toBe('INSERT');
        expect(res.rowCount).toBe(1);
        const newUserData: SQL = await mockUserModel.getByName('X', 'Y');
        const newUser: any = newUserData.rows !== undefined && newUserData.rows[0];
        const passwordCheck = await bcrypt.compare('Z', newUser.password);
        expect(newUser.first_name).toBe('X');
        expect(newUser.last_name).toBe('Y');
        expect(passwordCheck).toBeTrue;
    });
});
