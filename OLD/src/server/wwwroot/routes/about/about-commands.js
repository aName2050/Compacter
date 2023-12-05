module.exports = {
    /**
     *
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    run(req, res) {
        res.status(200).sendFile('/src/public/pages/commands.html', {
            root: '.',
        });
    },
};
