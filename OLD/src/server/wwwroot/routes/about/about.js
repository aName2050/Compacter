module.exports = {
    run(req, res) {
        res.status(503).sendFile('/src/public/pages/error_pages/503.html', {
            root: '.',
        });
    },
};
