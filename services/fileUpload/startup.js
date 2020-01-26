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
            fs.mkdirSync(`${__dirname}/../../public/homeworks/${req.body.course_id}`);
        } catch (e) {
            // 重复创建就不用理会了
        }
        cb(null, `${__dirname}/../../public/homeworks/${req.body.course_id}/`);
    },
    filename: async function (req, file, cb) {
        var swc = req.swc;
        
        cb(null, file.originalname);
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