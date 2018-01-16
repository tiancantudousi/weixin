function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg); //匹配目标参数
		if(r != null) return unescape(r[2]);
		return null; //返回参数值
}
			
var app=angular.module('mynew',['ng']);
app.controller('controall',['$scope','$http',function($scope,$http){
	var swiperurl=window.location.href;
	
//	生产环境
	var id=getUrlParam('openid');
	var ket=getUrlParam('ticket');
//	测试环境
//  var id=6547;
//	var ket='gQGj8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAySjFfX3BoM2xlYzIxZ21SdzFxMTgAAgQXqDhaAwT-jCcA';
	var guide="record";
	var postCfg = {headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}};
	$http.post("../GetPatientStudys.aspx",$.param({openid:id,ticket:ket,guide:guide}),postCfg).success(function(res){
			$scope.checkrecordlist=res;	
			var str=JSON.stringify($scope.checkrecordlist[0].Films); 
			$scope.recordnum=res.length;
			$('.reloading').hide();
	});
	
//	$http.post("http://cloud-test-oss.jianpeicn.com/GetPatientStudys.aspx",$.param({openid:id,ticket:ket,guide:guide}),postCfg).success(function(res){
//			$scope.checkrecordlist=res;	
//			var str=JSON.stringify($scope.checkrecordlist[0].Films); 
//			$scope.recordnum=res.length;
//			$('.reloading').hide();
//	});
	$scope.swipershow=false;
	$scope.imgonclick=function(index,n){
		$scope.swipershow=false;
		var imglist=null;
		switch(n){
			case 0:imglist=JSON.stringify(checkblankimg($scope.checkrecordlist[index].Reports));		
			break;
			case 1:imglist=JSON.stringify(checkblankimg($scope.checkrecordlist[index].Films));
			break;
		}
		sessionStorage.setItem("imglist", imglist);
		sessionStorage.setItem("imgscale",[$scope.checkrecordlist[index].FilmHeight,$scope.checkrecordlist[index].FilmWidth]);
		location.href=`swiper.html?openid=${id}&ticket=${ket}&guide=${guide}`;
	}
	$scope.closeswiper=function(){
		$scope.swipershow=true;
	}	
}]);
app.filter('checkimg',function(){
	return function(input){
		var output=input;
		if(input==''||input==null){
			output='img/noimg.png';
		}
		return output;
	}
});

app.filter('divshow',function(){
	return function(input){

		if(!input){
			output=false;
		}
		else{
			output=true;
		}
		return output;
	}
});

//处理图片不存在时的情况
function checkblankimg(arr){
	for(val of arr){
		if(val.url==''||val.url==null){
			val.url='img/cantloadimg.jpg';
		}
	}
	return arr;
}

