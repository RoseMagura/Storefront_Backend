import 'jasmine';
import { testQuery } from '../src/db/index';
import { ProductModel } from '../src/models/ProductModel';

const data = [
    { product_id: 18, name: 'green gourd', price: 35 },
    { product_id: 19, name: 'purple gourd', price: 35 },
];

// Before All, delete and then insert values
beforeAll(async () => {
    await testQuery('DELETE FROM PRODUCTS;')
    for(let i=0; i<data.length; i++){
        await testQuery(`INSERT INTO PRODUCTS(NAME, PRICE) VALUES('${data[i].name}', ${data[i].price});`);
    }
})

//TODO: Mocking and adjust product ids or don't compare
describe('Get all products test', () => {
    it('checks that select all works', async () => {
        // const dbRes = await testQuery('SELECT * FROM PRODUCTS');
        const productModel = new ProductModel();
        const dbRes: any = await productModel.getAll();
        const products = JSON.stringify(data);
        expect(dbRes.length).toBe(2);
        expect(dbRes).not.toBeNull();
        console.log(dbRes[0].name);
        // expect(JSON.stringify(dbRes) === products);
        // expect(dbRes.)
    });
});

// describe('Get one product test', () => {

// });