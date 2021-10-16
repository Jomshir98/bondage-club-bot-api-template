import { AssetGet, Connect, Init, logger, AddFileOutput, LogLevel, SetConsoleOutput, logConfig } from "bondage-club-bot-api";
import { TestLogic } from "./testLogic";
import { USERNAME, PASSWORD } from "./secrets";

import * as fs from "fs";

// To reduce loglevel, change it here
SetConsoleOutput(LogLevel.DEBUG);

const time = new Date();
const timestring = `${time.getFullYear() % 100}${(time.getMonth() + 1).toString().padStart(2, "0")}${time.getDate().toString().padStart(2, "0")}_` +
	`${time.getHours().toString().padStart(2, "0")}${time.getMinutes().toString().padStart(2, "0")}`;
const logPrefix = `${timestring}_${process.pid}`;

fs.mkdirSync(`./data/logs`, { recursive: true });
AddFileOutput(`./data/logs/${logPrefix}_debug.log`, false, LogLevel.DEBUG);
AddFileOutput(`./data/logs/${logPrefix}_error.log`, true, LogLevel.ALERT);

let conn: API_Connector | null = null;
let testLogic: TestLogic | null = null;

async function run() {
	conn = await Connect(USERNAME, PASSWORD);

	testLogic = new TestLogic();
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
}

Init()
	.then(run, err => {
		logger.fatal("Asset loading rejected:", err);
	})
	.catch(err => {
		logger.fatal("Error while running:", err);
	});

logConfig.onFatal.push(() => {
	conn?.disconnect();
	conn = null;
	testLogic = null;
});

process.once("SIGINT", () => {
	logger.fatal("Interrupted");
});
