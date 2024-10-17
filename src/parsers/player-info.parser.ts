import { types as modelTypes } from '@numengames/numinia-models';

export default (player: modelTypes.PlayerDocument) => ({
  playerId: player?._id,
  playerName: player?.playerName,
});