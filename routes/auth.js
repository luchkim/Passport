module.exports.isAuth = (req, res, next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.status(404).json({msg: 'You are not Authorized to access...'}) // sends message to browser instead of showing user only contents.
    }
}

module.exports.isAdmin = (req, res, next)=>{
    console.log(req.user);
    if(req.isAuthenticated() && req.user.admin){
        next();
    }
    else{
        res.status(401).json({msg: 'You are not Admin, so you can not view this resource...'})
    }
}