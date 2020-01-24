/*
* 注册接口
* @param student_numer 学号
* @param password 密码
*/
module.exports = {
    config: {
        path: '/api/public/teacher/login',
        method: 'post',
        middlewares: [],
        model: {
            code: 2000,
            source: {}
        }
    },
    service: async (req, res, next) => {
        var query = req.body;
        var swc = req.swc;

        try {
            /**
             * 先去检查密码是否正确，错的话直接跳去catch
             */
            await swc.models.teacher.checkPassword(swc, {
                email : query.email,
                password : query.password
            })

            /**
             * 拿最新的session。敏感函数，必须密码正确才能调用。
             */
            var result = await swc.models.teacher.updateSession(swc, {
                email : query.email
            })

            req.response.session = result.session;
            next();
            return ;
        }catch(e) {
            console.log(e);
            req.response = e;
            next();
            return ;
        }
    }
}