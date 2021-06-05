import { Init, logger, Connect, AssetGet, logConfig, LogLevel } from "bondage-club-bot-api";
import { TestLogic } from "./testLogic";

// To reduce loglevel
// logConfig.logLevel = LogLevel.INFO;

let testConnection: API_Connector | null = null;

void Init().then(async () => {
	// @ts-ignore: dev
	global.AssetGet = AssetGet;

	// Username and password goes here
	testConnection = await Connect("user", "pass");

	// @ts-ignore: dev
	global.conn = testConnection;

	const testLogic = new TestLogic();
	// @ts-ignore: TODO
	testConnection.logic = testLogic;
	// @ts-ignore: dev
	global.logic = testLogic;

	// To work properly bot *needs* to be room admin!
	await testConnection.ChatRoomJoinOrCreate({
		Name: "Bot test",
		Description: "[BOT] Testing room for jomshir's bots",
		Background: "MainHall",
		Limit: 10,
		Private: true,
		Locked: false,
		Admin: [testConnection.Player.MemberNumber, 23664],
		Ban: [],
		Game: "",
		BlockCategory: ["Leashing"]
	});

	logger.alert("Ready!");
});
