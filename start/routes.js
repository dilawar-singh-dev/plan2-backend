'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.on('/').render('welcome');

Route.post('/login', 'AuthController.login');
Route.post('/register', 'AuthController.register');

// USER 
Route.get('/user', 'UserController.profile').middleware('auth');

// SEARCH 
Route.get('/users/search', 'UserController.usersSearch').middleware('auth');


// GOOGLE 
Route.get('/auth/:provider', 'AuthController.redirectToProvider').as('social.login')
Route.get('/authenticated/:provider', 'AuthController.handleProviderCallback').as('social.login.callback')

// CATEGORY
Route.get('/category/show', 'CategoryController.show').middleware('auth');
Route.post('/category/store', 'CategoryController.store').middleware('auth');
Route.put('/category/update/:id', 'CategoryController.update').middleware('auth');
Route.delete('/category/delete/:id', 'CategoryController.delete').middleware('auth');

// TASK 
Route.post('/task/store', 'TaskController.store').middleware('auth');
Route.get('/task/show', 'TaskController.show').middleware('auth');
Route.put('/task/update/:id', 'TaskController.update').middleware('auth');
Route.delete('/task/delete/:id', 'TaskController.delete').middleware('auth');
Route.post('/task/date', 'TaskController.dateWise').middleware('auth');

Route.put('/posts/:id', 'PostController.update').middleware('auth');
Route.delete('posts/id', 'PostController.delete').middleware('auth');
Route.post('/posts', 'PostController.store').middleware('auth');
Route.get('/posts', 'PostController.getPosts');