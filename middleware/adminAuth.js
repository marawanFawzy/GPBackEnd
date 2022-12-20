module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.status(403).redirect('/login')
    }
    else {
        if (!req.session.isAdmin)
            res.status(403).redirect('/')
        else
            next()
    }
}