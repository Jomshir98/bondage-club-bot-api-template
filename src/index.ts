import { Init, logger, Connect, AssetGet, logConfig, LogLevel } from "bondage-club-bot-api";
import { TestLogic } from "./testLogic";
import { USERNAME, PASSWORD } from "./secrets";

import fsPromises from "fs/promises";

// To reduce loglevel, change it here
logConfig.logLevel = LogLevel.DEBUG;

let conn: API_Connector | null = null;

const time = new Date();
const timestring = `${time.getFullYear() % 100}${(time.getMonth() + 1).toString().padStart(2, "0")}${time.getDate().toString().padStart(2, "0")}_` +
	`${time.getHours().toString().padStart(2, "0")}${time.getMinutes().toString().padStart(2, "0")}`;
const logPrefix = `${timestring}_${process.pid}`;

fsPromises
	.mkdir("./data/logs", { recursive: true })
	.then(() => fsPromises.open(`./data/logs/${logPrefix}_debug.log`, "w"))
	.then(log => logger.addFileOutput(LogLevel.DEBUG, log))
	.then(() => fsPromises.open(`./data/logs/${logPrefix}_error.log`, "as"))
	.then(log => logger.addFileOutput(LogLevel.ALERT, log))
	.then(Init)
	.then(async () => {
		conn = await Connect(USERNAME, PASSWORD);

		const testLogic = new TestLogic();
		conn.logic = testLogic;


		// These just expose some things in debug console
		// @ts-ignore: dev
		global.AssetGet = AssetGet;
		// @ts-ignore: dev
		global.conn = conn;
		// @ts-ignore: dev
		global.logic = testLogic;

		// To work properly bot *needs* to be room admin!
		await conn.ChatRoomJoinOrCreate({
			Name: "Bot test",
			Description: "[BOT] Testing room for jomshir's bots",
			Background: "MainHall",
			Limit: 10,
			Private: true,
			Locked: false,
			Admin: [conn.Player.MemberNumber],
			Ban: [],
			Game: "",
			BlockCategory: ["Leashing"]
		});

		logger.alert("Ready!");
	}).catch(err => {
		logger.fatal("Error while running:", err);
	});

logger.onfatal(() => {
	conn?.disconnect();
	conn = null;
});

process.once("SIGINT", () => {
	logger.fatal("Interrupted");
});
