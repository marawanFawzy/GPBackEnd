module.exports = (req, res, next) => {
    console.log(req.session)
    if (!req.session.isAdmin)
        if (!req.session.isLoggedIn)
            res.redirect('/login')
        else
            res.redirect('/home')
    else
        next()
}