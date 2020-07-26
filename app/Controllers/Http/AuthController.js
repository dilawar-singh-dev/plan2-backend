
//../app/Controllers/Http/AuthController.js

'use strict'
const User = use('App/Models/User');
const Hash = use('Hash');

class AuthController {

  async login({request, auth, response}) {

    try {
      var email = request.input('email');
      var password = request.input('password');

      var user = await User.findByOrFail({
        'email': email
      });

      var userPassword = user.password;

      var passwordVerify = await Hash.verify(password,userPassword)

      if(!passwordVerify){
        return response.status(406).json({statusCode:406,statusMessage:'error',message: "Incorrect Password!"});
      }

      let token = await auth.generate(user)

      Object.assign(user, token)

      user.statusCode = 200;
      user.message = 'success';

      return response.json(user);

    } catch (e) {
      return response.status(406).json({statusCode:406,statusMessage:'error',message: 'Email not found!',excepton: e})
    }
    
  }
  async register({request, auth, response}) {

    try {
     
      var name = request.input('name');
      var email = request.input('email');
      var password = request.input('password');

      var user = await User.create(
        {
          'name': name,
          'email': email,
          'password': password,
        });

      let token = await auth.generate(user)

      Object.assign(user, token)

      user.statusCode = 200;
      user.message = 'success';

      return response.json(user);

    } catch (e) {
      return response.status(406).json({statusCode:406,statusMessage:'error',message: 'Email already exists!',excepton: e})
    }
    
  }




}

module.exports = AuthController