import * as http from 'http';

export const logIn = async (firstName: string, lastName: string, password: string) => {
    const postData = JSON.stringify({
        firstName,
        lastName,
        password,
    });

    const options = {
        host: '0.0.0.0',
        port: '3000',
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let headers: string[] = [];
    const processRequest = () => {
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res: any) => {
                res.on('data', () => {
                    if (res.headers['set-cookie'] !== undefined) {
                        const cookie: string = res.headers['set-cookie'][0];
                        const fullToken: string = cookie.split(';')[0];
                        const justJWT: string = fullToken.split('=')[1];
                        headers.push(justJWT);
                    } else {
                        reject('NO COOKIE');
                    }
                });
                res.on('end', () => {
                    resolve(headers);
                });
            });
            req.on('error', (e) => reject(e.message));
            req.write(postData);
            req.end();
        });
    };
    return await processRequest();
};