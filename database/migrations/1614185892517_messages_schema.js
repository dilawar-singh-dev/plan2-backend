'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessagesSchema extends Schema {
  up () {
    this.create('messages', (table) => {
      table.increments()
      table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('receiver_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('message', 500).nullable()
      table.string('status', 255).nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('messages')
  }
}

module.exports = MessagesSchema
