
const comments = require('../models/Comments');
exports.create = async (req, res) => {
    const {user_id ,post_id,content} = req.body;

    try {
        
        if (!user_id && !content && !post_id) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = await comments.add({user_id ,post_id,content});
         
        res.status(201).json({ Update_Status: "OK"});
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};


exports.delete= async (req,res)=>{
    const {user_id ,content}=req.body;
    try{
    const data=await comments.delete(req.params.id);
    res.status(201).json({ Status: "DELETED"});
       
    }
    catch(err){
        res.status(500).json({ err: err.message });
    }
}
exports.findAllCommentsById=async (req,res)=>{
try{
const data=await comments.findAllCommentsById(req.params.id);
if(!data){
    return res.status(404).json({"message ":"Not found"});
}
res.status(200).json(data);
   
}
catch(err){
    res.status(500).json({ err: err.message });
}
}

