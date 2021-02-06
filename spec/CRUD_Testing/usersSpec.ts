import 'jasmine';
import * as bcrypt from 'bcrypt';
import { testQuery } from '../../src/db/index';
import { SQL } from '../../src/interfaces/SQL';
import { MockUserModel } from './Mock_Models/MockUserModel';
import { User } from '../../src/interfaces/User';

const mockUserModel = new MockUserModel();

// Any is necessary here to allow the function
// to process a wide variety of potential values
const isSQL = (sql: any): sql is SQL => {
    return 'rows' in sql && 'rowCount' in sql;
};

const getSQL = async (id: number): Promise<SQL | null> => {
    const dbRes = await mockUserModel.getById(id);
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

const getAllSQL = async (): Promise<SQL | null> => {
    const dbRes = await mockUserModel.getAll();
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

const postThenGetSQL = async (firstName: string, lastName: string, password: string): Promise<SQL | null> => {
    const postRes = await mockUserModel.create(firstName, lastName, password);
    if (postRes && isSQL(postRes)) {
        return postRes;
    }
    return null;
}

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
        const dbRes: any = await getAllSQL();
        expect(dbRes).not.toBeNull();
        if (dbRes === null || dbRes.rows === undefined) {
            fail('Error fetching from DB.');
        } else {
            dbRes.rows.forEach((element: User) => {
                expect(element.user_id).toBeDefined();
                expect(element.first_name).toBeDefined();
                expect(typeof element.first_name).toBeInstanceOf(String);
                expect(element.last_name).toBeDefined();
                expect(typeof element.last_name).toBeInstanceOf(String);
                expect(element.password).toBeDefined();
                expect(typeof element.password).toBeInstanceOf(String);
            });
        }
    });
});

describe('Get one user test', () => {
    it('checks that selecting by id works', async () => {
        const all = await getAllSQL();
        if (all === null || all.rows === undefined) {
            fail('Error fetching all users.');
        } else {
        const id = all.rows[0].user_id;
        const user = await getSQL(id);
        if (user === null || user.rows === undefined) {
            fail('Error fetching user by id.');
        } else {
        const passwordAuth: boolean = await bcrypt.compare(
            all.rows[0].password,
            user.rows[0].password
        );
        expect(user.rows[0].first_name).toBe(all.rows[0].first_name);
        expect(user.rows[0].last_name).toBe(all.rows[0].last_name);
        expect(passwordAuth).toBeTrue;
    }

        }
    });
});

describe('Post a user test', () => {
    it('checks that a user can be created', async () => {
        const res = await postThenGetSQL('X', 'Y', 'Z');
        if (res === null) {
            fail('Couldn\'t post');
        } else {
            expect(res.command).toBe('INSERT');
            expect(res.rowCount).toBe(1);
            const newUserData: SQL = await testQuery('SELECT * FROM USERS WHERE FIRST_NAME=\'X\';');
            const newUser: any =
                newUserData.rows !== undefined && newUserData.rows[0];
            const passwordCheck = await bcrypt.compare('Z', newUser.password);
            expect(newUser.first_name).toBe('X');
            expect(newUser.last_name).toBe('Y');
            expect(passwordCheck).toBeTrue;   
        }
    });
});
