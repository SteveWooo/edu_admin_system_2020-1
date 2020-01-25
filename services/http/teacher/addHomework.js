/*
* 教师调用的创建课程接口
* @param name 课程名称
*/
module.exports = {
    config: {
        path: '/api/public/teacher/add_homework',
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
            if (query.title == undefined) {
                throw await swc.Error(swc, {
                    code: '40005'
                })
            }
            var homework = await swc.models.homework.create(swc, {
                title: query.title,
                content : query.content,
                dead_line : query.dead_line,
                teacher_id: req.response.source.teacher_id
            })

            req.response.homework = homework;
            next();
            return;
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}