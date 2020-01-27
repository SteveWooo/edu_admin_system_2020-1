/*
* 获取学生信息。
*/
module.exports = {
    config: {
        path: '/api/public/teacher/evaluate_homework',
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
            var student2Homework_id = query.student_2_homework_id;

            var student2Homework = await swc.dao.models.student_2_homeworks.findAndCountAll({
                where: {
                    student_2_homework_id: student2Homework_id
                },
                order: [["create_at", 'DESC']],
                limit: 200,
            })
            if(student2Homework.count == 0) {
                req.response = await swc.Error(swc, {
                    code : '40005'
                });
                next();
                return ;
            }
            await student2Homework.rows[0].update({
                score : query.score,
                comment : query.comment,
                evaluated : 1
            })

            next();
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}