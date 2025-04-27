
const pool = require('../config/database');
const StudentSkills = require('../models/StudentSkills');
const TeacherSkills = require('../models/TeacherSkills');
const Skills = require('../models/Skills');
const User = require('../models/User');

exports.getUsersByAnySkills = async (req, res) => {
    const { skillsList } = req.body;
    try {
        
let data="(";
        for(let i in skillsList){
            data+=(i+',')
        }
        data=data.substring(0,data.length-1);
        data+=')';
        const [users] = await pool.query('select DISTINCT student_id from student_skills where skill_id  in '+data+';')
        if (users.length>0) {
            return res.status(200).json(users);
        }
       else {
        res.status(404).json({"message":"Not Found"});
       }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

