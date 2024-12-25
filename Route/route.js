const express=require('express')
const route=express.Router()
const usersModel=require('../Model/usersSchema')
const exercisesModel=require('../Model/exercisesSchema')


route.post('/api/users',async(req, res)=> {
        const { username } = req.body; // Extract username from the request body
        try {
          // Checking if the username already exists in the database
          const usernameExist = await usersModel.findOne({ username });
          if (usernameExist) {
            return res.status(400).json({ message: 'Username already exists, please choose another one' });
          }
      
          // Creating a new user in the database
          const savedUser = await usersModel.create({ username });
          return res.status(201).json(savedUser); // Return the saved user
        } catch (error) {
          console.error('Error during signup:', error);
          return res.status(500).json({ message: 'Server error', error: error.message });
        }
      }
    )
    route.get('/api/users', async (req, res) => {
        try {
          // Fetching all users from the database
          const users = await usersModel.find({});
          return res.status(200).json(users); // Return array  list of users
        } catch (error) {
          console.error('Error fetching users:', error);
          return res.status(500).json({ message: 'Server error', error: error.message });
        }
      });
   

    route.post('/api/users/:_id/exercises', async (req, res) => {
        const { _id } = req.params; // Extract user ID from URL
        const { description, duration, date } = req.body; // Extract form data from request body
      
        try {
          
          const user = await usersModel.findById(_id);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
        
          const exercise = new exercisesModel({
            userId: _id,
            description,
            duration: parseInt(duration, 10),
            date: date ? new Date(date) : new Date(),
          });
      
        
          const savedExercise = await exercise.save();
      
    
          res.status(201).json({
            _id: user._id,
            username: user.username,
            description: savedExercise.description,
            duration: savedExercise.duration,
            date: savedExercise.date.toDateString(), // Format date
          });
        } catch (error) {
          console.error('Error adding exercise:', error);
          res.status(500).json({ message: 'Server error', error: error.message });
        }
      });
      
   
    route.get('/api/users/:id/logs', async (req, res) => {
        const id = req.params.id;
        const { from, to, limit } = req.query; 
      
        try {
          // Finding the user by ID
          const user = await usersModel.findById(id);
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Getting all exercises for the user
          let logs = await exercisesModel.find({ userId: id });
      
          // Filtering logs by "from" and "to" dates if given
          if (from) {
            logs = logs.filter(function(log) {
              return new Date(log.date) >= new Date(from);
            });
          }
      
          if (to) {
            logs = logs.filter(function(log) {
              return new Date(log.date) <= new Date(to);
            });
          }
      
          
          if (limit) {
            logs = logs.slice(0, limit);
          }
      
          
          const logsToReturn = logs.map(function(log) {
            return {
              description: log.description,
              duration: log.duration,
              date: new Date(log.date).toDateString(),
            };
          });
      
          // Sending the response
          res.status(200).json({
            _id: user._id,
            username: user.username,
            count: logsToReturn.length,
            log: logsToReturn,
          });
        } catch (error) {
          console.log('Error:', error);
          res.status(500).json({ message: 'Error', error: error.message });
        }
      });
      
module.exports=route