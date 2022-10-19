export const profileHandler = (req, res, db)=>{
        const { id } = req.params;
        db.select('*').from('users').where({id}).then(user=>{
            user.length ? res.json(user[0])
        : res.status(400).json('Not Found')
        })
        .catch(err=>res.status(400).json('Not Found'))
    }

// module.exports = {
//     profileHandler : this.profileHandler
// }