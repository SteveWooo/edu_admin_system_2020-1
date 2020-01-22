module.exports = async (swc, options)=>{
	swc = await swc.registerMysqlDao(swc, {
		servicePath: `${__dirname}/../dao/mysql.js`
	});

	

	return swc;
}
	