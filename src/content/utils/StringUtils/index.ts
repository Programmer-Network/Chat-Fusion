export default class StringUtils {
    /**
     * Utility used to generate a sessionId.
     * @param {length} length - The length of the ID to generate.
     * @returns the generated ID.
     */
    makeId(length: number): string {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }

        return result;
    }

    /**
     * Maps the hostname to a human-readable platform name.
     * @returns {string|null} A string representing the platform name or null if the hostname is not recognized.
     */
    getPlatformNameByHostname(): string {
        try {
            return (
                {
                    "www.twitch.tv": "twitch",
                    "www.youtube.com": "youtube",
                    "kick.com": "kick",
                }[window.location.hostname] || ""
            );
        } catch (_) {
            return "";
        }
    }
}
