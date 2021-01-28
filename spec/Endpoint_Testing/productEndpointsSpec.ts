import * as http from 'http';
import { baseUrl } from './serverSpec';

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

describe("A product test suite", function() {
    it("checks getting all products", function() {
      http.get('http://localhost:3000/products/', (res: any) => {
        console.log('running this test');

          console.log(res);
          expect(res.statusCode).toBe(200);
          res.setEncoding('utf8');
          res.on('data', (chunk: string) => console.log(chunk));
          res.on('error', (e: unknown) => fail(e));
          res.on('end', () => {
              console.log(res);
          });
      });

    // http.get('http://nodejs.org/dist/index.json', (res) => {
    //     const { statusCode } = res;
    //     const contentType = res.headers['content-type'];
      
    //     let error;
    //     // Any 2xx status code signals a successful response but
    //     // here we're only checking for 200.
    //     // if (statusCode !== 200) {
    //     //   error = new Error('Request Failed.\n' +
    //     //                     `Status Code: ${statusCode}`);
    //     // } else if (!/^application\/json/.test(contentType)) {
    //     //   error = new Error('Invalid content-type.\n' +
    //     //                     `Expected application/json but received ${contentType}`);
    //     // }
    //     if (error) {
    //       console.error(error);
    //       // Consume response data to free up memory
    //       res.resume();
    //       return;
    //     }
      
    //     res.setEncoding('utf8');
    //     let rawData = '';
    //     res.on('data', (chunk) => { rawData += chunk; });
    //     res.on('end', () => {
    //       try {
    //         const parsedData = JSON.parse(rawData);
    //         console.log(parsedData);
    //       } catch (e) {
    //         console.error(e);
    //       }
    //     });
    //   }).on('error', (e) => {
    //     console.error(`Got error: ${e}`);
    //   });

    });
  });
  
  