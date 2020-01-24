module.exports = {
    config: {
        path: '/api/public/admin/get_teacher',
        method: 'get',
        middlewares: ['admin/authAdmin'],
        model: {
            code: 2000,
            source: {}
        }
    },
    service: async (req, res, next) => {
        var query = req.query;
        var swc = req.swc;

        var teachers = await swc.dao.models.teachers.findAndCountAll({
            where : {}
        })
        req.response.teachers = teachers;
        next();
    }
}