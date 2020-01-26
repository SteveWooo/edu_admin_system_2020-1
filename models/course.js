const fs = require('fs');
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
 * 创建资源文件夹
 * @param course 课程对象
 */
async function createResourceDir(swc, options) {
    try{
        fs.mkdirSync(`${__dirname}/../public/courseResources/${options.course.course_id}`);
    }catch(e){

    }
    return ;
}

/**
 * 删除文件夹方法
 */
async function deteleDir(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

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
 * 删除课程
 * @param course_id
 */
handle.delete = async (swc, options)=>{
    await swc.dao.models.courses.destroy({
        where : {
            course_id : options.course_id
        }
    })

    try{
        await deteleDir(`${__dirname}/../public/courseResources/${options.course_id}`);
    }catch(e) {
        // 不存在也不用管
    }
    return ;
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
        description: options.description,
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

    // 创建资源目录
    await createResourceDir(swc, {
        course : course
    })
    return result;
}

module.exports = handle;