import Clarifai from 'clarifai'

const { id } = req.params;
    /// updated way
db('users').where('id','=',id)
.increment('entries',1)
.then(
    ()=>{
    db.select('*').from('users').where({id})
        .then(user=>{
            res.json(user[0].entries)
        })
        .catch(err=>res.status(404).json('user not found'))
    })
.catch(err=>res.status(400).json('entries failed'))
}
    
const app = new Clarifai.App({
      apiKey : 'YOUR CLARIFAI KEY'
})
    //TODO: fetch imgurl from server
export const imageUrlHandler = (req, res)=>{
    app.models
        .predict(
        // 'a403429f2ddf4b49b307e318f00e528b', // this should work
        Clarifai.FACE_DETECT_MODEL,  //   if this isn't
        req.body.input // here we are fetching imageURL
        )
        .then(response => {
            res.json(response)  
        })
       .catch(err => console.log(err,' API CALL FAILED!'));
}
