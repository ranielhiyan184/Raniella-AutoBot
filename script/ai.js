const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    credits: "chill",
    description: "Interact with Mixtral AI",
    hasPrefix: false,
    cooldown: 0,
    aliases: ["mixtral"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let q = args.join(" ");
        if (!q) {
            return api.sendMessage("Please provide a question. For example: ai what is your name?", event.threadID, event.messageID);
        }

        api.sendMessage("Mixtral answering, please wait...", event.threadID, async (err, info) => {
            if (err) {
                console.error("Error sending initial message:", err);
                return api.sendMessage("An error occurred while processing your request.", event.threadID);
            }

            try {
                
                const userInfo = await api.getUserInfo(event.senderID);
                const senderName = userInfo[event.senderID].name;

        
                const response = await axios.get(`https://joshweb.click/api/mixtral-8b?q=${encodeURIComponent(q)}`);
                const answer = response.data.result;

                
                const finalMessage = `${answer}\n\nAsked by: ${senderName}`;
                api.sendMessage(finalMessage, event.threadID);
            } catch (error) {
                console.error("Error fetching AI response or user info:", error);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (error) {
        console.error("Error in ai command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
