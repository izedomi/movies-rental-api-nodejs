
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

    describe('PUT /', () => {

        let id;
        let token;
        let title = 'genre1';
        let newTitle = 'updateGenre1'
        


        beforeEach(() => {
            title = 'genre1'
            token = new User().generateAuthToken()
        })

        const execSave = async() => {
            return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({title});
        }

        const execUpdate = async() => {
            return request(server)
            .put('/api/genres/'+id)
            .set('x-auth-token', token)
            .send({title: newTitle});
        }

        it('should return status 200 when valid ID is passed', async () => {

            const saveRes = await execSave()
            id = saveRes.body._id;

            const updateRes = await execUpdate();

            expect(updateRes.status).toBe(200);
            expect(updateRes.body).toHaveProperty("_id");
            expect(updateRes.body).toHaveProperty("title", "updateGenre1")

        })


        it('should return 401 if user is not logged in', async() => {

            token = '';

            const saveRes = await execSave()
            id = saveRes.body._id;

            const updateRes = await execUpdate();

            expect(updateRes.status).toBe(401);
      
        })
       

        it('should return status 400 when invalid Id is passed', async() => {

            //const saveRes = await execSave()
            result  = new Genre({title: 'title'})
            id = result._id;

            const updateRes = await execUpdate();

            expect(updateRes.status).toBe(400);

        })

        it('should return 400 if genre title is less than 3 characters', async() => {

           // const saveRes = await execSave()

            result  = new Genre({title: 'title'})
            id = result._id;
            newTitle = '23'
            
            const updateRes = await execUpdate();

            expect(updateRes.status).toBe(400);

       })

    });


    describe("DELETE /id", () => {

        let id;
        let token;
        let title = 'genre1';
        let isAdmin = true;
        

        beforeEach(() => {
            title = 'genre1'
            token = new User({isAdmin: true}).generateAuthToken()
        })

        const execSave = async() => {
            return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({title});
        }

        const execDelete = async() => {
            return await request(server)
            .delete('/api/genres/'+id)
            .set('x-auth-token', token)
        }


        it('should return status 200 when valid ID is passed', async () => {

            const saveRes = await execSave()
            id = saveRes.body._id;

            const deleteRes = await execDelete();
   
            expect(deleteRes.status).toBe(200);
            expect(deleteRes.body).toHaveProperty("_id");
            expect(deleteRes.body).toHaveProperty("title", "genre1")

        })

        it('should return 401 if user is not logged in', async() => {

            token = '';

            const saveRes = await execSave()
            id = saveRes.body._id;

            const deleteRes = await execDelete();

            expect(deleteRes.status).toBe(401);
      
        })

        it('should return 403 if user is not an admin', async() => {

            token = new User().generateAuthToken() 

            const saveRes = await execSave()
            id = saveRes.body._id;

            const deleteRes = await execDelete();

            expect(deleteRes.status).toBe(403);
      
        })

        it('should return 404 if invalid id is passed', async  () => {

            const saveRes = await execSave()
            id = '1';

            const deleteRes = await execDelete();

            expect(deleteRes.status).toBe(500)
        });
       

    })
})