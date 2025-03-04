// api.js
const path = require("path");
const MTProto = require("@mtproto/core");
require("dotenv").config();
const { sleep } = require("@mtproto/core/src/utils/common");

class API {
  constructor({ test } = { test: false }) {
    this.mtproto = new MTProto({
      api_id: process.env.API_ID,
      api_hash: String(process.env.HASH_ID),
      test,
      storageOptions: {
        path: path.resolve(__dirname, "./src/services/data/telegramData.json"),
      },
    });
  }

  async call(method, params, options = {}) {
    console.log(method);

    try {
      const result = await this.mtproto.call(method, params, options);

      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      const { error_code, error_message } = error;

      if (error_code === 420) {
        const seconds = Number(error_message.split("FLOOD_WAIT_")[1]);
        const ms = seconds * 1000;

        await sleep(ms);

        return this.call(method, params, options);
      }

      if (error_code === 303) {
        const [type, dcIdAsString] = error_message.split("_MIGRATE_");

        const dcId = Number(dcIdAsString);

        // If auth.sendCode call on incorrect DC need change default DC, because
        // call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
        if (type === "PHONE") {
          await this.mtproto.setDefaultDc(dcId);
        } else {
          Object.assign(options, { dcId });
        }

        return this.call(method, params, options);
      }

      return Promise.reject(error);
    }
  }


  async getAllMessages(list_id) {
    const result = await this.call("messages.getChats", {
      id: list_id,
    })
    console.log(result)
  }
  
  async getAllSentMessages() {
    const result = await this.call("messages.getHistory", {
      peer: {
        _: "inputPeerSelf",
      },
      offset_id: 0,
      offset_date: 0,
      add_offset: 0,
      limit: 100,
      max_id: 0,
      min_id: 0,
      hash: 0,
    });

    return result.messages.filter(({ out }) => out);
  }


  async contactSearchbyPhone(phone_number) {
    try {
      return this.call("contacts.resolvePhone", {
        phone: phone_number,
      });
    } catch (error) {
      return null;
    }
  }

  async contactSearchbyName ({q, limit}) {
    try{
    return this.call("contacts.search", {
      q,
      limit: 1,
    });
    } catch (error) {
      return null;
  }
}

  async getUserById(id) {
    try {
      const user = await this.call("users.getFullUser", {
        id: {
          _: "inputUser",
          user_id: id,
          access_hash: 0,
        },
      });
      
    } catch (error) {
      return null;
    }
  }

  async sendMessage({ message, name}) {
    try{

    const result = await this.call("contacts.search", {
      q: name,
      limit: 1,
    })

    console.log(result)

    return this.call("messages.sendMessage", { 
      peer: {
        _: "inputPeerUser",
        user_id: result.users[0].id,
        access_hash: result.users[0].access_hash,
      },
      message: String(message),
      entities: [
        {
          _: 'messageEntityUnknown',
          offset: 6,
          length: 13,
        },
      ],
      random_id: Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff),
     });
    } catch (error) {
      return null;
    }
  }

  async getUser() {
    try {
      const user = await this.call("users.getFullUser", {
        id: {
          _: "inputUserSelf",
        },
      });

      return user;
    } catch (error) {
      return null;
    }
  }

  sendCode(phone) {
    try {
      return this.call("auth.sendCode", {
        phone_number: phone,
        settings: {
          _: "codeSettings",
        },
      });
    } catch (error) {
      throw error;
    }
  }

  signIn({ code, phone, phone_code_hash }) {
    return this.call("auth.signIn", {
      phone_code: code,
      phone_number: phone,
      phone_code_hash: phone_code_hash,
    });
  }

  signUp({ phone, phone_code_hash }) {
    return this.call("auth.signUp", {
      phone_number: phone,
      phone_code_hash: phone_code_hash,
      first_name: "MTProto",
      last_name: "Core",
    });
  }

  getPassword() {
    return this.call("account.getPassword");
  }

  checkPassword({ srp_id, A, M1 }) {
    return this.call("auth.checkPassword", {
      password: {
        _: "inputCheckPasswordSRP",
        srp_id,
        A,
        M1,
      },
    });
  }
}

module.exports = API;
