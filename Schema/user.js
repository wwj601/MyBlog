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
  articleNum: Number,
  commentNum: Number
},{versionKey:false})

module.exports = UserSchema