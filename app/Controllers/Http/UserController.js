
'use strict'
const User = use('App/Models/User');

class UserController {

    async profile({
        request,
        auth,
        response
      }) {
    
        try {
    
          var user = await User.query().where('id', auth.user.id).first();
          user.statusCode = 200;
          user.message = 'success';
          return response.json(user)
    
        } catch (e) {
          return response.json({
            statusCode: 409,
            statusMessage: 'error',
            message: 'User not valid!',
            excepton: e
          })
        }
      }

      async usersSearch({
          request,
          auth,
          response
        }) {
          try {
    
            var user = await User.query().orderBy('name', 'desc').fetch();
          
            var data = {
              'statusCode': 200,
              'message': 'success'
            };
            var object = Object.assign(data, user);

            return response.json(object)
      
          } catch (e) {
            return response.json({
              statusCode: 409,
              statusMessage: 'error',
              message: 'User not valid!',
              excepton: e
            })
          }
        }

}

module.exports = UserController