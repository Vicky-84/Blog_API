

//Middleware Function To Identify The Particular Type Of Blog

exports.blogFilter = function(req,res,next){


           if(req.query.type=='gaming' || req.query.type=='sports'|| req.query.type=='study')
               
               next();
    
            else
                res.send("This type of blogs are not available");



};