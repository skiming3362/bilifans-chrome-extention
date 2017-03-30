$(function(){
	$.ajax({
		url: 'http://space.bilibili.com/ajax/member/GetInfo',
		type: 'POST',
		data: {mid: '13363787'}
	}).done(function(info){
		console.log(info);
	})
});