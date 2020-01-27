const fs = require('fs');
/*
* 删除课程的学生接口
* @param student_2_course 课程学生id
*/
module.exports = {
    config: {
        path: '/api/public/teacher/delete_course_student',
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

        var student_2_course_id = query.student_2_course_id;
        await swc.dao.models.student_2_courses.destroy({
            where : {
                student_2_course_id: student_2_course_id
            }
        })

        next();
    }
}