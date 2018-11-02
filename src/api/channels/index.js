import * as express from "express"
import { notAllowed } from "../../middleware/notAllowed"
import * as discord from "../../discord"
import * as IDS from "../../discord/vars"

const router = express.Router()

router.route("/")
	.get(async (req, res, next) => {
		try {
			const channels = await discord.getBotActivceChannels();
			return res.status(200).send({ channels })
		} catch (e) {
			next(e)
		}
	})
	.post(async (req, res, next) => {
		try {
			let channelName = req.body.name;
			let players = req.body.players;

			const channel = await discord.createChannel(channelName);
			await discord.movePlayersToChannel(players, channel.id);
			return res.status(200).send({ id: channel.id });
		} catch (e) {
			next(e);
		}
	})
	.all(notAllowed);

router.route("/:id")
	.get(async (req, res, next) => {
		try {
			let channel = await discord.getChannel(req.params.id);
			return res.status(200).json({ channel });
		} catch (e) {
			next(e);
		}
	})
	.delete(async (req, res, next) => {
		try {
			const guild = await discord.getGuild();
			//move players to main channel
			const membersID = guild.members.filter(m => m.voiceChannelID == req.params.id).map(member => member.id);
			await discord.movePlayersToChannel(membersID, IDS.channels.main);
			////////
			await discord.deleteChannel(req.params.id);
			return res.status(204).send();
		} catch (e) {
			next(e);
		}
	})
	.all(notAllowed);

export { router as channels }
