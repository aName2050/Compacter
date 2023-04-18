var templateHTML = `
<div class="accordion-item">
    <h2
        class="accordion-header"
        id="flush-headingOne"
    >
        <button
            class="accordion-button collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#id-{{guild_id}}"
        >
            <span class="guild-image"
                ><img
                    src="{{icon}}"
                    alt="{{guild_name}}"
                    style="
                    width: 60%;
                    border: 1px solid black;
                    border-radius: 50px;
                    "
                />
            </span>
            <span
                class="guild-name"
                style="color: black;"
                >{{fGuildName}}</span
            >
            <style>
                .guild-name {
                    display: flex;
                    align-content: left
                }
            </style>
        </button>
    </h2>
    <div
        id="id-{{guild_id}}"
        class="accordion-collapse collapse"
        data-bs-parent="#guild-{{guild_id}}"
    >
        <div class="accordion-body">
            <button
                class="btn btn-dark"
                style="margin-right: 5px"
            >
                <a href="/dashboard/guilds/{{guild_id}}/manage" style="text-decoration: none; color: inherit">Manage</a>
            </button>
            <button class="btn btn-info">
                <a href="/bot/invite?guild={{guild_id}}" style="text-decoration: none; color: inherit">Invite</a>
            </button>
            <div class="mt-3"></div>
            <h4>{{Perm}}</h4>
        </div>
    </div>
</div>
`;

!(function handle() {
    var guilds = JSON.parse(sessionStorage.getItem('guilds'));
    if (!guilds) return;

    var ownedSection = document.getElementById('owner');
    var managedSection = document.getElementById('managed');
    var adminSection = document.getElementById('admin');

    var anySection = document.getElementById('guildsList');

    guilds.forEach((guild) => {
        fetch(`/api/get/permissions?int=${guild.permissions}`).then(
            async (r) => {
                var res = await r.json();

                if (res.ManageGuilds || res.Administrator) {
                    var guildItem = document.createElement('div');

                    var newHTML = templateHTML
                        .replace(
                            /{{icon}}/g,
                            `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                        )
                        .replace(/{{guild_name}}/g, guild.name.toLowerCase())
                        .replace(/{{guild_id}}/g, guild.id)
                        .replace(/{{fGuildName}}/g, guild.name)
                        .replace(
                            /{{Perm}}/g,
                            guild.owner
                                ? 'You own this server'
                                : res.Administrator
                                ? 'You moderate this server'
                                : res.ManageGuild
                                ? 'You manage this server'
                                : 'Failed to fetch permission level'
                        );

                    guildItem.classList = ['accordion accordion-flush mt-2'];
                    guildItem.id = guild.id;
                    guildItem.innerHTML = newHTML;
                    // var manageBtn = document.querySelector('');

                    if (guild.owner) {
                        ownedSection.appendChild(guildItem);
                    } else if (res.Administrator) {
                        adminSection.appendChild(guildItem);
                    } else if (res.ManageGuild) {
                        managedSection.appendChild(guildItem);
                    } else {
                        anySection.appendChild(guildItem);
                    }
                }
            }
        );
    });
})();
