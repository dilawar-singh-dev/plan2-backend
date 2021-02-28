//../app/Controllers/Http/MessagesController.js
'use strict'

const Messages = use('App/Models/Messages');

const User = use('App/Models/User');

class MessagesController {

  async users({request,auth, response}) {
      
    let users = await User.query()
    .whereHas("messages", builder => { builder.where("sender_id", auth.user.id).orWhere("receiver_id", auth.user.id)})
    .whereHas("sender")
    .orWhereHas("receiver")
    .andWhere('id','!=',auth.user.id)
    .fetch()

    return response.json(users)
  }

  async store({request, auth, response}) {

    try {

        var receiver_id = request.input('receiver_id');
        var message = request.input('message');

        const store_message = await Messages.create(
            { sender_id: auth.user.id, receiver_id: receiver_id,message: message }
        )

        store_message.statusCode = 200;
        store_message.message = 'success';
    
        return response.json(store_message);

    } catch (e) {
    return response.json({statusCode:409,statusMessage:'error',message: 'Message not valid!',excepton: e})
    }
}

async getMessages({request,auth,params, response}) {

    let messages = await Messages.query()
    .with("sender")
    .with("receiver")
    .where({'sender_id' : auth.user.id, 'receiver_id' : params.user_id})
    .orWhere({'receiver_id' : auth.user.id, 'sender_id' : params.user_id})
    .orderBy('id')
    .fetch();

    return response.json(messages)
    
  }

}

module.exports = MessagesController