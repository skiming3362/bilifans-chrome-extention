
class Up {

	constructor(mid,pagesize) {
		this.mid = mid;
		this.pagesize = pagesize;
		this.page = 1;
		this.index = 0;
	}
	
	

	getInfo(mid){//获取指定mid用户的信息并构造post对象user_info
		// 从B站获取数据
			console.log('当前mid '+mid);
			$.ajax({
				url: 'http://space.bilibili.com/ajax/member/GetInfo',
				type: 'POST',
				data: {mid: mid}
			}).done((info)=>{
				// 处理来自B站的数据
				if(! info.status){
					console.log('未成功获取用户信息！');
					return false;
				}
				var data = info.data, user_info;
				user_info = {
					mid: mid,
					name: data.name,
					regtime: data.regtime || 0,
					sex: data.sex,
					place: data.place || '',
					level: data.level_info.current_level,
					approve: data.official_verify.type,
					attention_num: data.attention,
					sign: data.sign,
					description: data.description,
					face: data.face,
					fans_num: data.fans,
					play_num: data.playNum,
					rank: data.rank
				};
				this.postUserInfo(user_info);
			})		
	}

	getFansList(){//获取粉丝列表构造post对象user_rela
		$.ajax({
			url: 'http://space.bilibili.com/ajax/friend/GetFansList',
			type: 'GET',
			data: {mid: this.mid, pagesize: this.pagesize, page: this.page}
		}).done((info)=>{
			// 处理来自B站的数据
			if(! info.status){
				console.log('未成功获取用户信息！');
				return false;
			}
			var data = info.data;
			var sh = setInterval(()=>{
				if(this.index==data.list.length){
					clearInterval(sh);
					this.page++;		
					this.list = [];
					this.index = 0;
					return;
				}
				this.user_rela = {
					user_id: this.mid,
					follower_id: data.list[this.index].fid
				};
				this.postUserRelation();
				this.list.push(this.user_rela.follower_id);
				console.log('当前list[] '+this.list[this.index]);
				console.log('index: '+this.index);
				this.getInfo(this.list[this.index]);
				this.index++;
			}, parseInt(1000*(Math.random()))+1000)
			this.list = [];

			
		})		
	}

	getTotalpage(){//先获取up主信息
		$.ajax({
				url: 'http://space.bilibili.com/ajax/friend/GetFansList',
				type: 'GET',
				data: {mid: this.mid, pagesize: this.pagesize, page: this.page}
			}).done((info)=>{
				this.totalpage = info.data.pages;
				console.log('总页数 '+this.totalpage);
				this.getFansList();
				console.log('当前页数 '+this.page);
				var sa = setInterval(()=>{
					this.getFansList();
					console.log('当前页数 '+this.page);
					if(this.page==this.totalpage){
						clearInterval(sa);
						console.log('done!')
						return;
					}
				}, 200000)	
			})
	}
    
	postUserRelation(){
		$.ajax({
			url: 'http://127.0.0.1:9000/api/UserRelation',
			type: 'POST',
			data: this.user_rela,
			crossDomain: true
		})
		.done(() => {
			console.log("success");
		})
		.fail((e) => {
			console.log("error: "+JSON.stringify(e));
		});
		
	}

	postUserInfo(userInfo){
		$.ajax({
			url: 'http://127.0.0.1:9000/api/UserInfo',
			type: 'POST',
			data: userInfo,
			crossDomain: true
		})
		.done(() => {
			console.log("success");
		})
		.fail((e) => {
			console.log("error: "+JSON.stringify(e));
		});	
	}

	start(){
		this.getInfo(this.mid);
		this.getTotalpage();	
	}
}

$(function(){
	new Up('116568','100').start();
});

