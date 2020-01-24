const crypto = require('crypto');
var handle = {};

/**
 * 创建ID
 * @param name 名称
 * @param teacher_id 教师id
 * @param create_at 创建日期
 */
async function createId(swc, options) {
    var source = `${options.course.create_at}&${options.course.name}&${options.course.teacher_id}&${swc.config.server.public_salt}`;
    var hash = crypto.createHash('sha1').update(source).digest('hex');
    return hash;
}

/**
 * 检查是否用户是否存在
 * @param teacher_id
 */
async function checkIsExistTeacher(swc, options) {
    var teacher = await swc.dao.models.teachers.findAndCountAll({
        where: {
            teacher_id : options.teacher_id
        }
    })

    // 等于0就是没有重复咯
    if (teacher.count == 0) {
        return false;
    }
    return true;
}

/**
 * 课程的创建
 * @param name 名称
 * @param teacher_id 教师id
 */
handle.create = async (swc, options) => {
    var now = +new Date(); // 这里写创建日期呗
    var course = {
        name: options.name,
        teacher_id: options.teacher_id,

        create_by: 'admin',
        update_by: 'admin',
        create_at: now,
        update_at: now
    }

    // 先检查这个老师存在不存在
    if (!(await checkIsExistTeacher(swc, {
        teacher_id: course.teacher_id
    }))) {
        throw await swc.Error(swc, {
            code: '40006'
        })
    }

    // 学生ID需要根据信息创建，所以后获取。
    course.course_id = await createId(swc, {
        course: course
    });

    var result = await swc.dao.models.courses.create(course);
    return result;
}

module.exports = handle;