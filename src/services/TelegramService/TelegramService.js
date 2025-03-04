// main.js
const MTProto = require("@mtproto/core");
const API = require("./Telegramapi.js");
const api = new API();

export class TelegramService {
  async getCode(phone) {
    const user = await api.getUser();
    console.log("User 1st try: ", user);

    if (!user) {
      console.log(`phone: ${phone}`);
      const { phone_code_hash } = await api.sendCode(phone);
      const userSessionData = {
        phoneValue: phone,
        phone_code_hashValue: phone_code_hash,
      };
      this.updateUserSession(phone, userSessionData);
      return userSessionData;
    }
  }

  async authenticateCode({ phone, phone_code_hash, code }) {
    try {
      const signInResult = await api.signIn({
        code,
        phone,
        phone_code_hash,
      });
      console.log(signInResult);

      if (signInResult._ === "auth.authorizationSignUpRequired") {
        const signUpResult = await api.signUp({
          phone,
          phone_code_hash,
        });
        console.log(signUpResult);
      }

      const newUser = await api.getUser();
      console.log("User 2nd try: ", newUser);
      this.updateUserSession(phone, { newUser });
    } catch (error) {
      if (error.error_message !== "SESSION_PASSWORD_NEEDED") {
        console.log(`error:`, error);
      } else {
        const result = await api.call("help.getNearestDc");
        console.log(result);
      }
    }
  }

  updateUserSession(phone, data) {
    const fs = require('fs');
    const userSessionsFilePath = path.resolve(__dirname, "./data/telegramData.json");
    let userSessions = {};

    if (fs.existsSync(userSessionsFilePath)) {
      userSessions = JSON.parse(fs.readFileSync(userSessionsFilePath, 'utf8'));
    }

    userSessions[phone] = data;
    fs.writeFileSync(userSessionsFilePath, JSON.stringify(userSessions, null, 2));
  }

  async updates() {
    console.log("Listening to all messages...");

    api.mtproto.updates.on("updateShortMessage", (updateInfo) => {
      if (updateInfo.out === true) {
        console.log(
          `Você enviou: ${updateInfo.message}, para o seguinte contato: ${updateInfo.user_id}`
        );
      } else {
        console.log(
          `Você recebeu a seguinte mensagem: ${updateInfo.message}, desse contato: ${updateInfo.user_id}`
        );
      }
    });
  }

  async sendMessage(contact, content) {
    try {
      const sendMessageSelfResult = await api.sendMessage({
        name: contact,
        message: content,
      });
    } catch (error) {
      console.log(`error:`, error);
    }
  }

  async contactSearch(contact) {
    try {
      const resultByPhone = await api.contactSearchbyPhone(contact);
      console.log("Result by phone:", resultByPhone);
    } catch (error) {
      console.log("Error searching by phone:", error);
    }

    try {
      const resultByName = await api.contactSearchbyName({ q: contact });
      console.log("Result by name:", resultByName);
    } catch (error) {
      console.log("Error searching by name:", error);
    }

    try {
      const resultById = await api.getUserById(contact);
      console.log("Result by user ID:", resultById);
    } catch (error) {
      console.log("Error searching by user ID:", error);
    }
  }
}

export default new TelegramService();