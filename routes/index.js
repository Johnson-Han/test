var express = require('express');
var router = express.Router();
var my_conn = require("./pgconn");
var sq = require("./util/sqlutil");
var rd = require("./util/rdfiles.js");
/* GET home page. */


 router.get('/get_material_name', function(req, res,next) { //合金数据库
   	var sql = 'select material_name from material_name UNION select param_name from alloy_param';
	////console.log(req.query.query_field);
	
	my_conn.query(sql,function(result){
	//console.log(result.rows);
		res.jsonp(result.rows);
	}); 
});
 router.get('/get_graphite_name', function(req, res,next) { //石墨数据库
   	var sql = 'select material_name from material_name UNION select param_name from graphite_param';
	////console.log(req.query.query_field);
	
	my_conn.query(sql,function(result){
	////console.log(result.rows);
		res.jsonp(result.rows);
	}); 
});
 router.get('/get_salt_name', function(req, res,next) { //熔盐数据库
   	var sql = 'select param_name from salt_param';
	////console.log(req.query.query_field);
	
	my_conn.query(sql,function(result){
	////console.log(result.rows);
		res.jsonp(result.rows);
	}); 
});

router.get('/get_salt_mech_name', function(req, res,next) { //熔盐数据库
	var sql = 'select param_name from salt_mech_param';
 ////console.log(req.query.query_field);
 
 my_conn.query(sql,function(result){
 ////console.log(result.rows);
	 res.jsonp(result.rows);
 }); 
});
router.get('/get_irradiant_name', function(req, res,next) { //辐照数据库
   	var sql = 'select distinct alloy_name from alloy_irradiant_data UNION select param_name from alloy_irradiant_param UNION select distinct enviroment from alloy_irradiant_data';
	////console.log(req.query.query_field);
	
	my_conn.query(sql,function(result){
	////console.log(result.rows);
		res.jsonp(result.rows);
	}); 
});

router.get('/get_irradiant_graphite_name', function(req, res,next) { //石墨辐照数据库
	var sql = ' select param_name from graphite_irradiant_param ';
 ////console.log(req.query.query_field);
 
 my_conn.query(sql,function(result){
 ////console.log(result.rows);
	 res.jsonp(result.rows);
 }); 
});

 router.get('/get_corrode_name', function(req, res,next) { //腐蚀数据库
   	var sql = 'select distinct alloy_name from alloy_salt_corrod UNION select distinct morphology from alloy_salt_corrod';
	////console.log(req.query.query_field);
	
	my_conn.query(sql,function(result){
	////console.log(result.rows);
		res.jsonp(result.rows);
	}); 
});

router.get('/get_login_record', function(req, res,next) { //腐蚀数据库
	var sql = 'select max(index) as login,max(user_index) as user from login_record ,db_user';
 	my_conn.query(sql,function(result){
 	////console.log(result.rows);
	 res.jsonp(result.rows);
 }); 
});


router.get('/', function(req, res, next) {
	////console.log(req.session.user);
	if(!req.session.user){ 					//到达/home路径首先判断是否已经登录
		req.session.error = "请先登录";
		res.redirect("/login");				//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user){
	res.render("/home",{title:'主页'}); 	
	}//未登录则重定向到 /login 路径
	
});


router.get('/home', function(req, res, next) {
  	if(!req.session.user){ 					//到达/home路径首先判断是否已经登录
		req.session.error = "请先登录";
		res.redirect("/login");				//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user){
	res.render("home",{title:'主页'}); 	
	}//未登录则重定向到 /login 路径
});

// router.get('/contact', function(req, res, next) {
// 	if(!req.session.user){ 					//到达/home路径首先判断是否已经登录
// 		req.session.error = "请先登录";
// 		res.redirect("/login");				//未登录则重定向到 /login 路径
// 	} ;	
// 	if(req.session.user){
// 	res.render("contact",{title:'联系'}); 	
// 	}//未登录则重定向到 /login 路径
  
// });


