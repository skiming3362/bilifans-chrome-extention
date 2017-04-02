'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
* @Author: skiming
* @Date:   2017-03-30 23:11:08
* @Last Modified by:   skiming
* @Last Modified time: 2017-04-02 22:24:28
*/

var Up = function () {
	function Up(mid, pagesize) {
		_classCallCheck(this, Up);

		this.mid = mid;
		this.pagesize = pagesize;
		this.page = 1;
		this.index = 0;
	}

	_createClass(Up, [{
		key: 'getInfo',
		value: function getInfo(mid) {
			var _this = this;

			//获取指定mid用户的信息并构造post对象user_info
			// 从B站获取数据
			console.log('当前mid ' + mid);
			$.ajax({
				url: 'http://space.bilibili.com/ajax/member/GetInfo',
				type: 'POST',
				data: { mid: mid }
			}).done(function (info) {
				// 处理来自B站的数据
				if (!info.status) {
					console.log('未成功获取用户信息！');
					return false;
				}
				var data = info.data;
				_this.user_info = {
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
				_this.postUserInfo();
			});
		}
	}, {
		key: 'getFansList',
		value: function getFansList() {
			var _this2 = this;

			//获取粉丝列表构造post对象user_rela
			$.ajax({
				url: 'http://space.bilibili.com/ajax/friend/GetFansList',
				type: 'GET',
				data: { mid: this.mid, pagesize: this.pagesize, page: this.page }
			}).done(function (info) {
				// 处理来自B站的数据
				if (!info.status) {
					console.log('未成功获取用户信息！');
					return false;
				}
				var data = info.data;
				var sh = setInterval(function () {
					if (_this2.index == data.list.length) {
						clearInterval(sh);
						_this2.page++;
						_this2.list = [];
						_this2.index = 0;
						return;
					}
					_this2.user_rela = {
						user_id: _this2.mid,
						follower_id: data.list[_this2.index].fid
					};
					_this2.postUserRelation();
					_this2.list.push(_this2.user_rela.follower_id);
					console.log('当前list[] ' + _this2.list[_this2.index]);
					console.log('index: ' + _this2.index);
					_this2.getInfo(_this2.list[_this2.index]);
					_this2.index++;
				}, parseInt(300 * Math.random()) + 1200);
				_this2.list = [];
			});
		}
	}, {
		key: 'getTotalpage',
		value: function getTotalpage() {
			var _this3 = this;

			$.ajax({
				url: 'http://space.bilibili.com/ajax/friend/GetFansList',
				type: 'GET',
				data: { mid: this.mid, pagesize: this.pagesize, page: this.page }
			}).done(function (info) {
				_this3.totalpage = info.data.pages;
				console.log('总页数 ' + _this3.totalpage);
				_this3.getFansList();
				console.log('当前页数 ' + _this3.page);
				var sa = setInterval(function () {
					_this3.getFansList();
					console.log('当前页数 ' + _this3.page);
					if (_this3.page == _this3.totalpage) {
						clearInterval(sa);
						console.log('done!');
						return;
					}
				}, 150000);
			});
		}
	}, {
		key: 'postUserRelation',
		value: function postUserRelation() {
			$.ajax({
				url: 'http://127.0.0.1:9000/api/UserRelation',
				type: 'POST',
				data: this.user_rela,
				crossDomain: true
			}).done(function (data) {
				console.log("post UserRelation: " + data.follower_id + " success");
			}).fail(function (e) {
				console.log("error: " + JSON.stringify(e));
			});
		}
	}, {
		key: 'postUserInfo',
		value: function postUserInfo() {
			$.ajax({
				url: 'http://127.0.0.1:9000/api/UserInfo',
				type: 'POST',
				data: this.user_info,
				crossDomain: true
			}).done(function (data) {
				console.log("post UserInfo: " + data.mid + " success");
			}).fail(function (e) {
				console.log("error: " + JSON.stringify(e));
			});
		}
	}, {
		key: 'start',
		value: function start() {
			this.getInfo(this.mid);
			this.getTotalpage();
		}
	}]);

	return Up;
}();

$(function () {
	new Up('116568', '100').start();
});
