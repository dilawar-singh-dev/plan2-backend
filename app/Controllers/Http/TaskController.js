'use strict'
const Task = use('App/Models/Task');

class TaskController {

  async show({
    request,
    auth,
    response
  }) {

    try {

      let {
        date
      } = request.all();

      // DATE PARSE 
      if (date) {
        var indiaTime = date.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata"
        });
      }

      var task = await Task.query().where('user_id', auth.user.id).with('category').orderBy('id', 'desc').fetch();

      if (date) {
        var task = await Task.query().where({'user_id':auth.user.id,'date': indiaTime}).with('category').orderBy('id', 'desc').fetch();
      }

      var data = {
        'statusCode': 200,
        'message': 'success'
      };
      var object = Object.assign(data, task);

      return response.json(object)

    } catch (e) {
      return response.json({
        statusCode: 409,
        statusMessage: 'error',
        message: 'Task not valid!',
        excepton: e
      })
    }
  }

  async dateWise({
    request,
    auth,
    response
  }) {
    try {

      // GET DATE 
      var date = request.input('date');

      if (date) {
        const task = await Task.query().where({
          'user_id': auth.user.id,
          'date': date
        }).fetch();
        var data = {
          'statusCode': 200,
          'message': 'success',
          'data': task
        }
        return response.json(data)
      }

      const task = await Task.query().where({
        'user_id': auth.user.id
      }).fetch();
      var data = {
        'statusCode': 200,
        'message': 'success',
        'data': task
      }
      return response.json(data)

    } catch (e) {
      return response.json({
        statusCode: 409,
        statusMessage: 'error',
        message: 'Task not valid!',
        excepton: e
      })
    }
  }

  async store({
    request,
    auth,
    response
  }) {
    try {

      // GET DATE 
      var task_date = request.input('date');

      var tasks_json = request.input('tasks');

      // let {date,category_id,name,remark,color} = request.all();

      // DATE PARSE 
      var indiaTime = task_date.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
      });

      for (let i in tasks_json) {

        // GET TASKS DATA 
        var tasks = tasks_json[i];
        // GET CATEGORY 
        var category = tasks.category;

        var list_json = tasks_json[i].list;

        for (let j in list_json) {

          // GET LISTS DATA 
          var lists = list_json[j];
          // GET NAME 
          var name = lists.name;
          // GET REMARK 
          var remark = lists.remark;
          // GET PRIORITY 
          var priority = lists.priority;

          var color = "#1aae6f"; //Green color

          if(priority == true){
            var color = "#ff3709"; //Red color
          }

          // STORE TASKS 
          const task = await Task.findOrCreate({
            user_id: auth.user.id,
            date: indiaTime,
            category_id: category,
            name: name,
            remark: remark,
            color: color
          })
        }
      }

      var statusCode = 200;

      return response.json(statusCode);

    } catch (e) {
      return response.json({
        statusCode: 409,
        statusMessage: 'error',
        message: 'Task not valid!',
        excepton: e
      })
    }
  }

  async update({
    request,
    auth,
    params,
    response
  }) {

    try {
      let {
        date,
        category_id,
        name,
        remark,
        color,
        done
      } = request.all();

      let task = await Task.find(params.id);

      if (task.user_id == auth.user.id) {
        task.date = date;
        task.category_id = category_id;
        task.name = name;
        task.remark = remark;
        task.color = color;
        task.done = done;
        await task.save();
      }

      task.statusCode = 200;
      task.message = 'success';

      return response.json(task);

    } catch (e) {
      return response.json({
        statusCode: 409,
        statusMessage: 'error',
        message: 'Task not valid!',
        excepton: e
      });
    }
  }

  async delete({
    auth,
    params,
    response
  }) {

    try {
      const {
        id
      } = params

      const task = await Task.find(id)

      if (task.user_id == auth.user.id) {
        await task.delete()
      }

      return response.json({
        statusCode: 200,
        statusMessage: 'success',
        message: 'Task has been deleted.'
      });

    } catch (e) {
      return response.json({
        statusCode: 409,
        statusMessage: 'error',
        message: 'Task not valid!',
        excepton: e
      });
    }
  }


}

module.exports = TaskController
