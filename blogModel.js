var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Blog Schema

var  blogSchema = new Schema({

    title    : {type:String,default:'',required:true},
    subTitle : {type:String,default:''},
    blogBody : {type:String,default:''},
    tags     : [],
    created  : {type:Date},
    lastModified : {type:Date},
    authorInfo : {},
    comments       : [{type: Schema.Types.ObjectId, ref: 'Comment'}]
        
});


//Comment Schema

var  commentSchema = new Schema({
    
    blog : {type: Schema.Types.ObjectId, ref: 'Blog'},
    created : {type:Date,default:null},
    user : {type:String,default:''}
    
});
    
        
//Defining a model

mongoose.model('Blog',blogSchema);

mongoose.model('Comment',commentSchema);