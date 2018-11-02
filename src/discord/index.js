import { Client, GuildChannel, Guild } from "discord.js"
import * as IDS from "./vars"

export const bot = new Client();



export async function setupBot() {
    await bot.login(process.env.DISCORD_BOT_USER_TOKEN);

    IDS.guild = "376511262605049857"; //your guild id

    //creates the main voice that the players need to connect before each match so
    //the bot can move them around when the match channel is created
    await createMainChannelIfNotExists(); //the name of your main channel if blank: "Main Channel"
    console.log("[DISCORD] Ready");

    return bot;
}

export async function destroyBot() {
    await bot.destroy()
    console.log("[DISCORD] Stopped")
}

export async function getGuild() {
    const guild = bot.guilds.get(IDS.guild);
    if (!guild) throw new Error("GUILD NOT FOUND!");
    return guild;
}

export async function createMainChannelIfNotExists(channelName = "Main Channel") {
    const guild = await getGuild();

    let channel;

    if (IDS.channels.main) {
        channel = guild.channels.get(IDS.channels.main);
        if (channel) return channel;
    }

    channel = guild.channels.find(c => c.name == channelName)
    if (!channel) channel = await guild.createChannel(channelName, "voice");
    
    await channel.overwritePermissions(guild.roles.find(r => r.name == "@everyone"), {
        SPEAK: false
    })
    
    IDS.channels.main = channel.id;
}

///////////////// users //////////////////////////
export async function isUserOnline(userId) {
    const guild = await getGuild();

    const member = await guild.fetchMember(userId)
    return member ? member.presence.status !== "offline" : false;
}

export async function isUserInMainChannel(userId) {
    const guild = await getGuild()

    const member = await guild.fetchMember(userId)
    return member.voiceChannel
        ? member.voiceChannel.id == IDS.channels.main
        : false;
}

export async function movePlayersToChannel(userIds, channelID) {
    const guild = await getGuild();

    const channel = guild.channels.find(c => c.id == channelID);
    if (!channel) throw new Error("CHANNEL '" + channelID + "' NOT FOUND");

    await userIds.forEach(async userId => {
        let member = await guild.fetchMember(userId);
        // if(meber)
        member.setVoiceChannel(channel);
    })
}

//////////////// channels ////////////////
export async function createChannel(channelName) {
    const guild = await getGuild();

    let channel = guild.channels.find(c => c.name == channelName);
    if (!channel) channel = await guild.createChannel(channelName, "voice");

    IDS.channels.active.push(channel.id);

    await channel.edit({
        name: channelName,
        bitrate: 32000,
        userLimit: 5,
        topic: "bot"
    });

    await channel.overwritePermissions(guild.roles.find(r => r.name == "@everyone"), {
        CONNECT: false
    });

    return channel;
}

export async function deleteChannel(channelId) {
    const guild = await getGuild();

    let channel = guild.channels.get(channelId);
    if (!channel) throw new Error("Channel NOT FOUND");
    await channel.delete();

    const index = IDS.channels.active.indexOf(channel.id);
    if (index > 1) IDS.channels.active.splice(index, 1);
}

export async function getChannel(channelId) {
    const guild = await getGuild();

    return guild.channels.find(c => c.id == channelId);
}

export async function getBotActiveChannels() {
    const guild = await getGuild()

    const channelsID = IDS.channels.active;
    console.log(channelsID);
    return guild.channels.filterArray(c => channelsID.indexOf(c.id) !== -1);
}