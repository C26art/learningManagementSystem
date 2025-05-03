import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    UserId: {
        type: String,
        required: true,
    },
    CourseId: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    lectureCompleted: [],
}, { minimize: false });

const CourseProgress = mongoose.models.CourseProgress || mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;
