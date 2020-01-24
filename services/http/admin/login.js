/*
* 注册接口
* @param account 账号
* @param password 密码
*/
const crypto = require('crypto');
const ADMIN = {
    account : 'admin',
    password : 'admin'
}
module.exports = {
    config: {
        path: '/api/public/admin/login',
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

        // 登陆与写死的账号密码匹配的话，分配session：
        if(query.account == ADMIN.account && query.password == ADMIN.password) {
            var session = crypto.createHash('sha1').update(`${+new Date()}`).digest('hex');
            req.response.session = session;
            // 设置session，下次在中间件检查
            global.swc.admin.session = session;
            next();
            return ;
        }

        req.response = await swc.Error(swc, {
            code : '40003'
        })
        next();
    }
}