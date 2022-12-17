const path = require('path')
exports.home = (req, res, next) => {
    console.log("home");
    res.render('home', {
        pageTitle: 'home page',
        name: 'marawan',
        path: '/home'
    });
};
exports.upload = (req, res, next) => {
    const image = req.file;
    console.log(req.body);
    console.log(req.file);
    if (!image) {
        return res.status(422).render('home', {
            pageTitle: 'home page',
            name: 'Attached file is not an image.',
            path: '/home'
        });
    }
    else {
        return res.status(201).render('home', {
            pageTitle: 'home page',
            name: 'uploaded',
            path: '/home'
        });
    }
}