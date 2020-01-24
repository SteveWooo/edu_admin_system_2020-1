/*
* 获取学生信息。
*/
module.exports = {
    config: {
        path: '/api/public/student/get_user',
        method: 'get',
        middlewares: [],
        model: {
            code: 2000,
            source: {}
        }
    },
    service: async (req, res, next) => {
        var query = req.query;
        var swc = req.swc;

        try {
            var session = query.session;
            /**
             * 用session反查学生数据
             */
            var student = await swc.dao.models.students.findAndCountAll({
                where: {
                    session: session
                }
            })

            // 查询失败，直接返回即可
            if (student.count == 0) {
                req.response.name == undefined;
                req.response.email == undefined;
                next();
                return;
            }

            req.response.source = {
                name: student.rows[0].name,
                email: student.rows[0].email
            }
            next();
        } catch (e) {
            console.log(e);
            req.response = e;
            next();
            return;
        }
    }
}