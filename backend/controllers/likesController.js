
const likes = require('../models/Likes');
exports.create = async (req, res) => {
    const {user_id ,post_id} = req.body;

    try {
        
        if (!user_id && !post_id) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = await likes.add({user_id ,post_id});
         
        res.status(201).json({ Update_Status: "OK"});
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};


exports.delete= async (req,res)=>{
    
    try{
    const data=await likes.delete(req.params.id);
    res.status(201).json({ Status: "DELETED"});
       
    }
    catch(err){
        res.status(500).json({ err: err.message });
    }
}
exports.findAllLikes=async (req,res)=>{
try{
const data=await likes.findAllLikesById(req.params.id);
if(!data){
    return res.status(404).json({"message ":"Not found"});
}
res.status(200).json(data);
   
}
catch(err){
    res.status(500).json({ err: err.message });
}
}

