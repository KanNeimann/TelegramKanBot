const Telebot = require("telebot")
const CONSTANTS = require("./constants")
const axios = require('axios').default

const bot = new Telebot({
    token: CONSTANTS.TELEGRAM_TOKEN
})

bot.on(["/razon", "/r"], (msg) => {
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

bot.on(['/hoy'], (msg) => {
    const randomPick = Math.floor(Math.random() * 151)
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then((res) => {
            const pokemons = res.data.results
            axios.get(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPick + 1}.png`, { responseType: 'arraybuffer' })
                .then(response => {
                    const buffer = Buffer.from(response.data, 'base64');
                    bot.sendPhoto(msg.chat.id, buffer, { caption: `Hoy estas hecho un ${pokemons[randomPick].name} @${msg.from.first_name}`/* , replyToMessage: msg.message_id*/ })
                })
        })

})

bot.on(['/memide'], (msg) => {
    const rndNumber = Math.floor(Math.random() * 50)

    bot.sendMessage(msg.chat.id, `Te mide ${rndNumber}cm @${msg.from.first_name}`)
})

bot.on(['/opciones'], (msg) => {
    let options = msg.text.split(',')

    const opcionUno = options[0].replace('/opciones', '')
    const opcionDos = options[1]

    Math.random() < 1 / 2 ?
        bot.sendMessage(msg.chat.id, `${opcionUno}, @${msg.from.first_name}`) :
        bot.sendMessage(msg.chat.id, `${opcionDos}, @${msg.from.first_name}`)
})

/* bot.on(['/motivacion'], (msg) => {
    const mensaje = Math.floor(Math.random() * 50)

    bot.sendMessage(msg.chat.id, mensaje)
}) */

bot.start()