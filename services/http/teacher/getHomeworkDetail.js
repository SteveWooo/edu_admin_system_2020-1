/*
* 获取学生信息。
*/
module.exports = {
    config: {
        path: '/api/public/teacher/get_course_homework_detail',
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
            var homework_id = query.homework_id;
            /**
             * 用teacher_id反查课程数据
             */
            var student2Homework = await swc.dao.models.student_2_homeworks.findAndCountAll({
                where: {
                    homework_id: homework_id
                },
                include : [{
                    as : 'student',
                    model : swc.dao.models.students
                }],
                order: [["create_at", 'DESC']],
                limit: 200,
            })

            req.response.student2Homework = student2Homework;
            next();
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}