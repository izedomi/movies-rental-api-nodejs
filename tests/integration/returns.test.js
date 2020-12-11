const moment = require('moment');
const mongoose = require('mongoose')
const request = require('supertest');
const { Movie } = require('../../models/movie');
const {Rental} = require('../../models/rental_model');
const {User} = require('../../models/user');



describe('/api/returns', () => {

    let server;
    let rental;
    let customerId;
    let movieId;
    let token;
    let movie;
       
    beforeEach( async () => {
        server = require('../../index');

        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()
        token = new User().generateAuthToken()

        movie = Movie({
            _id: movieId,
            title: 'movie1',
            genre: {title: 'movie1'},
            numberInStock: 10,
            dailyRentalRate: 2
        })
        await movie.save()

        rental = new Rental({
            movie: {
                _id: movieId,
                title: 'movie1',
                dailyRentalRate: 2
            },
            customer: {
                _id: customerId,
                name: 'customer1',
                isGold: false,
                phone: '123456'
            }
        })
    
        await rental.save();
        //await exec()
    })

    afterEach( async() => {
        await Rental.remove({})
        await Movie.remove({})
        await server.close();
    })
    
    const exec = () => {
       
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({'customerId': customerId, 'movieId': movieId})
        
    }

    it('should return 401 if client is not logged in', async() => {

        token = '';
        const res = await exec()
        expect(res.status).toBe(401)

    });

   
    it('should return 400 if movie id is not provided', async() => {
        
        movieId = '';
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 400 if customer id is not provided', async() => {
        
        customerId = '';
        const res = await exec()
        expect(res.status).toBe(400)
    })

    
    it('should return 404 if no rental is found for customer/movie Id combination', async() => {
        
        //await Rental.remove({})
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()
   
        const res = await exec()
        expect(res.status).toBe(404)

    })
    
    it('should return 400 if rental is already processed', async() => {
        
        rental.dateReturned = new Date()
        rental.save()

        const res = await exec()
        expect(res.status).toBe(400)

    })

   
    it('should calculated the rental fee for days rented', async () => {

        rental.dateCollected = moment().add(-7, 'days').toDate();
        await rental.save()
        
        const res = await exec();

        const rentalDB = await Rental.findById(rental._id)
        expect(rentalDB.rentalFee).toBe(14)
        
        
    })


    it('should increase the movie count', async () => {

        const res = await exec();
        const movieInDB = await Movie.findById(movieId);

        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1)
    })


    it('should return rental for valid input', async () => {
        
        const res = await exec();
        
        expect(res.status).toBe(200)
        expect(Object.keys(res.body))
        .toEqual(
            expect.arrayContaining(
                ['dateCollected', 'dateReturned', 'rentalFee', 'customer', 'movie']
            )
        )
    })

    
})
