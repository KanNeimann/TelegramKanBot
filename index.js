const Telebot = require("telebot")
const CONSTANTS = require("./constants")


const bot = new Telebot({
    token: CONSTANTS.TELEGRAM_TOKEN
})

bot.on(["/razon", "/razón"], (msg) => {
    const datesition = Date.now()
    let message
    if (datesition % 2 == 0) {
        message = `Tenes la razón @${msg.from.first_name} `
    } else if (datesition % 7 == 0) {
        message = `AGUANTE BOKITA!`
    } else {
        message = `No tenes la razón @${msg.from.first_name}`
    }
    bot.sendMessage(msg.chat.id, message)
})

bot.start()