router.route("/contact").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
	res.render("contact",{title:'用户联系'});
}).post(function(req,res){ 	

	var user =req.body;
	var myDate = new Date();
	var loginTime = myDate.toLocaleString();
   	var data =req.body;
	   var contactTime = myDate.toLocaleString();
	   sql='insert into contact_message(name,phone,email,message,time) values (\'' +data.name+'\',\''+data.phone+'\',\''+data.email+'\',\''+data.message+'\',\''+contactTime+'\')';
	   console.log(sql);
	   my_conn.query(sql,function(result){
		////console.log(result.rowCount)
		if(result.rowCount == 0){ 
			//req.session.error = '用户名或密码不正确';
			res.sendStatus(404);							//	状态码返回404
			//	res.redirect("/login");
		}else if(result.rowCount == 1){
			////console.log(result.rows[0].username);
			req.session.user = result.rows[0]; 
			////console.log(result.rows[0]);
			res.sendStatus(200);
			
		}		
	});				   

});




router.get('/exPassword', function(req, res, next) {
	if(!req.session.user){ 					//到达/home路径首先判断是否已经登录
	  req.session.error = "请先登录";
	  res.redirect("/login");				//未登录则重定向到 /login 路径
	// res.render("exPassword",{title:'修改信息'}); 	
	
  } ;	
  if(req.session.user){
  res.render("exPassword",{title:'修改信息'}); 	
  }//修改界面信息
});

// router.get('/admin', function(req, res, next) {
// 	if(!req.session.user){ 					//到达/home路径首先判断是否已经登录
// 	  req.session.error = "请先登录";
// 	  res.redirect("/login");				//未登录则重定向到 /login 路径
// 	// res.render("exPassword",{title:'修改信息'}); 	
	
//   } ;	
//   if(req.session.user){
//   res.render("admin",{title:'后台管理'}); 	
//   }//修改界面信息
// });




