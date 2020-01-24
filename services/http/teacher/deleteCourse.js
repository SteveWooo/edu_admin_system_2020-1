/*
* 删除课程接口
* @param course_id 学号
*/
module.exports = {
    config: {
        path: '/api/public/teacher/delete_course',
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
            
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}