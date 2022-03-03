import client from './discord';
import InvitesTracker from '@androz2091/discord-invites-tracker';

export default InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true,
});