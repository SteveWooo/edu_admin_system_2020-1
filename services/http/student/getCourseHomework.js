/*
* 获取学生信息。
*/
module.exports = {
    config: {
        path: '/api/public/student/get_course_homework_list',
        method: 'get',
        middlewares: ['student/checkSession'],
        model: {
            code: 2000,
            source: {}
        }
    },
    service: async (req, res, next) => {
        var query = req.query;
        var swc = req.swc;

        try {
            var course_id = query.course_id;
            /**
             * 用teacher_id反查课程数据
             */
            var homework = await swc.dao.models.homeworks.findAndCountAll({
                where: {
                    course_id: course_id
                },
                includes : [{
                    as: 'student2Homework',
                    model : swc.dao.models.student_2_homeworks
                }],
                order: [["create_at", 'DESC']],
                limit: 200,
            })

            req.response.homework = homework;
            next();
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}