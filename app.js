var express= require('express');

var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');

var myArray = [];

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

var dbPath = "mongodb://localhost/myblogapp";

db= mongoose.connect(dbPath);

mongoose.connection.once('open',function(){
    
    console.log("database connection open successfully");
    
    
});

var Blog= require('./blogModel.js');

var blogModel = mongoose.model('Blog');

var commentModel = mongoose.model('Comment');

var middleware = require('./middleware.js');


app.get('/',function(req,res){

    console.log("This is a blog application");

});


//API To Get All The Blogs

app.get('/allblogs',function(req,res){

    blogModel.find(function(err,result){
        if(err){
            
            res.send(err);
        }
        else{
            
            res.send(result);
        }
        
        
    });

});




//API To Create A BLog

app.post('/blog/create',function(req,res){
    
    
    var newBlog = new blogModel({
        
        _id: new mongoose.Types.ObjectId(),
        title    : req.body.title,
        subTitle : req.body.subTitle,
        blogBody : req.body.blogBody
            
    });
    
    var newComment = new commentModel({
         
    user: req.body.user,
    blog: newBlog._id    // assign the _id from the person
         
    });
    
    
    
    
    var today=Date.now();
    newBlog.created = today;
    newComment.created = today;
    
    
    var allTags = (req.body.tags!=undefined && req.body.tags!=null)?req.body.tags.split(','):'';
    newBlog.tags = allTags;
    
    
    var authorInfo = {fullName : req.body.authorFullName, email :req.body.authorMail};
    newBlog.authorInfo = authorInfo;
    
    commentModel.find({}).populate('blog').exec(function (err, newblog) {
        
    if (err) return handleError(err);

    
    });
    
    newBlog.comments.push(newComment);
    
    newBlog.save(function(err,result){
        
        
        if(err)
            {
                console.log(err);
                res.send(err);
            }
        
        else
            res.send(result);
            
        });
    
    
    
   
});



//API To Get A Single Blog



app.get('/blog/:id',function(req,res){
    
    
    blogModel.findOne({'_id':req.params.id},function(err,result){
        
        
        if(err){
            
            console.log("some error");
            res.send(err);
        }
        else
            res.send(result);
         
        });
    
    
    
});


//API To Get A Particular Type Of Blog


app.get('/blogtype',middleware.blogFilter,function(req,res){
    

    blogModel.find({tags:req.query.type},function(err,result){
        if(err){
            
            res.send(err);
        }
        else{
            
            res.send(result);
        }
        
        
    });

});



//API To Edit A Blog



app.put('/blog/:id/edit',function(req,res){
    
    var update = req.body;
    
   blogModel.findOneAndUpdate({'_id':req.params.id},{ $set:{"title":(req.body.title!=null)? req.body.title:"",
                                                            "subTitle":(req.body.subTitle!=null)?req.body.subTitle:"",
                                                            "blogBody":(req.body.blogBody!=null)?req.body.blogBody:"",
                                                            "tags":(req.body.tags!=undefined && req.body.tags!=null)?req.body.tags.split(','):'',"lastModified":Date.now()}},
                                                            {new:true},function(err,result){ 
    
        
        if(err){
            
            console.log(err);
            res.send(err);
        }
        else
            res.send(result);
         
        });
    
    
    
});



//API To Delete A Blog


app.post('/blog/:id/delete',function(req,res){
    
    
    blogModel.remove({'_id':req.params.id},function(err,result){
        
        
        if(err){
            
            console.log(err);
            res.send(err);
        }
        
        else
            res.send(result);
         
        });
    
    
    
});





app.listen(3000,function(){

console.log("App is listening on port 3000!");

});
