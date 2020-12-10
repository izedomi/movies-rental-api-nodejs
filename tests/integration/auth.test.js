const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');


describe('Auth Middleware', () => {

    let token;
    let server;

   
    beforeEach(() => {
        server = require('../../index')
        token = new User().generateAuthToken()
    })

    afterEach( async() => {
       
        await Genre.remove({})
        await server.close();
    })

    const exec = () => {
        return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({'title': 'genre1'})
    }

    it('should return 401 if no token is provided', async() => {
        
        token = '';

        const res = await exec()

        expect(res.status).toBe(401);
    })

    it('should return 400 when invalid token is provided', async() => {

        token = 'a';

        const res = await exec()

        expect(res.status).toBe(400);

    });

    it('should return 200 for valid token', async() => {

        const res = await exec();

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("title", "genre1")

    });

});