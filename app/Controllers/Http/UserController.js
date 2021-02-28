
'use strict'
const User = use('App/Models/User');
const Friends = use('App/Models/Friends');


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
          params,
          response
        }) {
          try {
    
            var user = await User.query()
            .with("friends", builder => { builder.where("friend_id", auth.user.id)})
            .where('name','ilike','%'+params.keyword+'%')
            .andWhere('id','!=',auth.user.id)
            .orderBy('name', 'desc')
            .fetch();
          
            var data = {
              'statusCode': 200,
              'message': 'successddd'
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


        async addFriend({
          request,
          auth,
          params,
          response
        }) {
          try {
    
            var user = await User.query().where('id', auth.user.id).first();
            var friend_id = params.id;

            const friend = await Friends.findOrCreate(
              { user_id: auth.user.id, friend_id: friend_id}
            )

            const friend_reverse = await Friends.findOrCreate(
              { user_id: friend_id, friend_id: auth.user.id}
            )
          
            var data = {
              'statusCode': 200,
              'message': 'success'
            };
            var object = Object.assign(data, friend);

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

        async friendsList({
          request,
          auth,
          response
        }) {
          try {
    
            var friends = await Friends.query().with('friend').where('user_id', auth.user.id).fetch();
          
            var data = {
              'statusCode': 200,
              'message': 'success'
            };
            var object = Object.assign(data, friends);

            return response.json(object)
      
          } catch (e) {
            return response.json({
              statusCode: 409,
              statusMessage: 'error',
              message: 'Data not valid!',
              excepton: e
            })
          }
        }


        async removeFriend({auth, params, response}) {

          try {
              const { id } = params
  
              const friend = await Friends.query().where('user_id',auth.user.id).andWhere('friend_id',id).first();
              
              await friend.delete()

              const friend_reverse = await Friends.query().where('friend_id',auth.user.id).andWhere('user_id',id).first();
              await friend_reverse.delete()
              
  
              return response.json({statusCode:200,statusMessage:'success',message: 'Friend has been removed.'});
              
          } catch (e) {
              return response.json({statusCode:409,statusMessage:'error',message: 'Friend not valid!',excepton: e});
          }
      }
        


        

}

module.exports = UserController