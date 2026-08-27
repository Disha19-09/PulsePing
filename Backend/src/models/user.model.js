import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bycrpt from "bcrypt";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [true , 'password is required']
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function(){
    if(! this.isModified("password")) return ;

    this.password = await bycrpt.hash(this.password, 10)
    
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bycrpt.compare(password, this.password) 
}

userSchema.methods.generateAccessTokens = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.EXPIRY_ACCESS_TOKEN
        }
    )
}

userSchema.methods.generateRefreshTokens = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.EXPIRY_REFRESH_TOKEN
        }
    )
}

export const User = mongoose.model("User", userSchema)