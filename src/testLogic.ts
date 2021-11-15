import { logger } from "bondage-club-bot-api";
import { LoggingLogic } from "./loggingLogic";

// Note:
// For more examples of events see src/loggingLogic.ts
// To use any more events, go to that file and copy the function, including the comment above it.

export class TestLogic extends LoggingLogic {
	/**
	 * When character enters the room
	 * @param connection Originating connection
	 * @param character The character that entered the room
	 */
	protected onCharacterEntered(connection: API_Connector, character: API_Character): void {
		// Calling super.<name of function> will keep the log. If you don't want to log characters entering or want to do it yourself, remove this line
		super.onCharacterEntered(connection, character);

		// Connection.SendMessage sends message to everyone in the room
		connection.SendMessage("Chat", `Everyone, welcome ${character.Name}!`);
		// character.Tell sends message only to this character (even if it is an emote!)
		character.Tell("Chat", `Welcome to my bot room, ${character.Name}!`);
	}

	/**
	 * When connection receives message inside chatroom
	 * @param connection Originating connection
	 * @param message Received message
	 * @param sender The character that sent the message
	 */
	protected onMessage(connection: API_Connector, message: BC_Server_ChatRoomMessage, sender: API_Character): void {
		// Calling super.<name of function> will keep the log. If you don't want to log messages or want to do it yourself, remove this line
		super.onMessage(connection, message, sender);

		// Commands handling example
		if (message.Type === "Whisper" && message.Content.startsWith("!")) {
			const cmd = message.Content.toLocaleLowerCase();
			if (cmd === "!help") {
				sender.Tell("Whisper", "Do you need some help?");
			} else {
				sender.Tell("Whisper", `Unknown command '${message.Content}'. To get list of supported commands use '!help'`);
			}
			return;
		}
	}

	/**
	 * When characters in room get moved around
	 * @param connection Originating connection
	 */
	protected onCharacterOrderChanged(connection: API_Connector): void {
		// Make sure bot is in first spot in the room
		if (connection.Player.IsRoomAdmin()) {
			logger.info("Moving to first spot in room!");
			void connection.Player.MoveToPos(0);
		}
	}
}
