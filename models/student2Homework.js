const crypto = require('crypto');
var handle = {};

/**
 * 创建ID
 * @param student_id 学生id
 * @param homework_id 作业id
 */
async function createId(swc, options) {
    var source = `${options.student2Homework.student_id}&${options.student2Homework.homework_id}&${options.student2Homework.create_at}&${swc.config.server.public_salt}`;
    var hash = crypto.createHash('sha1').update(source).digest('hex');
    return hash;
}
/**
 * 学生提交作业
 * @param student_id 学生id
 * @param homework_id 作业id
 */
handle.create = async (swc, options) => {
    var now = +new Date(); // 这里写创建日期呗
    var student2Homework = {
        student_id: options.student_id,
        homework_id: options.homework_id,
        filename : options.filename,
        evaluated : 0,
        create_by: 'admin',
        update_by: 'admin',
        create_at: now,
        update_at: now
    }


    // 学生ID需要根据信息创建，所以后获取。
    student2Homework.student_2_homework_id = await createId(swc, {
        student2Homework: student2Homework
    });

    /**
     * 创建新的作业之前，把旧的数据删掉。
     */
    await swc.dao.models.student_2_homeworks.destroy({
        where : {
            student_id : options.student_id,
            homework_id : options.homework_id
        }
    })

    var result = await swc.dao.models.student_2_homeworks.create(student2Homework);
    return result;
}

module.exports = handle;