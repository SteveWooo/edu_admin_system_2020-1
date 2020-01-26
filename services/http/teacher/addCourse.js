/*
* 教师调用的创建课程接口
* @param name 课程名称
*/
module.exports = {
    config: {
        path: '/api/public/teacher/add_course',
        method: 'post',
        middlewares: ['teacher/checkSession'],
        model: {
            code: 2000,
            source: {}
        }
    },
    service: async (req, res, next) => {
        var query = req.body;
        var swc = req.swc;

        try {
            if(query.name == undefined) {
                throw await swc.Error(swc, {
                    code : '40005'
                })
            }
            var course = await swc.models.course.create(swc, {
                name : query.name,
                description : query.description,
                teacher_id : req.response.source.teacher_id
            })
            
            req.response.course = course;
            next();
            return ;
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}