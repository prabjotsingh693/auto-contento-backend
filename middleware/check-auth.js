const jwt = require('jsonwebtoken')

const HttpError = require('../modal/http-error')

module.exports = (req, res, next)=>{
    
    if(req.method === 'OPTIONS'){        
        return next()
    }
    let token;
    try{
        token = req.headers.authorization.split(' ')[1];
        if(!token){
            throw new Error('Auth failed')
        }

        const decoderToken = jwt.verify(token, "make_summary_easy")
        req.userData = {userId : decoderToken.userId}
        next()

    }catch(err){
        const error = new HttpError("Auth failed", 500);
        return next(error);
    }
}