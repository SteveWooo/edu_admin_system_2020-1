/*
* 加入课程
* @parma student_id
* @param course_id
*/
module.exports = {
    config: {
        path: '/api/public/student/join_course',
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
        if(!query.student_id || !query.course_id) {
            req.response = await swc.Error(swc, {
                code : '4003'
            });
            next();
            return ;
        }

        try {
            
            
            next();
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}