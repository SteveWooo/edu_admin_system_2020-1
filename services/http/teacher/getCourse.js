/*
* 获取学生信息。
*/
module.exports = {
    config: {
        path: '/api/public/teacher/get_course',
        method: 'get',
        middlewares: ['teacher/checkSession'],
        model: {
            code: 2000,
            source: {}
        }
    },
    service: async (req, res, next) => {
        var query = req.query;
        var swc = req.swc;

        try {
            var teacher_id = req.response.source.teacher_id;
            /**
             * 用teacher_id反查课程数据
             */
            var courses = await swc.dao.models.courses.findAndCountAll({
                where : {
                    teacher_id : teacher_id
                }
            })
            
            req.response.courses = courses;
            next();
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}