/*
* 注册接口
* @param student_numer 学号
* @param name 学生姓名
* @param password 密码
* @param password_confirm 确认密码
*/
module.exports = {
    config: {
        path: '/api/public/student/register',
        method: 'get',
        middlewares: [],
        model: {
            code: 2000,
            mode: '',
            source: {}
        }
    },
    service: async (req, res, next) => {
        req.response.mode = req.swc.mode;
        next();
    }
}