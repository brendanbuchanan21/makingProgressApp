import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const bodyWeightSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true
    }
}, { timestamps: true});

const bodyWeightModel = mongoose.model('bodyWeightModel', bodyWeightSchema);
export default bodyWeightModel;