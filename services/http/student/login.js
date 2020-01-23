/*
* 注册接口
* @param student_numer 学号
* @param password 密码
*/
module.exports = {
    config: {
        path: '/api/public/student/login',
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