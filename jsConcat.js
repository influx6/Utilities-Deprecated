#!/usr/bin/env node

var fs = require('fs'),
path = require('path');


var  _isType = function(o,type){
	return Object.prototype.toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === type;
};


var getPath = function(p){
   return fs.readFileSync(p,'utf8');
};

var _normalize_string = function(s){
	return s.replace(/\s/g,"");
};

var _normalize_path = function(dir,root){
        dir =  _normalize_string(dir);
        if(!root){
        	return path.normalize(path.resolve(dir));
        }
        return path.normalize(path.resolve(root,dir));
};

var chkBuildDir = function(dir){
  var p = _normalize_path(dir);
  if(path.exists(p)){
        return true;
  }else{
    fs.mkdir(p);
  }
  
};

var _getRequireConfig = function(config){
	var config = config;
	chkBuildDir(config.build_dir);
	return config;
};

each = function(obj,callback,scope){
	 	var self = this;
	 	var attr;
	    
	    if(_isType(obj,"array") ||  _isType(obj,"string")){
	    	for(var i = 0; i < obj.length; i ++){
	    		callback.call(scope,obj[i],obj,i);
	    	}
	    }
	    else {
	    	for(attr in obj){
	    		callback.call(scope, attr,obj);
	    	}
	    };
	    
	    
	     
};

var _getStream = function(o,read){
	if(!read){
		return fs.createWriteStream(o)
	}
	else{
	 	return fs.createReadStream(o);
	 }
};

var compileConfig = function(config){
	var config = _getRequireConfig(config);
	var build_dir = _normalize_path(config.build_dir);
       var stream,current_src, output;
       
       each(config.use, function(o,obj){
       		current_src = obj[o].src_dir;
       		
        	each(obj[o].src, function(r){
        		output = _normalize_path(r,current_src);
        		console.log(output);
        	},this);
        	
       }, this);

}


// testing
var config = {
	build_dir :" ./builds",
	
	use:{
	
		monster_engine: {
			name: 'monster_engine.js',
	    		src_dir : './assets/js',
	    		src:['editor.js','log/logger.js']
		},
			
		curler:{
			name: 'curler.js',
			src_dir : './assets/js/curler',
			src: ['curler.js']
		}
		
	}
}


compileConfig(config);
