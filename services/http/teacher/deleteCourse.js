/*
* 注册接口
* @param student_numer 学号
* @param password 密码
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