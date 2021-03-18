import { logger } from "bondage-club-headless";
import { LoggingLogic } from "./loggingLogic";

// Note:
// For more examples of events see src/loggingLogic.ts
// For full documentation of how to do things to players see src/types/apidef.d.ts

export class TestLogic extends LoggingLogic {
	protected onCharacterOrderChanged(connection: API_Connector): void {
		if (connection.Player.IsRoomAdmin()) {
			logger.info("Moving to first spot in room!");
			void connection.Player.MoveToPos(0);
		}
	}
}
