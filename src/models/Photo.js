const mongoose = require("mongoose");
const { Schema } = mongoose;

const photoSchema = new Schema(
    {
        image: { type: String, required: true },
        title: { type: String, required: true },
        likes: [{ type: String, ref: 'User' }],
        comments: [{ type: String, ref: 'Comment' }],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
          userName: { type: String, required: true },
    },
    {
        timestamps: true
    });

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;