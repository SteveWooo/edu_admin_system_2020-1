const fs = require('fs');
/**
 * 初始化数据库所有信息（其实直接删库最方便）
 */
async function initDb(swc, options) {
	swc.log.info('init db')
	await swc.dao.models.students.destroy({
		where : {},
		truncate: true 
	})
}

/**
 * 初始化文件上传目录
 */
async function initFolder(swc, options) {
	try{
		fs.mkdirSync(`${__dirname}/../public/courseResources`);
	}catch(e) {
		// 已经存在的话就不用理会了
	}
	try {
		fs.mkdirSync(`${__dirname}/../public/homeworks`);
	} catch (e) {
		// 已经存在的话就不用理会了
	}
}

/**
 * 注册各种组件的入口。
 */
module.exports = async (swc, options)=>{
	await initFolder(swc, options);
	swc = await swc.registerMysqlDao(swc, {
		servicePath: `${__dirname}/../dao/mysql.js`
	});

	swc = await swc.registerMiddleware(swc, {
		middlewareFilePath: `${__dirname}/../middlewares`,
	})

	swc = await swc.registerModel(swc, {
		modelName : 'student',
		path : `${__dirname}/../models/student.js`
	})
	swc = await swc.registerModel(swc, {
		modelName: 'teacher',
		path: `${__dirname}/../models/teacher.js`
	})
	swc = await swc.registerModel(swc, {
		modelName: 'course',
		path: `${__dirname}/../models/course.js`
	})
	swc = await swc.registerModel(swc, {
		modelName: 'homework',
		path: `${__dirname}/../models/homework.js`
	})
	swc = await swc.registerModel(swc, {
		modelName: 'student2Course',
		path: `${__dirname}/../models/student2Course.js`
	})
	swc = await swc.registerModel(swc, {
		modelName: 'student2Homework',
		path: `${__dirname}/../models/student2Homework.js`
	})

	swc = await swc.registerStatic(swc, {
		items: [{
			path: `/${swc.config.server.bussiness_name}/student`,
			staticFilePath: `${__dirname}/../public/student`
		}, {
			path: `/${swc.config.server.bussiness_name}/teacher`,
			staticFilePath: `${__dirname}/../public/teacher`
		}, {
			path: `/${swc.config.server.bussiness_name}/admin`,
			staticFilePath: `${__dirname}/../public/admin`
		}, {
			path: `/${swc.config.server.bussiness_name}/libs`,
			staticFilePath: `${__dirname}/../public/libs`
		}, {
			path: `/${swc.config.server.bussiness_name}/course_resources`,
			staticFilePath: `${__dirname}/../public/courseResources`
		}, {
			path: `/${swc.config.server.bussiness_name}/homeworks`,
			staticFilePath: `${__dirname}/../public/homeworks`
		}]
	})

	swc = await swc.registerHttpService(swc, {
		httpServiceFilePath: `${__dirname}/../services/http`
	})

	// 文件上传服务。
	swc = await swc.registerService(swc, {
		serviceName : 'fileUpload',
		path : `${__dirname}/../services/fileUpload/service`
	})
	swc.services.fileUpload.startup(swc, {});

	if(swc.argv['initDb'] === '1') {
		await initDb(swc, options);
	}

	global.swc = {
		admin : {
			session : ''
		}
	}

	return swc;
}
	