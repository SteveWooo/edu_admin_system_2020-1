async function studentTest(swc, options) {
    try {
        // var result ;
        // result = await swc.models.student.create(swc, {
        //     name : 'stevewoo',
        //     student_number : '142011042',
        //     password : 'lyoko123RAIN'
        // })
        // console.log(result);

        // result = await swc.models.student.checkPassword(swc, {
        //     student_number: '142011042',
        //     password: 'lyoko123RAIN'
        // })
        // console.log(result);
    }catch(e) {
        console.log(e)
    }
}

async function main() {
    var swc;
    try {
        swc = await require(`${__dirname}/../keke_stage/server/models/swc/init`)();
        swc = await require(`${__dirname}/../controllers/access`)(swc, {});
        await studentTest(swc, {});
    } catch (e) {
        console.log(e);
        process.exit();
    }
}

main();
