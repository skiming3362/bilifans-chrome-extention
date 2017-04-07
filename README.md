# bilifans-chrome-extention
chrome插件 抓取<b style="">已登录UP主</b>B站粉丝数据的爬虫,将JSON数据中的有用数据解析存放进数据库  
每页粉丝数默认100，每3分钟获取一页粉丝列表，1.6秒左右获取一位粉丝信息，暂时只能一次跑完所有数据
## B站API
### 获取指定mid用户的信息
<pre>
url: http://space.bilibili.com/ajax/member/GetInfo
type: "POST"
data: {mid: Str}
format: {
  status: Boolean,                             #为true时才能获取data
  data: {
    DisplayRank: Str,                          #用户标识, 从 rank 衍生出, 影响实际显示的头像边框等
    approve: Boolean,                          #是否为认证帐号
    article: Num,                              #未知，  0
    attention: Num,                            #关注数
    attentions: Array,                         #关注mid列表
    birthday: "****-**-**",                    #生日，默认为0000-01-01
    coins: Num,                                #未知，0
    description: Str,                          #认证用户为认证信息，普通用户为交友宣言
    face: Str,                                 #小头像地址
    fans: Num,                                 #粉丝数
    friend: Num,                               #好友数，同关注数
    im9_sign: Str,                             #未知
    level_info: {
      current_exp: Num,                        #当前经验值
      current_level: Num,                      #当前等级
      current_min: Num,                        #到达当前等级需要的经验值
      next_exp: Num                            #到达下一级需要的经验值
    },
    mid: Str,                                  #会员id
    name: Str,                                 #昵称
    nameplate: {
      condition: Str,                          #勋章描述
      image: Str,                              #勋章图片
      image_small: Str,                        #勋章图片小
      level: Str,                              #勋章等级
      name: Str,                               #勋章名称
      nid: Num                                 #勋章id
    },
    official_verify:{
      desc: Str,                               #认证用户为认证信息
      type: Num                                #未认证为-1，个人认证0，团体认证1
    },
    pendent: {
      expire: Num,                             #过期时间，timestamp
      image: Str,                              #图像
      name: Str,                               #挂件名称
      pid: Num                                 #挂件id
    },
    place: Str,                                #所在地
    playNum: Num,                              #视频总播放量
    rank: Str,                                 #32000: 站长 – 有权限获取所有视频信息 (包括未通过审核
                                               和审核中的视频) 
					       *31000: 职人 
                                               *20000: 字幕君 – 有权限发送逆向弹幕 
                                               *10000: 普通用户
    regtime: Num,                              #注册时间，timestamp
    sex: Str,                                  #性别
    sign: Str,                                 #简介   
    spacesta: Num,                             #未知，0
    theme: Str,                                #主题
    theme_preview: Str,                        #主题预览
    toutu: Str,                                #头图
    toutuId: Num                               #头图id
  }
}
</pre>
### 获取粉丝列表
<pre>
url: http://space.bilibili.com/ajax/friend/GetFansList
type: "GET"
data: {mid: Num,pagesize: Num,page: Num}       #查询up主mid,每页显示粉丝数，粉丝页数
format:{
  status: Boolean,                             #为true时才能获取data
  data:{
    pages: Num,                                #粉丝页数，与pagesize有关
    results: Num,                              #粉丝数
    list: [                                    #粉丝Array,总数为pagesize,最大为100
      0: {
        addtime: Timestamp,                    #关注时间
        attentioned: Num,        	       #相互关注
        face: Str,               	       #头像
        fid: Num,                	       #粉丝uid
        is_charge: false,        	       #是否充电
        official_verify:{
          desc: Str,       		       #认证用户为认证信息
          type: Num        		       #未认证为-1，个人认证0，团体认证1
        },
        record_id: Num,         	       #未知
        uname: Str                             #粉丝昵称
      },
      1:{
      },
      …
    ]
  }
}
</pre>
## 本地web服务器API
### post 用户关系
<pre>
url: 'http://127.0.0.1:9000/api/UserRelation',
type: 'POST',
data: {
  user_id: Num,				UP主MID
  follower_id: Num,			关注者MID
  addtime: Timestamp,			关注时间
  charge: Boolean,			是否充电
  attentioned: Num			相互关注
}
</pre>
### post 用户信息
<pre>
url: 'http://127.0.0.1:9000/api/UserInfo',
type: 'POST',
data: {
  mid: Num,                             用户MID
  name: Str,                            昵称
  regtime: timestamp,                   注册时间
  sex: Str,                             性别
  place: Str,                           地址
  level: Num,                           等级
  approve: Num,                         认证
  attention_num: Num,                   关注数
  sign: Str,                            签名
  description: Str,                     简介
  face: Str,                            头像地址
  fans_num: Num,                        粉丝数
  play_num: Num,                        视频播放数
  rank: Num                             权限
}
</pre>
