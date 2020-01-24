/*
* 注册接口
* @param student_numer 学号
* @param name 学生姓名
* @param password 密码
* @param password_confirm 确认密码
*/
module.exports = {
    config: {
        path: '/api/public/teacher/register',
        method: 'post',
        middlewares: [],
        model: {
            code: 2000,
            mode: '',
            source: {}
        }
    },
    service: async (req, res, next) => {
        var swc = req.swc;
        var query = req.body;

        try {
            await checkParam(swc, {
                query : query
            })

            // 创建教师
            var teacher = await swc.models.teacher.create(swc, {
                email : query.email,
                name : query.name,
                password : query.password
            })
            req.response.teacher = teacher;
            next();
        }catch(e) {
            console.log(e);
            req.response = e;
            next();
            return ;
        }
    }
}

/**
 * 检查http请求参数
 * @param query json参数
 */
async function checkParam(swc, options) {
    var query = options.query;
    var result = {
        correct : true
    }

    // 检查空参数
    if(query.name == '' || query.name == undefined || query.email == undefined || query.email == ''
        || query.password == undefined || query.password == '' || query.password_confirm == undefined || 
        query.password_confirm == '') {
        throw await swc.Error(swc, {
            code : '4005'
        })
    }

    // 检查密码是否一致
    if(query.password_confirm !== query.password) {
        throw await swc.Error(swc, {
            code: '4005'
        })
    }

    return result ;
}