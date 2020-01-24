/**
 * 检查用户的session是否与数据库的匹配
 * post带session在body里面，get带url里面
 */
module.exports = async function(req, res, next) {
    var swc = req.swc;
    var query ;
    if (req.method == "GET") {
        query = req.query
    } else {
        query = req.body;
    }
    var session = query.session;
    if(!session) {
        req.response = await swc.Error(swc, {
            code: '4003'
        });
        res.send(req.response);
        return; 
    }
    /**
     * 用session反查学生数据
     */
    var teacher = await swc.dao.models.teachers.findAndCountAll({
        where : {
            session : session
        }
    })

    // 查询失败，直接报错即可
    if(teacher.count == 0) {
        req.response = await swc.Error(swc, {
            code : '4003'
        });
        res.send(req.response);
        return ; 
    }
    
    req.response.source = {
        teacher_id: teacher.rows[0].teacher_id,
        name : teacher.rows[0].name,
        email : teacher.rows[0].email
    }
    next();
}