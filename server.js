import Express from "express";
// import bodyParser from "body-parser"; // ExpressJS comes with Bodyparser
import bcrypt from 'bcrypt-nodejs'
import cors from "cors";
import knex from "knex";
// after moving components to 'controller' directory
import { signInHandler } from './controllers/signin.js'
import { registerHandler } from './controllers/register.js'
import { imageHandler, imageUrlHandler } from './controllers/image.js'
import { profileHandler } from './controllers/profile.js'


const db = knex({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : 'accessblocked@99',
      database : 'facerecognition'
    }
  });

const app = Express();
// app.use(bodyParser.json())
app.use(Express.json()) // Express supports body-parser since ^4.18
app.use(cors())

////////////////// STATIC DATABASE For TESTING ////////////////////
// const database = {
//     users:[
//         {
//             id:12,
//             name:'harry',
//             email:'hogwards@garud.com',
//             password:'magic',
//             entries:0,
//             joined:new Date()
//         },
//         {
//             id:34,
//             name:'ron',
//             email:'hogwards@cheel.com',
//             password:'charm',
//             entries:0,
//             joined:new Date()
//         }
//     ]
// }
/////////////////////////////////////////////////////////////////

// home page 
app.get('/',(req, res)=>{
    // res.send('working fine')
})

// give access to valid user
app.post('/signin', signInHandler(db, bcrypt));
// add/register new user
app.post('/register', (req, res)=>{
    registerHandler(req,res,db,bcrypt);
})
// find a user
app.get('/profile/:id', (req, res)=>{
    profileHandler(req, res, db)
})
// update post count
app.put('/profile/:id/image',(req,res)=>imageHandler(req, res, db))
// face detect API
app.post('/profile/:id/imageUrl', (req, res)=>{
    imageUrlHandler(req, res)
})


// give access to valid user
//........moved to controller directory........//
// app.post('/signin',(req, res)=>{
//     const { Email, Password } = req.body;
    
//     db.select('email','hash').from('login')
//         .where('email','=',Email)
//         .then(data=>{
//             console.log(data);
//             // checking hashed password using bcrypt compareSync()
//             const isUser = bcrypt.compareSync(Password, data[0].hash);
//             console.log(isUser);
//             if(isUser){
//                 return db.select('*').from('users')
//                     .where('email','=',Email)
//                     .then(user=>{
//                       res.json(user[0])
//                     })
//                     .catch(err=>res.status(404).json('User Not Found'))
//             }else{
//                 res.status(404).json('Invalid credentials');
//             }
//         })
//         .catch(err=>res.status(404).json('Invalid credentials'))
// })

// add/register new user
//........moved to controller directory........//
// app.post('/register', async (req, res)=>{
//     // create new user
//     const { Name ,Email, Password } = req.body;
//     const hash = bcrypt.hashSync(Password);
//     // Transaction part
//        db.transaction((trx)=>{
//             trx.insert({
//                 hash: hash,
//                 email: Email,
//             })
//             .into('login')
//             .then(loginId=>{
//                 return trx.table('users')
//                     .insert({
//                         name: Name,
//                         email: Email,
//                         joined: new Date()
//                     })
//                     .then(user=>{{
//                     console.log(user[0]);
//                        return trx('users')
//                         .select('*')
//                         .where('id','=',user[0])
//                         .then(state=> {
//                             res.json(state[0])
//                         })
//                     }})
//                 .catch(err=>res.status(400).json('Not Found'))
//                 })
//             .then(trx.commit)
//             .catch(trx.rollback)
//         })
    
//     /////////// Testing part /////////////////
//     /* Not Working in mySql db */
//         // return db('users')
//         //     .returning('*')
//         //     .insert({
//         //     name:Name,
//         //     email:Email,
//         //     joined:new Date()
//         // })
//         // .then(user =>{
//         //     res.json(user[0])
//         // })
//     //////////////////////////////////////////
//     .catch(err => res.status(400).json('Failed To Registerd'))    
// })

// find a user
//........moved to controller directory........//
// app.get('/profile/:id',(req, res)=>{
//     const { id } = req.params;
//     db.select('*').from('users').where({id}).then(user=>{
//         user.length ? res.json(user[0])
//     : res.status(400).json('Not Found')
//     })
//     .catch(err=>res.status(400).json('Not Found'))
// })

// update post count
//........moved to controller directory........//
// app.put('/profile/:id/image',(req, res)=>{
//     const { id } = req.params;
//         /// updated way
//     db('users').where('id','=',id)
//     .increment('entries',1)
//     .then(
//         entryId=>{
//         db.select('*').from('users').where({id})
//             .then(user=>{
//                 res.json(user[0].entries)
//             })
//             .catch(err=>res.status(404).json('user not found'))
//         })
//     .catch(err=>res.status(400).json('entries failed'))
// })

// password encoder - Bcrypt
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000,()=>{
    console.log('App server is UP on port 3000');
});