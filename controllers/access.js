async function initDb(swc, options) {
	swc.log.info('init db')
	await swc.dao.models.students.destroy({
		where : {},
		truncate: true 
	})
}

module.exports = async (swc, options)=>{
	swc = await swc.registerMysqlDao(swc, {
		servicePath: `${__dirname}/../dao/mysql.js`
	});

	swc = await swc.registerModel(swc, {
		modelName : 'student',
		path : `${__dirname}/../models/student.js`
	})

	if(swc.argv['initDb'] === '1') {
		await initDb(swc, options);
	}

	return swc;
}
	