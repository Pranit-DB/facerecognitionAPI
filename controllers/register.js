
export const registerHandler= (req, res, db, bcrypt) =>{
    // create new user
    const { Name ,Email, Password } = req.body;
    const hash = bcrypt.hashSync(Password);
    // Transaction part
       db.transaction((trx)=>{
            trx.insert({
                hash: hash,
                email: Email,
            })
            .into('login')
            .then(loginId=>{
                return trx.table('users')
                    .insert({
                        name: Name,
                        email: Email,
                        joined: new Date()
                    })
                    .then(user=>{{
                    console.log(user[0]);
                       return trx('users')
                        .select('*')
                        .where('id','=',user[0])
                        .then(state=> {
                            res.json(state[0])
                        })
                    }})
                .catch(err=>res.status(400).json('Not Found'))
                })
            .then(trx.commit)
            .catch(trx.rollback)
        })
    .catch(err => res.status(400).json('Failed To Registerd'))    
    }

// module.exports = {
//     registerHandler:registerHandler
// }