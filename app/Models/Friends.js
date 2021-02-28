'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Friends extends Model {

    static get table () {
        return 'friends'
    }
    static get primaryKey () {
        return 'id'
    }

    friend () {   
        return this.hasOne('App/Models/User','friend_id','id')
    }

}

module.exports = Friends

