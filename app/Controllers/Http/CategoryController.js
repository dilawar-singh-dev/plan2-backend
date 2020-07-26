'use strict'
const Category = use('App/Models/Category');

class CategoryController {

    async show({request,auth, response}) {
        
        let category = await Category.query().where('user_id',auth.user.id).orderBy('id', 'desc').fetch();

        var data = {'statusCode':200,'message':'success','data':category}
    
        return response.json(data)
      }

    async store({request, auth, response}) {

        try {

            var name = request.input('name');
            var remark = request.input('remark');

            const category = await Category.findOrCreate(
                { user_id: auth.user.id, name: name,remark: remark }
            )

            category.statusCode = 200;
            category.message = 'success';
        
            return response.json(category);
    
        } catch (e) {
        return response.json({statusCode:409,statusMessage:'error',message: 'Category not valid!',excepton: e})
        }
    }

    async update({request,auth, params, response}) {

        try {
            let {name,remark,disable} = request.all();

            let category = await Category.find(params.id);

            if(category.user_id == auth.user.id){
                category.name = name;
                category.remark = remark;
                category.disable = disable;
                await category.save();
            }

            category.statusCode = 200;
            category.message = 'success';
        
            return response.json(category);

        } catch (e) {
            return response.json({statusCode:409,statusMessage:'error',message: 'Category not valid!',excepton: e});
        }
    }

    async delete({auth, params, response}) {

        try {
            const { id } = params

            const category = await Category.find(id)
            
            if(category.user_id == auth.user.id){
                await category.delete()
            }

            return response.json({statusCode:200,statusMessage:'success',message: 'Category has been deleted.'});
            
        } catch (e) {
            return response.json({statusCode:409,statusMessage:'error',message: 'Category not valid!',excepton: e});
        }
    }
}

module.exports = CategoryController
