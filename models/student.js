const crypto = require('crypto');
var handle = {};

/**
 * 创建ID
 * @param name 学生姓名
 * @param create_at 创建日期
 * @param student_number 学号
 */
async function createId(swc, options) {
    var source = `${options.student.create_at}&${options.student.name}&${options.student.student_number}&${swc.config.server.public_salt}`;
    var hash = crypto.createHash('sha1').update(source).digest('hex');
    return hash;
}

/**
 * 检查是否用户是否重复存在
 * @param student_number
 */
async function checkIsExistStudentNumber(swc, options) {
    var student = await swc.dao.models.students.findAndCountAll({
        where : {
            student_number : options.student_number
        }
    })

    // 等于0就是没有重复咯
    if(student.count == 0) { 
        return false;
    }
    return true;
}

/**
 * 密码创建
 * @param password 密码
 */
async function getPassword(swc, options) {
    var password = options.password;
    var hash = crypto.createHash('sha1').update(`${password}&${swc.config.server.public_salt}`).digest('hex');
    return hash;
}

/**
 * 检查登陆密码是否正确
 * @param student_number 学号
 * @param password 登陆密码
 */
handle.checkPassword = async(swc, options)=> {
    var student = await swc.dao.models.students.findAndCountAll({
        where : {
            student_number : options.student_number
        }
    })

    if(student.count == 0) {
        throw await swc.Error(swc, {
            code : '4004'
        })
    }

    var password = crypto.createHash('sha1').update(`${options.password}&${swc.config.server.public_salt}`).digest('hex');
    
    if(password !== student.rows[0].password) {
        return false;
    }
    return true;
}

/**
 * 学生的创建
 * @param name 学生姓名
 * @param student_number 学号
 */
handle.create = async (swc, options)=>{
    var now = +new Date(); // 这里写创建日期呗
    var student = {
        name : options.name,
        student_number : options.student_number,
        session : '',
        create_by : 'admin',
        update_by : 'admin',
        create_at : now,
        update_at : now
    }

    // 先检查是否有重复
    if (await checkIsExistStudentNumber(swc, {
        student_number : student.student_number
    })) {
        throw await swc.Error(swc, {
            code : '50005'
        })
    }

    // 学生ID需要根据信息创建，所以后获取。
    student.student_id = await createId(swc, {
        student : student
    });

    // 密码获取 随意
    student.password = await getPassword(swc, {
        password : options.password
    })

    var result = await swc.dao.models.students.create(student);
    return result;
}

module.exports = handle;