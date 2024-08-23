const dbConnect = require('../libs/dbConnect');
const User = require('../shema/User');
const jwt = require('jsonwebtoken');

exports.saveResult = async (req, res) => {
    try {

        await dbConnect();
        const result = req.body.result;
        const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
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

exports.user = async (req, res) => {
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
};