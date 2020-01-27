/*
* 获取学生信息。
*/
module.exports = {
    config: {
        path: '/api/public/teacher/get_course_student',
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
            var course_id = query.course_id;
            /**
             * 用teacher_id反查课程数据
             */
            var student2Course = await swc.dao.models.student_2_courses.findAndCountAll({
                where: {
                    course_id: course_id
                },
                include : [{
                    as : 'student',
                    model : swc.dao.models.students
                }],
                order: [["create_at", 'DESC']],
                limit: 200,
            })

            req.response.student2Course = student2Course;
            next();
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}