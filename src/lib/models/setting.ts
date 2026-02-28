import mongoose, { Document, Model, Schema } from 'mongoose'

interface ISetting extends Document {
    key: string
    value: {
        en: string
        ar: string
        he: string
    }
}

const settingSchema = new Schema<ISetting>(
    {
        key: { type: String, required: true, unique: true },
        value: {
            en: { type: String, default: '' },
            ar: { type: String, default: '' },
            he: { type: String, default: '' },
        },
    },
    { timestamps: true }
)

const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>('Setting', settingSchema)

export default Setting
