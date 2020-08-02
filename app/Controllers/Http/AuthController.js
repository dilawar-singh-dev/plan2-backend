
//../app/Controllers/Http/AuthController.js

'use strict'
const User = use('App/Models/User');
const Hash = use('Hash');

class AuthController {


  async redirectToProvider ({ally, params}) {
    await ally.driver('google').redirect()
  }

  async handleProviderCallback ({params, ally, auth, response}) {
    const provider = 'google';
    try {
        const userData = await ally.driver(provider).getUser()

        const authUser = await User.query().where({
            'provider': provider,
            'provider_id': userData.getId()
        }).first()
        if (!(authUser === null)) {
            await auth.loginViaId(authUser.id)
            return response.redirect('/')
        }

        const user = new User()
        user.name = userData.getName()
        user.username = userData.getNickname()
        user.email = userData.getEmail()
        user.provider_id = userData.getId()
        user.avatar = userData.getAvatar()
        user.provider = provider

        await user.save()

        await auth.loginViaId(user.id)

        return response.redirect('/')
        } 
        catch (e) {
            console.log(e)
            response.redirect('/auth/' + provider)
        }
    }

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