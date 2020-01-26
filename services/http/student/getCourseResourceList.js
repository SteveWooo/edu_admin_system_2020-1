const fs = require('fs');
/*
* 获取资源列表接口
* @param course_id 课程ID
*/
module.exports = {
    config: {
        path: '/api/public/student/get_course_resource_list',
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

        var list;
        try{
            list = fs.readdirSync(`${__dirname}/../../../public/courseResources/${query.course_id}`);
        }catch(e) {
            req.response.list = [];
            next();
            return ;
        }
        req.response.list = list;
        next();
    }
}