# movies-rental-api-nodejs
Clean and scalable movie rental API design with Node Js, Express and MongoDB

# Features
Authorization, Authentication, Integration TEST using JEST, Transactions


# End points

GENRES APIs => 'api/genres'

	get('/') => get all genre
	
	get('/:id') => fetch single genre
	
	post('/') => Add new genre
	
	put('/:id') => Update a genre

	delete('/:id') => Update a genre

CUSTOMERS APIs => '/api/customers'
  
	get('/') => fetch customers

	get('/:id') => fetch single customer

	post('/') => Add new customer

	put('/:id') => Update a update a customer

	delete('/:id') => Delete a customer
	

MOVIES APIs => 'api/movies'

	get('/') => fetch all movies
	
	post('/') => Add new movies
	
	put('/:id') => Update a update a movie
	
	delete('/:id') => Delete a movie

RENTALS APIs => 'api/rentals'
	
	
	get('/') => get list of all rentals
	
	post('/') => Add a rental
	

USERS APIs => 'api/users'
	
	post('/') => Register new user

	get('/me') => get logged in user
	
	
AUTH APIs => 'api/auth'

	post('/') => User log in

RETURNS API => 'api/returns'
	
	post('/) => Process returned movie
