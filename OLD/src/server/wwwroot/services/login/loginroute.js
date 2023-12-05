module.exports = {
    run(req, res) {
        res.status(200).sendFile('/src/public/pages/login.html', {
            root: '.',
        });
    },
};
