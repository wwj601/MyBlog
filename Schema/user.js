const {Schema} = require('./config')

const UserSchema = new Schema({
  username:String,
  password:String,
  // 管理员权限
  role: {
    type: String,
    default: 1
  },
  avatar:{
    type:String,
    default:'/avatar/default.jpg'
  },
  articleNum: {//默认文章数0
    type:Number,
    default:0
  },
  commentNum: {//默认评论数0
    type:Number,
    default:0
  }
},{versionKey:false})

module.exports = UserSchema