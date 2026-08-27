import mongoose,{Schema} from "mongoose";

const monitorSchema = new Schema(
    {
        user : {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        url: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required:true,
            trim: true
        },
        tobeMonitored: {
            type: Boolean,
            default: true
        },
        currentStatus: {
            type: String,
            enum: ["up", "down", "unchecked"],
            default: "unchecked"
        },
        responseTime: {
            type: Number,
        },
        statusCode: {
            type: Number,
        },
        lastChecked: {
            type: Date
        }
    },
    {
        timestamps:true
    }
)
monitorSchema.index({ user: 1, url: 1 }, { unique: true })

export const Monitor = mongoose.model("Monitor",monitorSchema)