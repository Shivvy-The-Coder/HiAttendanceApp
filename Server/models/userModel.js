import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    // this user schema will be used for loggin and signup
    name  : {type:String , required:true},
    email : {type:String , requied:true , unique:true},
    password :{ type:String , required:true},

    verifyOtp :  {type:String , default:''},
    verifyOtpExpireAt :{type:String , default:0},
    isAccountVerified :{type:Boolean , default:false},
    resetOTP:{type:String, default:''},
    resetOtpExpireAt : {type:Number , default:0},
});


const userModel = mongoose.model.user || mongoose.model('user',userSchema);
export default userModel;