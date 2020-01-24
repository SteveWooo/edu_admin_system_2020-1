/**
 * 检查用户的session是否与缓存中的匹配
 * post带session在body里面，get带url里面
 */
module.exports = async function (req, res, next) {
    var swc = req.swc;
    var query;
    if (req.method == "GET") {
        query = req.query
    } else {
        query = req.body;
    }
    var session = query.session;
    
    /**
     * 由于session存在全局，所以直接和全局比较即可。
     */
    if(session != global.swc.admin.session) {
        req.response = await swc.Error(swc, {
            code: '4003'
        });
        next();
        return;
    }

    req.response.source = {
        name : admin
    }
    next();
}