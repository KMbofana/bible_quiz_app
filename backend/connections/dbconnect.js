// const mongoose = require('mongoose');
import mongoose from 'mongoose';

export const connection = async ()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/bible_quiz')
        console.log('mongodb connection')
    } catch (error) {
        console.log(error)
    } 


}
