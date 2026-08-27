import mongoose, {Schema} from "mongoose";

const checklogSchema = new Schema(
    {
        monitorId: {
            type: Schema.Types.ObjectId,
            ref: "Monitor",
            required: true
        },
        status: {
            type: String,
            enum: ["up", "down"],
            required: true
        },
        responseTime: {
            type: Number,
        },
        statusCode: {
            type: Number,
        }
    },
    {
        timestamps: true
    }
)

export const Checklog = mongoose.model("Checklog", checklogSchema)
