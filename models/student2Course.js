const crypto = require('crypto');
var handle = {};

/**
 * 创建ID
 * @param student_id 学生id
 * @param course_id 课程id
 */
async function createId(swc, options) {
    var source = `${options.student2Course.student_id}&${options.student2Course.course_id}&${options.student2Course.create_at}&${swc.config.server.public_salt}`;
    var hash = crypto.createHash('sha1').update(source).digest('hex');
    return hash;
}
/**
 * 学生加入课程
 * @param student_id 学生id
 * @param course_id 课程id
 */
handle.create = async (swc, options) => {
    var now = +new Date(); // 这里写创建日期呗
    var student2Course = {
        student_id : options.student_id,
        course_id: options.course_id,
        create_by: 'admin',
        update_by: 'admin',
        create_at: now,
        update_at: now
    }


    // 学生ID需要根据信息创建，所以后获取。
    student2Course.student_2_course_id = await createId(swc, {
        student2Course: student2Course
    });

    var result = await swc.dao.models.student_2_courses.create(student2Course);
    return result;
}

module.exports = handle;