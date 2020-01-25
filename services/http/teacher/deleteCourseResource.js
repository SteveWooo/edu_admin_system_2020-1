const fs = require('fs');
/*
* 删除课程资源接口
* @param course_id 课程id
* @param filename 资源文件名
*/
module.exports = {
    config: {
        path: '/api/public/teacher/delete_course_resource',
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
            fs.unlinkSync(`${__dirname}/../../../public/courseResources/${query.course_id}/${query.filename}`);
            next();
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}