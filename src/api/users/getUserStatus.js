import * as discord from "../../../src/discord/";

export async function getUserStatus(req, res, next) {
    try {
        const online = await discord.isUserOnline(req.params.id);
        const presentInMainChannel = await discord.isUserInMainChannel(req.params.id);
        return res.status(200).json({ online, presentInMainChannel });
    } catch (e) {
        next(e);
    }
}