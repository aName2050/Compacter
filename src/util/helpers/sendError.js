function sendError(req, res, code) {
    res.status(code).sendFile(`/src/public/pages/error_pages/${code}.html`, {
        root: '.',
    });
}

module.exports = { sendError };
