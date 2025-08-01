import { clerkClient } from '@clerk/express';
import Course from '../models/courseModel.js';
import { v2 as cloudinary } from 'cloudinary';
import Purchase from '../models/purchaseModel.js';
import User from '../models/userModel.js';

export const updateRoleToEducator = async (req, res) => {

    try {
        const userId = req.auth.userId;
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: { role: 'educator' }
        });
        res.json({ success: true, message: "You can publish a course now" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//Add a new Course

export const addCourse = async (req, res) => {

    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.json({ success: false, message: "Thumbnail not Attached" });
        }
        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;
        const newCourse = await Course.create(parsedCourseData);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();

        res.json({ success: true, message: "Course Created Successfully", course: newCourse });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get educator Courses
export const getEducatorCourses = async (req, res) => {

    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        res.json({ success: true, courses });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Educator Dashboard Data (Total Earning, Enrolled Students, No. Courses)
export const educatorDashboardData = async (req, res) => {

    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;

        const coursesIds = courses.map(course => course._id);

        //calculate total earnings from purchases
        const purchases = await Purchase.find({ courseId: { $in: coursesIds }, status: 'completed' });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        //Collect unique enrolled students IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({ _id: { $in: course.enrolledStudents } }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true, dashboardData: {
                totalCourses,
                totalEarnings,
                enrolledStudentsData
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get enrolled students data with Purchase data
export const getEnrolledStudentsData = async (req, res) => {

    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);
        const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudentsData = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt,
        }));

        res.json({ success: true, enrolledStudentsData });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}