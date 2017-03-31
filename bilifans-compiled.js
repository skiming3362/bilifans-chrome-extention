'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
			setTimeout(function () {
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
					var data = info.data,
					    user_info;
					user_info = {
						mid: mid,
						name: data.name,
						regtime: data.regtime,
						sex: data.sex,
						place: data.place,
						level: data.level_info.current_level,
						birthday: data.birthday,
						approve: data.official_verify.type,
						attention_num: data.attention,
						sign: data.sign,
						description: data.description,
						face: data.face,
						fans_num: data.fans,
						play_num: data.playNum,
						rank: data.rank
					};
					_this.postUserInfo(user_info);
				});
			}, 100);
		}
	}, {
		key: 'getFansList',
		value: function getFansList() {
			var _this2 = this;

			//获取粉丝列表构造post对象user_rela
			setTimeout(function () {
				$.ajax({
					url: 'http://space.bilibili.com/ajax/friend/GetFansList',
					type: 'GET',
					data: { mid: _this2.mid, pagesize: _this2.pagesize, page: _this2.page }
				}).done(function (info) {
					// 处理来自B站的数据
					if (!info.status) {
						console.log('未成功获取用户信息！');
						return false;
					}
					var data = info.data;
					setInterval(function () {
						if (_this2.index < _this2.pagesize) {
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
						}
					}, 1000);
					_this2.page++;
					_this2.list = [];
					_this2.index = 0;
				});
			}, 100);
		}
	}, {
		key: 'getTotalpage',
		value: function getTotalpage() {
			var _this3 = this;

			//先获取up主信息
			$.ajax({
				url: 'http://space.bilibili.com/ajax/friend/GetFansList',
				type: 'GET',
				data: { mid: this.mid, pagesize: this.pagesize, page: this.page }
			}).done(function (info) {
				_this3.totalpage = info.data.pages;
				console.log(_this3.totalpage);
				setInterval(function () {
					if (_this3.page <= _this3.totalpage) {
						_this3.getFansList();
					}
				}, 50000);
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
			}).done(function () {
				console.log("success");
			}).fail(function (e) {
				console.log("error: " + JSON.stringify(e));
			});
		}
	}, {
		key: 'postUserInfo',
		value: function postUserInfo(userInfo) {
			$.ajax({
				url: 'http://127.0.0.1:9000/api/UserInfo',
				type: 'POST',
				data: userInfo,
				crossDomain: true
			}).done(function () {
				console.log("success");
			}).fail(function (e) {
				console.log("error: " + JSON.stringify(e));
			});
		}
	}, {
		key: 'start',
		value: function start() {
			this.getTotalpage();
		}
	}]);

	return Up;
}();

$(function () {
	new Up('116568', '100').start();
});
