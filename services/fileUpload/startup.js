const multer = require('multer');
const fs = require('fs');

var resourceStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        /**
         * 防止文件夹不存在
         */
        try{
            fs.mkdirSync(`${__dirname}/../../public/courseResources/${req.body.course_id}`);
        }catch(e) {
            // 重复创建就不用理会了
        }
        cb(null, `${__dirname}/../../public/courseResources/${req.body.course_id}/`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
var resourceUploader = multer({
    storage: resourceStorage
})

var homeworkStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        /**
         * 防止文件夹不存在
         */
        try {
            fs.mkdirSync(`${__dirname}/../../public/homeworks/${req.body.homework_id}`);
        } catch (e) {
            // 重复创建就不用理会了
        }
        cb(null, `${__dirname}/../../public/homeworks/${req.body.homework_id}/`);
    },
    filename: async function (req, file, cb) {
        var swc = req.swc;

        var student = await swc.dao.models.students.findAndCountAll({
            where: {
                student_id: req.body.student_id
            }
        })
        // 用学生姓名来命名
        var filename = `${student.rows[0].name}-${student.rows[0].student_id}-${file.originalname}`;
        var student2Homework = await swc.models.student2Homework.create(swc, {
            homework_id : req.body.homework_id,
            student_id : req.body.student_id,
            filename : filename
        })

        cb(null, filename);
    }
})
var homeworkUploader = multer({
    storage: homeworkStorage
})

module.exports = async (swc, options)=>{
    swc.app.post(`/${swc.config.server.bussiness_name}/file_upload`, resourceUploader.single('file'), (req, res)=>{
        res.send(`
<html>
<body>
    <script>
        alert('上传完成');
        location.href = "${req.body.callback}";
    </script>
</body>
</html>
        `);
    })

    swc.app.post(`/${swc.config.server.bussiness_name}/homework_upload`, (req, res, next)=>{
        req.swc = swc;
        next();
    }, homeworkUploader.single('file'), (req, res) => {
        res.send(`
<html>
<body>
    <script>
        alert('上传完成');
        location.href = "${req.body.callback}";
    </script>
</body>
</html>
        `);
    })
}