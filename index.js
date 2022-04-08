const Telebot = require("telebot")
const CONSTANTS = require("./constants")
const Persona = require('./Persona')
// const ToDo = require('./ToDo.js')
const axios = require('axios').default

const bot = new Telebot({
    token: CONSTANTS.TELEGRAM_TOKEN
})
let i = 0
const personas = []

const isPrime = num => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num > 1;
}

bot.on(["/razon", "/r"], (msg) => {
    const datesition = Date.now()
    let message
    if (datesition % 2 == 0) {
        message = `Tenes razón @${msg.from.first_name} `
    } else if (datesition % 7 == 0) {
        message = `AGUANTE BOKITA!`
    } else {
        message = `No tenes razón @${msg.from.first_name}`
    }
    if (isPrime(datesition)) {
        message = message.concat(`, numero primo del dia: ${datesition}`)
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

bot.on(['/opciones', '/o'], (msg) => {

    let newMsg = msg.text.replace('/opciones', '').split(',')
    let options = newMsg.map((element) => element.replace(' ', ''))

    const rndNumber = Math.floor(Math.random() * options.length)

    bot.sendMessage(msg.chat.id, `${options[rndNumber]}, @${msg.from.first_name}`)
})

bot.on(['/motivacion', '/m'], (msg) => {
    axios.get('https://frasedeldia.azurewebsites.net/api/phrase').then((res) => {
        bot.sendMessage(msg.chat.id, `${res.data.phrase}, ${res.data.author}`);
    }).catch((err) => {
        console.error(err)
    })
})

/* bot.on(['/food'], (msg) => {

    axios.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/jokes/random').then(function (response) {
        console.log('response.data', response.data);
        bot.sendMessage(msg.chat.id, response.data.text);
    }).catch(function (error) {
        console.error(error);
    });
}) */

bot.on(['/newuser'], (msg) => { // Funcionando
    if (!personas.find(({ username }) => username === msg.from.username)) {
        const a = this[`persona` + i] = new Persona(msg.from.username)
        personas.push(a)
        bot.sendMessage(msg.chat.id, `Se creo tu usuario ${msg.from.first_name}`)
    } else {
        bot.sendMessage(msg.chat.id, `Ya estas registrado ${msg.from.first_name}`)
    }
})

bot.on(['/deuda'], (msg) => { // Funcionando
    const index = personas.findIndex(({ username }) => username === msg.from.username)
    if (index !== -1) {
        if (personas[index].getDeudas().length === 0) {
            bot.sendMessage(msg.chat.id, `No tenes deudas ${msg.from.first_name}`)
        } else {
            let deudasStr = 'Tus deudas:'
            personas[index].getDeudas().map((deuda) => {
                deudasStr = deudasStr.concat(`\n      -\$${deuda.monto} ${deuda.detalle} a ${deuda.acreedor}`)
            })
            bot.sendMessage(msg.chat.id, deudasStr)
        }
    } else {
        bot.sendMessage(msg.chat.id, `No estas registrado, proba /newuser ${msg.from.first_name}`)
    }

})

bot.on(['/setdeuda'], (msg) => {    // Funcionando

    let deudaArr = msg.text.replace('/setdeuda ', '').split(' ')
    const [acreedor, monto, detalle] = deudaArr

    const index = personas.findIndex(({ username }) => username === msg.from.username)
    if (index !== -1) {
        const persona = personas[index]
        persona.setDeuda({ acreedor: acreedor, monto: Number(monto), detalle: detalle })
    } else {
        bot.sendMessage(msg.chat.id, `No estas registrado, proba /newuser ${msg.from.first_name}`)
    }

})

bot.on(['/pagardeuda', '/p'], (msg) => {

})

bot.on(['/todo'], (msg) => {        // Funcionando
    const index = personas.findIndex(({ username }) => username === msg.from.username)
    if (index !== -1) {
        if (personas[index].toDos.length === 0) {
            bot.sendMessage(msg.chat.id, `No tenes tareas ${msg.from.first_name}`)
        } else {
            let tareasStr = 'Tus tareas:'
            personas[index].getToDos().map((tarea) => {
                tareasStr = tareasStr.concat(`\n      -${tarea.tarea}`)
            })
            bot.sendMessage(msg.chat.id, tareasStr)
        }
    } else {
        bot.sendMessage(msg.chat.id, `No estas registrado, proba /newuser ${msg.from.first_name}`)
    }

})

bot.on(['/settask'], (msg) => {     // Funcionando
    let tarea = msg.text.replace('/settask ', '').replace(' ', '')
    const index = personas.findIndex(({ username }) => username === msg.from.username)

    if (index !== -1) {

        personas[index].setTask(tarea)
        bot.sendMessage(msg.chat.id, `Tarea agendada ${msg.from.first_name}!`)
    } else {
        bot.sendMessage(msg.chat.id, `No estas registrado, proba /newuser ${msg.from.first_name}`)
    }

})
bot.on(['/rmtask', '/rmt'], (msg) => {
    const index = personas.findIndex(({ username }) => username === msg.from.username)

    if (index !== -1) {
        bot.button([], 'asd')
        let tareasStr = 'Ingresa el id a eliminar:'
        personas[index].getToDos().map((tarea) => {
            console.log(tarea.tarea)
            tareasStr = tareasStr.concat(`\n      -${tarea.tarea}  -  ${tarea.tarea.id}`)
        })
        bot.sendMessage(msg.chat.id, tareasStr)

        console.log(personas[index].toDos)
        personas[index].deleteTask(tarea)
        bot.sendMessage(msg.chat.id, `Tarea agendada ${msg.from.first_name}!`)
    } else {
        bot.sendMessage(msg.chat.id, `No estas registrado, proba /newuser ${msg.from.first_name}`)
    }

})

/* ------------------------------------------------------------------------------ */
// On commands
/* bot.on(['/start', '/back'], msg => {

    let replyMarkup = bot.keyboard([
        ['/buttons', '/inlineKeyboard'],
        ['/start', '/hide']
    ], { resize: true });

    return bot.sendMessage(msg.from.id, 'Keyboard example.', { replyMarkup });

});

// Buttons
bot.on('/buttons', msg => {

    let replyMarkup = bot.keyboard([
        [bot.button('contact', 'Your contact'), bot.button('location', 'Your location')],
        ['/back', '/hide']
    ], { resize: true });

    return bot.sendMessage(msg.from.id, 'Button example.', { replyMarkup });

});

// Hide keyboard
bot.on('/hide', msg => {
    return bot.sendMessage(
        msg.from.id, 'Hide keyboard example. Type /back to show.', { replyMarkup: 'hide' }
    );
});

// On location on contact message
bot.on(['location', 'contact'], (msg, self) => {
    return bot.sendMessage(msg.from.id, `Thank you for ${self.type}.`);
});

// Inline buttons
bot.on('/inlineKeyboard', msg => {

    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton('callback', { callback: 'this_is_data' }),
            bot.inlineButton('inline', { inline: 'some query' })
        ], [
            bot.inlineButton('url', { url: 'https://telegram.org' })
        ]
    ]);

    return bot.sendMessage(msg.from.id, 'Inline keyboard example.', { replyMarkup });

});

// Inline button callback
bot.on('callbackQuery', msg => {
    // User message alert
    return bot.answerCallbackQuery(msg.id, `Inline button callback: ${msg.data}`, true);
});

// Inline query
bot.on('inlineQuery', msg => {

    const query = msg.query;
    const answers = bot.answerList(msg.id);

    answers.addArticle({
        id: 'query',
        title: 'Inline Query',
        description: `Your query: ${query}`,
        message_text: 'Click!'
    });

    return bot.answerQuery(answers);

}); */

/* bot.on(['/all'], async (msg) => {
    console.log(msg.chat.id);
    console.log(await getChaat(msg.chat.id));
})
async function getChaat(id) {
    return await bot.getChatMember(id, 0)
}
 */
bot.start()