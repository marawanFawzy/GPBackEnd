module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn)
        res.status(403).redirect('/login')
    else
        next()
}