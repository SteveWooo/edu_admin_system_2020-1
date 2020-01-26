/**
 * 插入已经选择的课程
 * @param courses 所有课程列表
 * @param student_id 学生id。
 */
async function splitChooseCourse(swc, options) {
    var courses = options.courses;
    var student_id = options.student_id;
    var student2Courses = await swc.dao.models.student_2_courses.findAndCountAll({
        where : {
            student_id : student_id
        },
        limit: 200,
    })
    for(var i=0;i<courses.rows.length;i++){
        courses.rows[i] = courses.rows[i].dataValues;
        courses.rows[i].chooseStatus = 2; // 2 未选课， 1 已选课
        for(var s=0;s<student2Courses.rows.length;s++){
            /**
             * 如果学生已选课，则需要给给courses里面对应的修改chooseStatus = 1
             */
            if(student2Courses.rows[s].course_id == courses.rows[i].course_id) {
                courses.rows[i].chooseStatus = 1;
                continue ;
            }
        }
    }

    return courses;
}
/*
* 获取所有课程信息。如果已登陆，则排除掉学生已经加入的课程。
*/
module.exports = {
    config: {
        path: '/api/public/student/get_course',
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
            var student_id = req.response.source.student_id;

            // 先获取所有课程
            var courses = await swc.dao.models.courses.findAndCountAll({
                where: {
                },
                order: [["create_at", 'DESC']],
                limit: 200,
            })
            if(student_id != undefined) {
                courses = await splitChooseCourse(swc, {
                    student_id : student_id,
                    courses : courses
                })
            }

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