// sign in
export function signInHandler(db, bcrypt) {
    return (req, res) => {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json('Incorrect form submission');
        }

        db.select('email', 'hash').from('login')
            .where('email', '=', Email)
            .then(data => {
                // checking hashed password using bcrypt compareSync()
                const isUser = bcrypt.compareSync(Password, data[0].hash);
                console.log(isUser);
                if (isUser) {
                    return db.select('*').from('users')
                        .where('email', '=', Email)
                        .then(user => {
                            res.json(user);
                        })
                        .catch(err => res.status(404).json('User Not Found'));
                } else {
                    res.status(404).json('Invalid credentials');
                }
            })
            .catch(err => res.status(404).json('Invalid credentials'));
    };
}

// module.exports = {
//     signInHandler : signInHandler
// }