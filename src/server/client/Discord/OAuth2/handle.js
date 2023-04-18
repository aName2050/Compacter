const { request } = require('undici');
const { sendError } = require('../../../../util/helpers/sendError');

module.exports = {
    /**
     *
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import('../../../../../config/web.json')} web
     * @param {import('../../../../../config/bot.json')} bot
     */
    async run(req, res, web, bot) {
        const { code, state } = req.query;
        const { stateParam } = req.signedCookies;

        if (state !== stateParam) return sendError(req, res, 403);

        if (code) {
            try {
                const response = await request(
                    'https://discord.com/api/oauth2/token',
                    {
                        method: 'POST',
                        body: new URLSearchParams({
                            client_id: bot.CLIENT.ID,
                            client_secret: bot.CLIENT.SECRET,
                            code,
                            grant_type: 'authorization_code',
                            redirect_uri: `${web.REDIRECTS.local}`,
                            scope: 'identify guilds guilds.members.read',
                        }).toString(),
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                        },
                    }
                );
                const data = await response.body.json();
                if (data.error) {
                    if (data.error === 'invalid_grant')
                        return res.redirect('/login');
                    else return sendError(req, res, 500);
                }
                const expires = Date.now() + data.expires_in;
                return res.send(`
                    <script>
                        localStorage.setItem("accessToken", window.btoa('${data.access_token}').toString());
                        localStorage.setItem("refreshToken", window.btoa('${data.refresh_token}').toString());
                        localStorage.setItem("expires", ${expires});
					    window.location = '/dashboard';
                    </script>
                `);
            } catch (err) {
                console.log(err);
            }
        } else {
            res.sendStatus(400);
        }
    },
};
