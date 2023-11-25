const nanoid = require('nanoid');

module.exports = {
    /**
     *
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import('../../../../config/web.json')} web
     * @param {import('../../../../config/static.json')} bot
     */
    run(req, res, web, bot) {
        if (req.signedCookies.state) res.clearCookie('stateParam');
        const state = nanoid(14);
        res.cookie('stateParam', state, {
            maxAge: 1000 * 60 * 5,
            signed: true,
        });

        const query = new URLSearchParams({
            client_id: bot.CLIENT.ID,
            redirect_uri: web.REDIRECTS.local,
            response_type: 'code',
            scope: 'identify guilds guilds.members.read',
            state: state,
        }).toString();

        return res.redirect(
            `https://discord.com/api/oauth2/authorize?${query}`
        );
    },
};
