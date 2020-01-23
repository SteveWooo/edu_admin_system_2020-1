const crypto = require('crypto');
var handle = {};

/**
 * 创建ID
 * @param name 姓名
 * @param create_at 创建日期
 * @param email 邮箱
 */
async function createId(swc, options) {
    var source = `${options.teacher.create_at}&${options.teacher.name}&${options.teacher.email}&${swc.config.server.public_salt}`;
    var hash = crypto.createHash('sha1').update(source).digest('hex');
    return hash;
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
 * 检查是否用户是否重复存在
 * @param student_number
 */
async function checkIsExistEmail(swc, options) {
    var teacher = await swc.dao.models.teacher.findAndCountAll({
        where: {
            email: options.email
        }
    })

    // 等于0就是没有重复咯
    if (teacher.count == 0) {
        return false;
    }
    return true;
}

/**
 * 检查登陆密码是否正确
 * @param student_number 学号
 * @param password 登陆密码
 */
handle.checkPassword = async (swc, options) => {
    var teacher = await swc.dao.models.teacher.findAndCountAll({
        where: {
            email: options.email
        }
    })

    if (teacher.count == 0) {
        throw await swc.Error(swc, {
            code: '4004'
        })
    }

    var password = crypto.createHash('sha1').update(`${options.password}&${swc.config.server.public_salt}`).digest('hex');

    if (password !== teacher.rows[0].password) {
        return false;
    }
    return true;
}

/**
 * 教师的创建
 * @param name 姓名
 * @param email 邮箱
 */
handle.create = async (swc, options) => {
    var now = +new Date(); // 这里写创建日期呗
    var teacher = {
        name: options.name,
        email: options.email,
        session : '',
        create_by: 'admin',
        update_by: 'admin',
        create_at: now,
        update_at: now
    }

    // 先检查是否有重复
    if (await checkIsExistEmail(swc, {
        email: teacher.email
    })) {
        throw await swc.Error(swc, {
            code: '50005'
        })
    }

    teacher.teacher_id = await createId(swc, {
        teacher: teacher
    });

    tracher.password = await getPassword(swc, {
        password : options.password
    })

    var result = await swc.dao.models.teachers.create(teacher);
    return result;
}

module.exports = handle;