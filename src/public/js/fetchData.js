var accessToken = window.atob(localStorage.getItem('accessToken'));

!(async function () {
    await getData();
})();

async function getData() {
    if (!accessToken) return (window.location = '/login');
    if (sessionStorage.getItem('guilds') && sessionStorage.getItem('user'))
        return;

    var apiURLs = [
        'https://discord.com/api/users/@me',
        'https://discord.com/api/users/@me/guilds',
    ];

    // Fetch joined guilds and user data
    var userReq = fetch(apiURLs[0], {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        }),
        guildReq = fetch(apiURLs[1], {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });

    var [userRaw, guildsRaw] = await Promise.all([userReq, guildReq]);

    var [user, guilds] = await Promise.all([
        await userRaw.json(),
        await guildsRaw.json(),
    ]);

    if (user.message != undefined) {
        if (user.message.startsWith('401')) return (window.location = '/login');
    }
    if (guilds.message != undefined) {
        if (guilds.message.startsWith('401'))
            return (window.location = '/login');
    }

    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('guilds', JSON.stringify(guilds));
    window.location.reload();
}
