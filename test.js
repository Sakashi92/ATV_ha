import { patcher, messages } from "@enmity/api";

const Patcher = patcher.create("edit-logger-mobile");

export default {
   name: "MobileEditLogger",
   version: "1.2.0",
   description: "Zeigt ursprünglichen Text mit Zeitstempel (Rot markiert) bei Edits an.",
   authors: [{ name: "Gemini", id: "000000000000000000" }],

   onStart() {
      Patcher.before(messages, "receiveMessage", ([, message]) => {
         // Prüfen, ob es ein Update einer Nachricht ist
         if (message.type === "MESSAGE_UPDATE" && message.message?.content) {
            const oldMessage = messages.getMessage(message.channelId, message.message.id);
            
            if (oldMessage && oldMessage.content !== message.message.content) {
               const now = new Date();
               const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

               // Formatierung für das Handy: Trenner + Roter Block
               const logHeader = `\n\n🕒 *Bearbeitet um ${time}*`;
               const diffBlock = `\n\`\`\`diff\n- Alt: ${oldMessage.content}\n\`\`\``;

               message.message.content = `${message.message.content}${logHeader}${diffBlock}`;
            }
         }
      });
   },

   onStop() {
      Patcher.unpatchAll();
   }
};
