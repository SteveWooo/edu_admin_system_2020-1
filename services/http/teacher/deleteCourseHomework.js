/*
* 删除课程接口
* @param course_id 学号
*/
module.exports = {
    config: {
        path: '/api/public/teacher/delete_course_homework',
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
            await swc.models.homework.delete(swc, {
                homework_id: query.homework_id
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