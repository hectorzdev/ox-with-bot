const dbConnect = require('../libs/dbConnect');
const User = require('../shema/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.saveResult = async (req, res) => {
    try {
        await dbConnect();
        
        const { result, token } = req.body;
        if (!result || !token) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (result === 'win') {
            user.point += 1;
            user.consecutiveWins += 1;

            if (user.consecutiveWins === 3) {
                user.point += 1; 
                user.consecutiveWins = 0;
            }
        } else {
            user.consecutiveWins = 0;
            if (result === 'loss') {
                user.point -= 1;
            }
        }

        await user.save();
        res.status(200).json({ msg: 'Result saved', point: user.point, consecutiveWins: user.consecutiveWins });
        
    } catch (error) {
        res.status(500).json({ msg: 'An unexpected error occurred', error: error.message });
    }
};


exports.user = async (req , res) => {
    try {

        await dbConnect();
        const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({ msg: 'An unexpected error occurred', error: error.message });
    }
}

exports.users = async (req, res) => {
    try {
        await dbConnect();
        const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);

        if (!decoded) {
            throw new Error('Token verification failed');
        }

        const { page = 1, limit = 10 } = req.query; // รับค่า page และ limit จาก query string

        const users = await User.find()
            .sort({ point: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await User.countDocuments();

        res.status(200).json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });

    } catch (error) {
        res.status(500).json({ msg: 'An unexpected error occurred', error: error.message });
    }
}


exports.deleteAccount = async (req, res) => {
    try {

        await dbConnect();
        const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const deletedUser = await User.findByIdAndDelete(userId);
        // ตรวจสอบว่าผู้ใช้ถูกลบหรือไม่
        if (!deletedUser) {
            return res.status(404).json({ msg: 'User not found or could not be deleted' });
        }

        res.status(200).json({ msg: 'Account deleted successfully' });
        
    } catch (error) {
        res.status(500).json({ msg: 'An unexpected error occurred', error: error.message });
    }
};