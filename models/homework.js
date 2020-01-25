const crypto = require('crypto');
var handle = {};

/**
 * 创建ID
 * @param title 作业标题
 * @param course_id 课程id
 * @param create_at 创建日期
 */
async function createId(swc, options) {
    var source = `${options.homework.create_at}&${options.homework.title}&${options.homework.course_id}&${swc.config.server.public_salt}`;
    var hash = crypto.createHash('sha1').update(source).digest('hex');
    return hash;
}

/**
 * 检查是否课程是否存在
 * @param course_id
 */
async function checkIsExistCourse(swc, options) {
    var course = await swc.dao.models.courses.findAndCountAll({
        where: {
            course_id: options.course_id
        }
    })

    // 等于0就是没有重复咯
    if (course.count == 0) {
        return false;
    }
    return true;
}

/**
 * 作业课程
 * @param homework_id
 */
handle.delete = async (swc, options) => {
    await swc.dao.models.homeworks.destroy({
        where: {
            homework_id: options.homework_id
        }
    })
    return;
}

/**
 * 作业的创建
 * @param course_id 课程id
 * @param title 作业标题
 * @param content 作业内容
 * @param dead_line 作业ddl
 */
handle.create = async (swc, options) => {
    var now = +new Date(); // 这里写创建日期呗
    var homework = {
        name: options.name,
        course_id: options.course_id,
        title : options.title,
        content : options.content,
        dead_line: options.dead_line,

        create_by: 'admin',
        update_by: 'admin',
        create_at: now,
        update_at: now
    }

    // 先检查这个老师存在不存在
    if (!(await checkIsExistCourse(swc, {
        course_id: homework.course_id
    }))) {
        throw await swc.Error(swc, {
            code: '40006'
        })
    }

    // 学生ID需要根据信息创建，所以后获取。
    homework.homework_id = await createId(swc, {
        homework: homework
    });

    var result = await swc.dao.models.homeworks.create(homework);
    return result;
}

module.exports = handle;