async function initDb(swc, options) {
	swc.log.info('init db')
	await swc.dao.models.students.destroy({
		where : {},
		truncate: true 
	})
}

/**
 * 注册各种组件的入口。
 */
module.exports = async (swc, options)=>{
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
	