router.get('/data_alloy', function(req, res, next) {
	////console.log(req.session.user.alloy);
	if(req.session.user.alloy == 1){ 					//到达/home路径首先判断是否已经登录
		res.render("data_alloy", { title: '合金数据库', param_id:'1',err_info:''}); 			//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user.alloy == 0){ 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	} ;	
  
});


router.get('/data_alloy/:param_id', function (req, res, next) {
	////console.log(req.session.user.alloy);
	if (req.session.user.alloy == 1) { 					//到达/home路径首先判断是否已经登录
		res.render("data_alloy", { title: '合金数据库', param_id: req.params.param_id,err_info:''}); 			//未登录则重定向到 /login 路径
	};
	if (req.session.user.alloy == 0) { 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	};

});

router.get('/alloy_report', function(req, res, next) {
	////console.log(req.session.user.alloy);
	if(req.session.user.alloy == 1){ 					//到达/home路径首先判断是否已经登录
		res.render("alloy_report",{title:'合金数据库技术报告'}); 			//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user.alloy == 0){ 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	} ;	
  
});




router.get('/get_alloy_report', function(req, res,next) { //负面清单页面入口
	var path = './public/documents/alloy/alloy_report';
        // console.log("读报告列表");		
 		 rd.getFileList(path,function(filesList){	
		//   console.log(filesList);	
		 res.jsonp(filesList);	});
		  });


		
//  	if(req.session.user.salt == 1){ 					//到达/home路径首先判断是否已经登录

// 		 }
// 			//未登录则重定向到 /login 路径
// 		)};
// 	if(req.session.user.salt == 0){ 					//到达/home路径首先判断是否已经登录
// 		res.render("home"); 			//未登录则重定向到 /login 路径
// 	} ;

	 
//  }); 
router.get('/public/documents/alloy/alloy_report/:fileName.:extension', function(req, res){
	
		var file ='./public/documents/alloy/alloy_report/' + req.params.fileName + '.' + req.params.extension;
		file_name='download'+ '.' + req.params.extension;
	   console.log(file);
	   if(req.session.user.alloy == 1){ 	
			res.download(file, function(err){
				if(err) {
					// Check if headers have been sent
					 res.sendStatus(404);}
				else {
					return res.status(304).end();
					// return res.redirect('/alloy_report'); // 404, maybe 500 depending on err
					}
		
				// Don't need res.end() here since already sent
				
	 		 })
			}
		if(req.session.user.alloy == 0){ 					//到达/home路径首先判断是否已经登录
				res.render("/home"); 			//未登录则重定向到 /login 路径
		} ;		
	});  

router.get('/public/samples/:fileName.:extension', function (req, res) {

	var file = './public/samples/' + req.params.fileName + '.' + req.params.extension;
	file_name = req.params.fileName + '.' + req.params.extension;
	console.log(file);

		res.download(file, function (err) {
			if (err) {
				// Check if headers have been sent
				res.sendStatus(404);
			}
			else {
				return res.status(304).end();
				// return res.redirect('/alloy_report'); // 404, maybe 500 depending on err
			}

			// Don't need res.end() here since already sent

		})
	
}); 
router.get('/public/samples/alloy/:fileName.:extension', function (req, res) {

	var file = './public/samples/alloy/' + req.params.fileName + '.' + req.params.extension;
	file_name = req.params.fileName + '.' + req.params.extension;
	console.log(file);

	res.download(file, function (err) {
		if (err) {
			// Check if headers have been sent
			res.sendStatus(404);
		}
		else {
			return res.status(304).end();
			// return res.redirect('/alloy_report'); // 404, maybe 500 depending on err
		}

		// Don't need res.end() here since already sent

	})

}); 
router.get('/public/samples/graphite/:fileName.:extension', function (req, res) {

	var file = './public/samples/graphite/' + req.params.fileName + '.' + req.params.extension;
	file_name = req.params.fileName + '.' + req.params.extension;
	console.log(file);

	res.download(file, function (err) {
		if (err) {
			// Check if headers have been sent
			res.sendStatus(404);
		}
		else {
			return res.status(304).end();
			// return res.redirect('/alloy_report'); // 404, maybe 500 depending on err
		}

		// Don't need res.end() here since already sent

	})

}); 


router.get('/alloy_standard', function(req, res, next) {
	////console.log(req.session.user.alloy);
	if(req.session.user.alloy == 1){ 					//到达/home路径首先判断是否已经登录
		res.render("alloy_standard",{title:'合金数据库技术规范'}); 			//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user.alloy == 0){ 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	} ;	
  
});

router.get('/get_alloy_standard', function(req, res,next) { //负面清单页面入口
	var path = './public/documents/alloy/alloy_standard';
        // console.log("读报告列表");		
 		 rd.getFileList(path,function(filesList){	
		//   console.log(filesList);	
		 res.jsonp(filesList);	});
		  });


router.get('/public/documents/alloy/alloy_standard/:fileName.:extension', function(req, res){
	
		var file ='./public/documents/alloy/alloy_standard/' + req.params.fileName + '.' + req.params.extension;
		file_name='download'+ '.' + req.params.extension;
	   console.log(file);
	   if(req.session.user.alloy == 1){ 	
			res.download(file, function(err){
				if(err) {
					// Check if headers have been sent
					 res.sendStatus(404);}
				else {
					return res.status(304).end();
					// return res.redirect('/alloy_report'); // 404, maybe 500 depending on err
					}
		
				// Don't need res.end() here since already sent
				
	 		 })
			}
		if(req.session.user.alloy == 0){ 					//到达/home路径首先判断是否已经登录
				res.render("/home"); 			//未登录则重定向到 /login 路径
		} ;		
	});  


	router.get('/graphite_report', function(req, res, next) {
		////console.log(req.session.user.alloy);
		if(req.session.user.alloy == 1){ 					//到达/home路径首先判断是否已经登录
			res.render("graphite_report",{title:'石墨数据库技术报告'}); 			//未登录则重定向到 /login 路径
		} ;	
		if(req.session.user.alloy == 0){ 					//到达/home路径首先判断是否已经登录
			res.render("/home"); 			//未登录则重定向到 /login 路径
		} ;	
	  
	});

	router.get('/public/documents/graphite/:fileName.:extension', function(req, res){
		
			var file ='./public/documents/graphite/' + req.params.fileName + '.' + req.params.extension;
			file_name='download'+ '.' + req.params.extension;
		   console.log(file);
		   if(req.session.user.graphite == 1){ 	
				res.download(file, function(err){
					if(err) {
						// Check if headers have been sent
						 res.sendStatus(404);}
					else {
						return res.status(304).end();
						// return res.redirect('/alloy_report'); // 404, maybe 500 depending on err
						}
			
					// Don't need res.end() here since already sent
					
				  })
				}
		if (req.session.user.graphite == 0){ 					//到达/home路径首先判断是否已经登录
					res.render("/home"); 			//未登录则重定向到 /login 路径
			} ;		
		});  


router.get('/data_graphite', function(req, res, next) {
	if(req.session.user.graphite == 1){ 					//到达/home路径首先判断是否已经登录
		res.render("data_graphite", { title: '石墨数据库', param_id: '1'});  			//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user.graphite == 0){ 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	} ;	
  
});
router.get('/data_graphite/:param_id', function (req, res, next) {
	if (req.session.user.graphite == 1) { 					//到达/home路径首先判断是否已经登录
		res.render("data_graphite", { title: '石墨数据库', param_id: req.params.param_id });  			//未登录则重定向到 /login 路径
	};
	if (req.session.user.graphite == 0) { 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	};

});


router.get('/get_graphite_report', function(req, res,next) { //负面清单页面入口
	var path = './public/documents/graphite';
        // console.log("读报告列表");		
 		 rd.getFileList(path,function(filesList){	
		//   console.log(filesList);	
		 res.jsonp(filesList);	});
		  });

router.get('/data_salt', function(req, res, next) {
	if(req.session.user.salt == 1){ 					//到达/home路径首先判断是否已经登录
		res.render("data_salt", { title: '熔盐数据库', param_id: '2'});  			//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user.salt == 0){ 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	} ;	
   
});
router.get('/data_salt/:param_id', function (req, res, next) {
	////console.log(req.session.user.alloy);
	if (req.session.user.salt == 1) { 					//到达/home路径首先判断是否已经登录
		res.render("data_salt", { title: '熔盐数据库', param_id: req.params.param_id }); 			//未登录则重定向到 /login 路径
	};
	if (req.session.user.salt == 0) { 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	};

});

router.get('/data_salt_mech', function(req, res, next) {
	if(req.session.user.salt_mech == 1){ 					//到达/home路径首先判断是否已经登录
		res.render("data_salt_mech", { title: '熔盐数据库', param_id: '3'});  			//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user.salt_mech == 0){ 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	} ;	
   
});
router.get('/data_salt_mech/:param_id', function (req, res, next) {
	////console.log(req.session.user.alloy);
	if (req.session.user.salt_mech == 1) { 					//到达/home路径首先判断是否已经登录
		res.render("data_salt_mech", { title: '熔盐数据库', param_id: req.params.param_id }); 			//未登录则重定向到 /login 路径
	};
	if (req.session.user.salt_mech == 0) { 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	};

});

router.get('/data_irradiation', function(req, res, next) {
	if(req.session.user.irradiation == 1){ 					//到达/home路径首先判断是否已经登录
		res.render("data_irradiation", { title: '辐照数据库', param_id: 1});  			//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user.irradiation == 0){ 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	} ;		
   
});
router.get('/data_irradiation/:param_id', function (req, res, next) {
	////console.log(req.session.user.alloy);
	if (req.session.user.irradiation == 1) { 					//到达/home路径首先判断是否已经登录
		res.render("data_irradiation", { title: '熔盐数据库', param_id: req.params.param_id }); 			//未登录则重定向到 /login 路径
	};
	if (req.session.user.irradiation == 0) { 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	};

});

router.get('/data_irradiation_graphite', function(req, res, next) {
	if(req.session.user.irradiation == 1){ 					//到达/home路径首先判断是否已经登录
		res.render("data_irradiation_graphite", { title: '石墨辐照数据库', param_id: 2});  			//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user.irradiation == 0){ 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	} ;		
   
});
router.get('/data_irradiation_graphite/:param_id', function (req, res, next) {
	////console.log(req.session.user.alloy);
	if (req.session.user.irradiation == 1) { 					//到达/home路径首先判断是否已经登录
		res.render("data_irradiation_graphite", { title: '石墨熔盐数据库', param_id: req.params.param_id }); 			//未登录则重定向到 /login 路径
	};
	if (req.session.user.irradiation == 0) { 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	};

});


router.get('/data_corrode', function(req, res, next) {
	
	if(req.session.user.corrode == 1){ 
		//console.log('debug corrode');					//到达/home路径首先判断是否已经登录
		res.render("data_corrode", { title: '熔盐数据库', alloy_name: 'GH3535' });   			//未登录则重定向到 /login 路径
	} ;	
	if(req.session.user.corrode == 0){ 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	} ;	
  
});

router.get('/data_corrode/:alloy_name', function (req, res, next) {
	if (req.session.user.corrode == 1) { 					//到达/home路径首先判断是否已经登录
		res.render("data_corrode", { title: '熔盐数据库', alloy_name: req.params.alloy_name.replace(/%20/g, '&#32;')});   			//未登录则重定向到 /login 路径
	};
	if (req.session.user.corrode == 0) { 					//到达/home路径首先判断是否已经登录
		res.render("/home"); 			//未登录则重定向到 /login 路径
	};

});

 router.get('/alloy', function(req, res,next) { //负面清单页面入口
	 var sql = 'select * from alloy_param where id in (select distinct param_id from alloy_param_data) order by id';
	////console.log(sql);
	my_conn.query(sql,function(result){		
		res.jsonp(result.rows);
		// console.log('gooda1');
		
	}); 
});


 router.get('/list50/:param_id', function(req, res,next) { //负面清单页面入口
   	//var sql = 'select * from db_user where username = \'jyq\'' ;
	//var sql = 'SELECT column_name from information_schema.columns where table_name = \'alloy_param_data\'' ;
	var sql1='select param_scope from alloy_param where id=\''+req.params.param_id+'\';';
	 //console.log(sql1);
	 my_conn.query(sql1, function (result) {
		//  res.jsonp(result.rows);
		 ////console.log(result.rows);
		//  console.log(result.rows); 
		 var sql = 'select ' + result.rows[0].param_scope +' from alloy_param_data,alloy_shape,alloy_name,test_direction,alloy_param, alloy_standard_info,alloy_report_info,alloy_batch,alloy_test_org where alloy_param_data.param_id=alloy_param.id and  alloy_param_data.standard_id =alloy_standard_info.id and alloy_param_data.report_id =alloy_report_info.id and alloy_param_data.alloy_batch_id =alloy_batch.id and alloy_param_data.alloy_shape_id =alloy_shape.id and alloy_param_data.test_direction_id =test_direction.id and alloy_param_data.test_org_id =alloy_test_org.id and alloy_param_data.material_name_id =alloy_name.id and param_id=\'' + req.params.param_id + '\'';
		// console.log(sql);
		 my_conn.query(sql, function (result) {
			 res.jsonp(result.rows);
			 ////console.log(result.rows);
			 // console.log('gooda2');
		 });
	 }); 
	  
});



 router.get('/graphite', function(req, res,next) { //负面清单页面入口
	 var sql = 'select * from  graphite_param where id in (select distinct param_id from graphite_param_data) order by id';
	// select * from alloy_param where id in (select distinct param_id from alloy_param_data) order by id
	my_conn.query(sql,function(result){		
		res.jsonp(result.rows);
		//console.log('goodg1');
	}); 
});

router.get('/graphite_irradiant', function(req, res,next) { //负面清单页面入口
	var sql = 'select * from  graphite_irradiant_param where id in (select distinct param_id from graphite_irradiant_data) order by id';
   // select * from alloy_param where id in (select distinct param_id from alloy_param_data) order by id
   my_conn.query(sql,function(result){		
	   res.jsonp(result.rows);
	   //console.log('goodg1');
   }); 
});

router.get('/statistics', function(req, res,next) { //负面清单页面入口
	var sql = 'select n_live_tup from pg_stat_user_tables where relname in (\'alloy_param_data\',\'graphite_param_data\',\'salt_param_data\',\'alloy_irradiant_data\',\'alloy_salt_corrod\',\'salt_mech_data\',\'graphite_irradiant_data\') order by relid';
   // select * from alloy_param where id in (select distinct param_id from alloy_param_data) order by id
   my_conn.query(sql,function(result){		
	   res.jsonp(result.rows);
	   //console.log('goodg1');
   }); 
});

router.get('/gp_list50/:param_id', function (req, res, next) { //负面清单页面入口
	//var sql = 'select * from db_user where username = \'jyq\'' ;
	//var sql = 'SELECT column_name from information_schema.columns where table_name = \'alloy_param_data\'' ;
	var sql1 = 'select param_scope from graphite_param where id=\'' + req.params.param_id + '\';';
	// console.log(sql1);
	my_conn.query(sql1, function (result) {
		//  res.jsonp(result.rows);
		////console.log(result.rows);
		//  console.log(result.rows); 
		var sql = 'select ' + result.rows[0].param_scope + ' from graphite_param_data,graphite_param,graphite_standard_info,graphite_maintainer where graphite_param_data.standard_id =graphite_standard_info.id and graphite_param_data.param_id=graphite_param.id and graphite_maintainer.graphite_maintainer_id=graphite_param_data.maintainer_id and param_id=\'' + req.params.param_id + '\'';
		console.log(sql);
		my_conn.query(sql, function (result) {
			res.jsonp(result.rows);
			////console.log(result.rows);
			// console.log('gooda2');
		});
	});

});


 router.get('/gp_list100', function(req, res,next) { 
    //var sql = 'select * from db_user' ;
	var sql = 'select sample_index,material_grade,material_block_num,material_block_size,material_batch,test_temp,test_temp_span,param_intro,param_value,param_unit,std_num,test_org,material_manufacturer,name from graphite_param_data,graphite_param,graphite_standard_info,graphite_maintainer where graphite_param_data.standard_id =graphite_standard_info.id and graphite_param_data.param_id=graphite_param.id and graphite_maintainer.graphite_maintainer_id=graphite_param_data.maintainer_id';
	////console.log(sql);
	my_conn.query(sql,function(result){		
		res.jsonp(result.rows);
		console.log('goodg3');
	}); 
});


 router.get('/salt', function(req, res,next) { //负面清单页面入口
	var sql = 'select * from  salt_param where param_id in (select distinct param_id from salt_param_data) order by param_id';
	//console.log(sql);
	my_conn.query(sql,function(result){		
		res.jsonp(result.rows);
	}); 
});

router.get('/salt_list50/:param_id', function(req, res,next) { 
   	//var sql = 'select * from db_user where username = \'jyq\'' ;
	//var sql = 'SELECT column_name from information_schema.columns where table_name = \'alloy_param_data\'' ;
	var sql1 = 'select param_scope from salt_param where param_id=\'' + req.params.param_id + '\';';
	console.log(sql1);
	my_conn.query(sql1, function (result) {
		//  res.jsonp(result.rows);
		////console.log(result.rows);
		//  console.log(result.rows); 
		var sql = 'select ' + result.rows[0].param_scope + ' from salt_param_data,salt_param,salt_name where salt_param_data.salt_id=salt_name.salt_id and salt_param_data.param_id=salt_param.param_id and salt_param_data.param_id=\'' + req.params.param_id + '\'';
		//console.log(sql);
		my_conn.query(sql, function (result) {
			res.jsonp(result.rows);
			////console.log(result.rows);
			// console.log('gooda2');
		});
	});
});




 router.get('/irradiation', function(req, res,next) { //负面清单页面入口
	 var sql = 'select * from alloy_irradiant_param where id in (select distinct param_id from alloy_irradiant_data) order by id';
	//console.log(sql);
	my_conn.query(sql,function(result){		
		res.jsonp(result.rows);
	}); 
});



router.get('/irrad_list50/:param_id', function(req, res,next) { 
	//var sql = 'select * from db_user where username = \'jyq\'' ;
 //var sql = 'SELECT column_name from information_schema.columns where table_name = \'alloy_param_data\'' ;
  var sql1 = 'select param_scope from alloy_irradiant_param where id=\'' + req.params.param_id + '\';';
  // console.log(sql1);
  my_conn.query(sql1, function (result) {
	  //  res.jsonp(result.rows);
	  ////console.log(result.rows);
	  //  console.log(result.rows); 
	  var sql = 'select ' + result.rows[0].param_scope + ' from  alloy_irradiant_data,alloy_irradiant_param where alloy_irradiant_data.param_id=alloy_irradiant_param.id  and param_id=\'' + req.params.param_id + '\'';
	  console.log(sql);
	  my_conn.query(sql, function (result) {
		  res.jsonp(result.rows);
		  ////console.log(result.rows);
		  // console.log('gooda2');
	  });
  });

});

router.get('/irradiation_graphite', function(req, res,next) { //负面清单页面入口
	var sql = 'select * from graphite_irradiant_param where param_id in (select distinct param_id from graphite_irradiant_data) order by param_id';
   //console.log(sql);
   my_conn.query(sql,function(result){		
	   res.jsonp(result.rows);
   }); 
});


 router.get('/irrad_graphite_list50/:param_id', function(req, res,next) { 
   	//var sql = 'select * from db_user where username = \'jyq\'' ;
	//var sql = 'SELECT column_name from information_schema.columns where table_name = \'alloy_param_data\'' ;
	 var sql1 = 'select param_scope from graphite_irradiant_param where param_id=\'' + req.params.param_id + '\';';
	 // console.log(sql1);
	 my_conn.query(sql1, function (result) {
		 //  res.jsonp(result.rows);
		 ////console.log(result.rows);
		 //  console.log(result.rows); 
		 var sql = 'select ' + result.rows[0].param_scope + ' from  graphite_irradiant_data,graphite_irradiant_param,filler_id,filler_size_id,forming_process_id,sample_direction_id where graphite_irradiant_data.param_id=graphite_irradiant_param.param_id and graphite_irradiant_data.filler_id=filler_id.filler_id and graphite_irradiant_data.filler_size_id=filler_size_id.filler_size_id  and graphite_irradiant_data.forming_process_id=forming_process_id.forming_process_id  and graphite_irradiant_data.sample_direction_id=sample_direction_id.sample_direction_id  and graphite_irradiant_data.param_id=\'' + req.params.param_id + '\'';
		 console.log(sql);
		 my_conn.query(sql, function (result) {
			 res.jsonp(result.rows);
			 ////console.log(result.rows);
			 // console.log('gooda2');
		 });
	 });

});


 router.get('/corrode', function(req, res,next) { //负面清单页面入口
   	var sql = 'select distinct alloy_name from alloy_salt_corrod';
	//console.log(sql);
	my_conn.query(sql,function(result){		
		res.jsonp(result.rows);
	}); 
});


 router.get('/corrode_list50/:alloy_name', function(req, res,next) { 
   	//var sql = 'select * from db_user where username = \'jyq\'' ;
	//var sql = 'SELECT column_name from information_schema.columns where table_name = \'alloy_param_data\'' ;
	//  ['合金名称', '合金批次', '方法依据', '测试温度', '保温时间', '环境气氛', '坩埚材料', '测试装置', '微观腐蚀深度', 'Cr扩散层深度', '失重换算的腐蚀深度', '数据来源', '数据负责人']; 
	 var sql = 'select "alloy_name","alloy_batch","methods","salt_batch","salt_batch_add","test_temp","duration","environment","crucible","setup","corrdepth_morphology(um)","corrodepth_Cr(um)","corrdepth_weight(um)","references","param_maintainer","upload_time","data_category"  from alloy_salt_corrod' + ' where alloy_name =\'' + req.params.alloy_name + '\';';
	//console.log(sql);
	 my_conn.query(sql,function(result){		
		res.jsonp(result.rows);
		//console.log(result.rows);
	}); 

	
});

router.get('/salt_mech', function(req, res,next) { //负面清单页面入口
	var sql = 'select * from  salt_mech_param where id in (select distinct param_id from salt_mech_data) order by id';
 //console.log(sql);
 my_conn.query(sql,function(result){		
	 res.jsonp(result.rows);
 }); 
});


router.get('/salt_mech_list50/:param_id', function(req, res,next) { 
	//var sql = 'select * from db_user where username = \'jyq\'' ;
 //var sql = 'SELECT column_name from information_schema.columns where table_name = \'alloy_param_data\'' ;
 var sql1 = 'select param_scope from salt_mech_param where id=\'' + req.params.param_id + '\';';
 console.log(sql1);
 my_conn.query(sql1, function (result) {
	 //  res.jsonp(result.rows);
	 ////console.log(result.rows);
	 //  console.log(result.rows); 
	 var sql = 'select ' + result.rows[0].param_scope + ' from salt_mech_data,salt_mech_param where  salt_mech_data.param_id=salt_mech_param.id and salt_mech_data.param_id=\'' + req.params.param_id + '\'';
	 //console.log(sql);
	 my_conn.query(sql, function (result) {
		 res.jsonp(result.rows);
		 ////console.log(result.rows);
		 // console.log('gooda2');
	 });
 });
});


//下面是登陆验证代码
router.route("/login").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
	res.render("login",{title:'MTSR用户登陆'});
		}).post(function(req,res){ 	

	var user =req.body;
	var myDate = new Date();
	var loginTime = myDate.toLocaleString();
   	var sql = 'select * from db_user where username =\'' + user.username + '\' and password = \''+ user.password + '\'';	
		sql_record = 'insert into login_record(user_name,login_time) values (\''+user.username+'\',\''+loginTime+'\')';
	   my_conn.query(sql,function(result){
		////console.log(result.rowCount)
		if(result.rowCount == 0){ 
			//req.session.error = '用户名或密码不正确';
			res.sendStatus(404);							//	状态码返回404
			//	res.redirect("/login");
		}else if(result.rowCount == 1){
			////console.log(result.rows[0].username);
			req.session.user = result.rows[0]; 
			////console.log(result.rows[0]);
			res.sendStatus(200);
			my_conn.query(sql_record,function(result){
				//req.session.user = req.body.username;
				////console.log(req.session.user);
			//	//console.log('good');
				})
		}		
	});				   

		});


router.get("/loginout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
	req.session.user = null;
	req.session.error = null;
	res.redirect("/");
});

router.post('/register',function(req, res) {
	var sql = sq.insertSql(req.body);
	console.log(sql);
	
	////console.log(req.body);
	my_conn.query(sql,function(result){
	//req.session.user = req.body.username;
	////console.log(req.session.user);
	//req.session.user = req.body;
	res.redirect("/");
	});	
});

router.get("/user_exist",function(req,res){ 
    
   	var sql = 'select username from db_user where username =\'' + req.query.username + '\'';
    //var username = req.params.name.slice(1);
	////console.log(req.query.username);
		my_conn.query(sql,function(result){
	//req.session.user = req.body.username;
	////console.log(req.session.user);
	res.send(result);
	});

});

router.get('/role', function(req, res, next) {
	res.render("role",{title:'role'});
  });
  
  
  router.get("/mtsrusers/:id",function(req,res){ //前端页面都要请求/admin/mtseusers/:id ,因为app.js里面的app.use('/admin', admin); var admin = require('./routes/admin');
  ////console.log("test "+req.params.id);
	  var sql ="select * from db_user where auth = " + req.params.id;
	  my_conn.query(sql,function(result){		
		  res.jsonp(result.rows);
		  ////console.log(result);
	  }); 
	});
	
  
	
  router.get("/getUserByName/:name",function(req,res){ //前端页面都要请求/admin/mtseusers/:id ,因为app.js里面的app.use('/admin', admin); var admin = require('./routes/admin');
	  var username = req.params.name;
	  var sql ="select * from db_user where username = \'" + username+'\'';
	  my_conn.query(sql,function(result){		
		  res.jsonp(result.rows);
	  }); 
	});
	
  router.post("/updateRole",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
   var user = req.body;
   for(item in user){//此循环把布尔值转换为0和1
	   if(user[item] == true){
		   user[item] = 1;
	   }else if(user[item] ==false){
		   user[item] = 0;
	   }
   }
		   //console.log(user); 
   var sql = 'UPDATE db_user SET alloy='+ user.alloy+',graphite='+user.graphite+',salt='+user.salt+',irradiation='+user.irradiation+',irradiation_graphite='+user.irradiation_graphite+',corrode='+user.corrode+',salt_mech='+user.salt_mech+',upload='+user.upload+',auth='+user.auth +' WHERE username = \''+user.username+'\'';
  // console.log(sql);
	  my_conn.query(sql,function(result){		
		  res.send(result.rows);
	  }); 
	  
  });

  
  router.post("/modifypass",function(req,res){ //前端页面都要请求/admin/mtseusers/:id ,因为app.js里面的app.use('/admin', admin); var admin = require('./routes/admin');
  //var username = req.params.name;
  //if(req.body)
  ////console.log(req.session.user);
  ////console.log("hahahaha");
  var sql ="update db_user set password = "+req.body.password + " where username = \'" + req.session.user.username+'\'';
  ////console.log(sql);
  my_conn.query(sql,function(result){	
  if(result.rowCount == 1) 
	req.session.user = null;
	req.session.error = null;
	res.redirect("/");
  }); 
});	
		
module.exports = router;
