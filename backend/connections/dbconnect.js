// const mongoose = require('mongoose');
import mongoose from 'mongoose';

export const connection = async ()=>{
    try {
        // await mongoose.connect('mongodb://127.0.0.1:27017/bible_quiz')
        await mongoose.connect('mongodb+srv://keithmbofana1:biBle0_2025@biblequize.egdc4xy.mongodb.net/?retryWrites=true&w=majority&appName=bibleQuize')
        console.log('connected to mongodb')
    } catch (error) {
        console.log(error)
    } 
}
