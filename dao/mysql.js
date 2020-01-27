const Sequelize = require("sequelize");
exports.defineModel = async function defineModel(swc) {
	swc.dao.models.students = swc.dao.seq.define("students", {
		student_id: { type: Sequelize.STRING(40) }, //唯一ID
		name: { type: Sequelize.STRING() }, // 学生姓名
		email: { type: Sequelize.STRING() }, // email唯一
		password: { type: Sequelize.STRING()}, // 密码
		session: { type: Sequelize.STRING(40) }, // 登陆凭证
		
		create_at: { type: Sequelize.STRING() },
		update_at: { type: Sequelize.STRING() },
		create_by: { type: Sequelize.STRING(40) },
		update_by: { type: Sequelize.STRING(40) },
	})

	swc.dao.models.teachers = swc.dao.seq.define("teachers", {
		teacher_id: { type: Sequelize.STRING(40) }, //唯一ID
		name: { type: Sequelize.STRING() }, // 老师姓名
		email: { type: Sequelize.STRING() }, // email唯一
		password: { type: Sequelize.STRING() }, // 密码
		session: { type: Sequelize.STRING(40) }, // 登陆凭证

		create_at: { type: Sequelize.STRING() },
		update_at: { type: Sequelize.STRING() },
		create_by: { type: Sequelize.STRING(40) },
		update_by: { type: Sequelize.STRING(40) },
	})

	/**
	 * 一老师对多课程
	 */
	swc.dao.models.courses = swc.dao.seq.define("courses", {
		course_id: { type: Sequelize.STRING(40) }, //唯一ID
		name: { type: Sequelize.STRING() }, // 课程名称
		description: { type: Sequelize.STRING() }, // 课程介绍
		teacher_id: { type: Sequelize.STRING(40) },

		create_at: { type: Sequelize.STRING() },
		update_at: { type: Sequelize.STRING() },
		create_by: { type: Sequelize.STRING(40) },
		update_by: { type: Sequelize.STRING(40) },
	})

	/**
	 * 一课程对多公告
	 */
	swc.dao.models.notices = swc.dao.seq.define("notices", {
		notice_id: { type: Sequelize.STRING(40) }, //唯一ID
		course_id: { type: Sequelize.STRING(40) },
		title: { type: Sequelize.STRING() },
		content: { type: Sequelize.STRING() },

		create_at: { type: Sequelize.STRING() },
		update_at: { type: Sequelize.STRING() },
		create_by: { type: Sequelize.STRING(40) },
		update_by: { type: Sequelize.STRING(40) },
	})

	/**
	 * 一课程对多作业
	 */
	swc.dao.models.homeworks = swc.dao.seq.define("homeworks", {
		homework_id: { type: Sequelize.STRING(40) }, //唯一ID
		course_id: { type: Sequelize.STRING(40) },
		title: { type: Sequelize.STRING() },
		content: { type: Sequelize.STRING() },
		dead_line: { type: Sequelize.STRING() }, // 作业上交期限，13位时间戳

		create_at: { type: Sequelize.STRING() },
		update_at: { type: Sequelize.STRING() },
		create_by: { type: Sequelize.STRING(40) },
		update_by: { type: Sequelize.STRING(40) },
	})

	/**
	 * 学生与课程是多对多关系，表示学生加入了的课程。
	 */
	swc.dao.models.student_2_courses = swc.dao.seq.define("student_2_courses", {
		student_2_course_id: { type: Sequelize.STRING(40) }, //唯一ID
		course_id: { type: Sequelize.STRING(40) },
		student_id: { type: Sequelize.STRING(40) },

		create_at: { type: Sequelize.STRING() },
		update_at: { type: Sequelize.STRING() },
		create_by: { type: Sequelize.STRING(40) },
		update_by: { type: Sequelize.STRING(40) },
	})

	/**
	 * 学生与作业是多对多关系
	 * 每份作业包含评分、评语
	 */
	swc.dao.models.student_2_homeworks = swc.dao.seq.define("student_2_homeworks", {
		student_2_homework_id: { type: Sequelize.STRING(40) }, //唯一ID
		student_id: { type: Sequelize.STRING(40) },
		homework_id: { type: Sequelize.STRING(40) },
		filename: { type: Sequelize.STRING() },

		evaluated: { type: Sequelize.INTEGER() }, // 评分状态
		score: { type: Sequelize.FLOAT() }, // 作业评分
		comment: { type: Sequelize.STRING() }, // 作业评语

		create_at: { type: Sequelize.STRING() },
		update_at: { type: Sequelize.STRING() },
		create_by: { type: Sequelize.STRING(40) },
		update_by: { type: Sequelize.STRING(40) },
	})

	return swc;
}

exports.defineIndex = async function defineIndex(swc) {
	// swc.dao.models.demos.belongsTo(swc.dao.models.admins, {
	// 	foreignKey : 'create_by', //多的一个数据实体
	// 	targetKey : 'admin_id', //少的一个数据实体
	// 	as : 'admin'
	// })

	swc.dao.models.courses.belongsTo(swc.dao.models.teachers, {
		foreignKey : 'create_by', //多的一个数据实体
		targetKey : 'teacher_id', //少的一个数据实体
		as : 'teacher'
	})

	swc.dao.models.homeworks.belongsTo(swc.dao.models.courses, {
		foreignKey: 'course_id', //多的一个数据实体
		targetKey: 'course_id', //少的一个数据实体
		as: 'course'
	})

	// 查课程参与学生的时候要查学生的个人信息
	swc.dao.models.student_2_courses.belongsTo(swc.dao.models.students, {
		foreignKey: 'student_id', //多的一个数据实体
		targetKey: 'student_id', //少的一个数据实体
		as: 'student'
	})

	swc.dao.models.student_2_courses.belongsTo(swc.dao.models.courses, {
		foreignKey: 'course_id', //多的一个数据实体
		targetKey: 'course_id', //少的一个数据实体
		as: 'course'
	})

	// 查作业表的时候要查是否已经交了作业
	swc.dao.models.homeworks.belongsTo(swc.dao.models.student_2_homeworks, {
		foreignKey: 'homework_id', //多的一个数据实体
		targetKey: 'homework_id', //少的一个数据实体
		as: 'student2Homework'
	})

	// 查已交作业列表的时候要查这个作业是谁交的
	swc.dao.models.student_2_homeworks.belongsTo(swc.dao.models.students, {
		foreignKey: 'student_id', //多的一个数据实体
		targetKey: 'student_id', //少的一个数据实体
		as: 'student'
	})

	swc.log.info('载入:数据索引');
	return swc;
}
