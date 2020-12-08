
const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');

let server;

describe('/api/genre', () => {

    beforeEach(() => {server = require('../../index');})
    afterEach( async() => {
        server.close();
        await Genre.remove({})
    })

    describe('GET /', () => {

        it('should return all genres', async() => {

            await Genre.collection.insertMany([
                {'title': 'genre1'},
                {'title': 'genre2'}
            ])
            
            const res = await request(server).get('/api/genres')

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.title === 'genre1')).toBeTruthy()
            expect(res.body.some(g => g.title === 'genre2')).toBeTruthy()
        });

    });


    describe("GET /:id", () => {


        it('should return 404 if invalid id is passed', async  () => {
            
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404)
        });

        it('should return a genre if a valid id is passed', async  () => {
            
            const genre = new Genre({'title': 'genre1'});
            genre.save()

            const res = await request(server).get('/api/genres/'+ genre._id);

            expect(res.status).toBe(200)
            expect(res.body._id).toBe(genre._id.toHexString())
            expect(res.body).toHaveProperty('title', 'genre1');
        });

    });


    describe('POST /', () => {

        let token;
        let title;


        beforeEach(() => {
            title = 'genre1'
            token = new User().generateAuthToken()
        })

        const exec = async() => {
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({title});
        }


        it('should returns 401 if user is not logged in', async () => {
       
            token = ''; //token not available

            const res = await exec()

            expect(res.status).toBe(401)

        });

        it('should returns 401 if genre title is less than 3', async () => {

            title = '12';  //title less than 2 characters

            const res = await exec()

            expect(res.status).toBe(400)

        });

        it('should save and return the saved genre if is valid', async () => {

            const res = await exec()

            const genre = Genre.find({'title': 'genre1'})

            expect(genre).not.toBeNull()
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("title", 'genre1');
            

        });



        
    })
})