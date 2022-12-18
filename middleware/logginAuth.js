module.exports = (req, res, next) => {
    console.log(req.session)
    if (!req.session.isLoggedIn)
        res.redirect('/login')
    else
        next()
}