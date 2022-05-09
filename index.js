import Telebot from 'telebot'
import axios from 'axios'
import CONSTANTS from './constants.js'
import Persona from './src/Persona.js'

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
// import serviceAccount from './src/telegram-kan-bot-firebase-adminsdk-m0r3j-d5ca61db4c.json'

initializeApp({
    credential: cert(CONSTANTS.FIREBASE_TOKEN)
})

const bot = new Telebot({
    token: CONSTANTS.TELEGRAM_TOKEN,
});

const db = getFirestore();

let i = 0;
const users = db.collection('users');

// Funcion para agregar usuario a personas[]
bot.on(["/newuser"], async (msg) => {

    const userRef = users.doc(`${msg.from.username}`)
    const doc = await userRef.get();

    const data = {
        user: `${msg.from.username}`,
        pokemonNumber: '',
        pokemonDate: 0
    }

    if (!doc.exists) {
        userRef.set(data)
        // console.log('Se creo correctamente el usuario!');
        bot.sendMessage(msg.chat.id, `Se creo tu usuario ${msg.from.first_name}`);
    } else {
        // console.log('Se encuentra registrado el usuario!');
        bot.sendMessage(msg.chat.id, `Ya estas registrado ${msg.from.first_name}`);
    }
});

/* bot.on(["/actualizar"], async (msg) => {
    const userRef = users.doc(`${msg.from.username}`)
    await userRef.update({ pokemon: "raichu" });

    bot.sendMessage(msg.chat.id, 'asd');
}); */

bot.on(["/pokemon"], async (msg) => {

    const userRef = users.doc(`${msg.from.username}`)
    const userDoc = await userRef.get()

    const today = new Date()

    if (today.getDate() !== userDoc.data().pokemonDate) {
        /* Se agrega un pokemon nuevo al user */

        await userRef.update({ pokemonDate: today.getDate() });
        const randomPick = Math.floor(Math.random() * 151);
        await userRef.update({ pokemonNumber: randomPick });

        axios.get("https://pokeapi.co/api/v2/pokemon?limit=151").then((res) => {
            const pokemons = res.data.results;
            axios
                .get(
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPick + 1
                    }.png`,
                    { responseType: "arraybuffer" }
                )
                .then((response) => {
                    const buffer = Buffer.from(response.data, "base64");
                    bot.sendPhoto(msg.chat.id, buffer, {
                        caption: `Hoy estas hecho un ${pokemons[randomPick].name} @${msg.from.first_name}`,
                    });
                });
        });


    } else {
        /* Se toma el pokemon desde la base de datos */
        const userDoc = await userRef.get()

        const pokemonNumber = userDoc.data().pokemonNumber

        axios.get("https://pokeapi.co/api/v2/pokemon?limit=151").then((res) => {
            const pokemons = res.data.results;
            axios
                .get(
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonNumber + 1
                    }.png`,
                    { responseType: "arraybuffer" }
                )
                .then((response) => {
                    const buffer = Buffer.from(response.data, "base64");
                    bot.sendPhoto(msg.chat.id, buffer, {
                        caption: `Hoy estas hecho un ${pokemons[pokemonNumber].name} @${msg.from.first_name}`,
                    });
                });
        });

    }


});





//  Funcion define si un numero es primo
const isPrime = (num) => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num > 1;
};

// Funcion da o no la razon
bot.on(["/razon", "/r"], (msg) => {
    const datesition = Date.now();
    let message;
    if (datesition % 2 == 0) {
        message = `Tenes razón @${msg.from.first_name} `;
    } else if (datesition % 7 == 0) {
        message = `AGUANTE BOKITA!`;
    } else {
        message = `No tenes razón @${msg.from.first_name}`;
    }
    if (isPrime(datesition)) {
        message = message.concat(`, numero primo del dia: ${datesition}`);
    }
    bot.sendMessage(msg.chat.id, message);
});

// Funcion asigna un pokemon a un usuario y lo muestra
/* bot.on(["/hoy"], (msg) => {
    const randomPick = Math.floor(Math.random() * 151);
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=151").then((res) => {
        const pokemons = res.data.results;
        axios
            .get(
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomPick + 1
                }.png`,
                { responseType: "arraybuffer" }
            )
            .then((response) => {
                const buffer = Buffer.from(response.data, "base64");
                bot.sendPhoto(msg.chat.id, buffer, {
                    caption: `Hoy estas hecho un ${pokemons[randomPick].name} @${msg.from.first_name}` /* , replyToMessage: msg.message_id,
                });
            });
    });
}); 
*/

bot.on(["/memide"], (msg) => {
    const rndNumber = Math.floor(Math.random() * 50);

    bot.sendMessage(
        msg.chat.id,
        `Te mide ${rndNumber}cm @${msg.from.first_name}`
    );
});

bot.on(["/impuestos"], (msg) => {
    let numero = msg.text.replace("/impuestos ", "");
    bot.sendMessage(
        msg.chat.id,
        `${(numero * 1.65).toFixed(2)}, @${msg.from.first_name}`
    );
});

bot.on(["/reflexione"], (msg) => {

    bot.sendMessage(
        msg.chat.id,
        `@${msg.from.first_name} reflexiono, y pide disculpas`
    );
});

bot.on(["/opciones", "/o"], (msg) => {
    let newMsg = msg.text.replace("/opciones", "").split(",");
    let options = newMsg.map((element) => element.replace(" ", ""));

    const rndNumber = Math.floor(Math.random() * options.length);

    bot.sendMessage(
        msg.chat.id,
        `${options[rndNumber]}, @${msg.from.first_name}`
    );
});

bot.on(["/var"], (msg) => {
    const datesition = Date.now();
    let persona = msg.text.replace("/var ", "");
    bot.sendMessage(
        msg.chat.id,
        `El var analiza la jugada`
    );
    setTimeout(() => {
        if (datesition % 2 === 0 || datesition % 333 === 0) {
            bot.sendMessage(
                msg.chat.id,
                `Es amarilla para ${persona}`
            );
        } else {
            bot.sendMessage(
                msg.chat.id,
                `Es roja para @${persona}`
            );
        }
    }, 200)
});

bot.on(["/motivacion", "/m"], (msg) => {
    axios
        .get("https://frasedeldia.azurewebsites.net/api/phrase")
        .then((res) => {
            bot.sendMessage(msg.chat.id, `${res.data.phrase}, ${res.data.author}`);
        })
        .catch((err) => {
            console.error(err);
        });
});

/* bot.on(["/gato", "/m"], (msg) => {
    axios
        .get("https://frasedeldia.azurewebsites.net/api/phrase")
        .then((res) => {
            bot.sendMessage(msg.chat.id, `${res.data.phrase}, ${res.data.author}`);
        })
        .catch((err) => {
            console.error(err);
        });
}); */

/* bot.on(['/food'], (msg) => {

    axios.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/jokes/random').then(function (response) {
        console.log('response.data', response.data);
        bot.sendMessage(msg.chat.id, response.data.text);
    }).catch(function (error) {
        console.error(error);
    });
}) */

/* bot.on(["/deuda"], (msg) => {
    // Funcionando
    const index = personas.findIndex(
        ({ username }) => username === msg.from.username
    );
    if (index !== -1) {
        if (personas[index].getDeudas().length === 0) {
            bot.sendMessage(msg.chat.id, `No tenes deudas ${msg.from.first_name}`);
        } else {
            let deudasStr = "Tus deudas:";
            personas[index].getDeudas().map((deuda) => {
                deudasStr = deudasStr.concat(
                    `\n      -\$${deuda.monto} ${deuda.detalle} a ${deuda.acreedor}`
                );
            });
            bot.sendMessage(msg.chat.id, deudasStr);
        }
    } else {
        bot.sendMessage(
            msg.chat.id,
            `No estas registrado, proba /newuser ${msg.from.first_name}`
        );
    }
});

bot.on(["/setdeuda"], (msg) => {
    // Funcionando

    let deudaArr = msg.text.replace("/setdeuda ", "").split(" ");
    const [acreedor, monto, detalle] = deudaArr;

    const index = personas.findIndex(
        ({ username }) => username === msg.from.username
    );
    if (index !== -1) {
        const persona = personas[index];
        persona.setDeuda({
            acreedor: acreedor,
            monto: Number(monto),
            detalle: detalle,
        });
    } else {
        bot.sendMessage(
            msg.chat.id,
            `No estas registrado, proba /newuser ${msg.from.first_name}`
        );
    }
}); */

/* bot.on(["/pagardeuda", "/p"], (msg) => { });

bot.on(["/todo"], (msg) => {
    // Funcionando
    const index = personas.findIndex(
        ({ username }) => username === msg.from.username
    );
    if (index !== -1) {
        if (personas[index].toDos.length === 0) {
            bot.sendMessage(msg.chat.id, `No tenes tareas ${msg.from.first_name}`);
        } else {
            let tareasStr = "Tus tareas:";
            personas[index].getToDos().map((tarea) => {
                tareasStr = tareasStr.concat(`\n      -${tarea.tarea}`);
            });
            bot.sendMessage(msg.chat.id, tareasStr);
        }
    } else {
        bot.sendMessage(
            msg.chat.id,
            `No estas registrado, proba /newuser ${msg.from.first_name}`
        );
    }
}); */

/* bot.on(["/settask"], (msg) => {
    // Funcionando
    let tarea = msg.text.replace("/settask ", "");
    const index = personas.findIndex(
        ({ username }) => username === msg.from.username
    );

    if (index !== -1) {
        personas[index].setTask(tarea);
        bot.sendMessage(msg.chat.id, `Tarea agendada ${msg.from.first_name}!`);
    } else {
        bot.sendMessage(
            msg.chat.id,
            `No estas registrado, proba /newuser ${msg.from.first_name}`
        );
    }
});
bot.on(["/rmtask", "/rmt"], (msg) => {
    const index = personas.findIndex(
        ({ username }) => username === msg.from.username
    );

    if (index !== -1) {
        bot.button([], "asd");
        let tareasStr = "Ingresa el id a eliminar:";
        personas[index].getToDos().map((tarea) => {
            console.log(tarea.tarea);
            tareasStr = tareasStr.concat(
                `\n      -${tarea.tarea}  -  ${tarea.tarea.id}`
            );
        });
        bot.sendMessage(msg.chat.id, tareasStr);

        console.log(personas[index].toDos);
        personas[index].deleteTask(tarea);
        bot.sendMessage(msg.chat.id, `Tarea agendada ${msg.from.first_name}!`);
    } else {
        bot.sendMessage(
            msg.chat.id,
            `No estas registrado, proba /newuser ${msg.from.first_name}`
        );
    }
});
 */
/* ------------------------------------------------------------------------------ */
// AGARRA ESTA WEA
/* bot.on(["/removetask"], (msg) => {


    const index = personas.findIndex(
        ({ username }) => username === msg.from.username
    );
    const arrTasks = []
    let tareasStr = ''
    if (index !== -1) {

        tareasStr = "Selecciona cual deseas eliminar:";
        personas[index].getToDos().map((tarea) => {
            tareasStr = tareasStr.concat(`\n      -${tarea.tarea}`);
        });


        const persona = personas[index];

        const tasks = personas[index].getToDos();
        console.log(tasks)
        for (task of tasks) {
            arrTasks.push([`/${(1 + i)}`])
        }
    } else {
        bot.sendMessage(
            msg.chat.id,
            `No tenes tareas registradas, proba / settask ${msg.from.first_name}`
        );
    }
    console.log(arrTasks)
    let replyMarkup = bot.keyboard(
        arrTasks,
        { resize: true }
    );
    return bot.sendMessage(msg.chat.id, tareasStr, { replyMarkup });
}); */

/* bot.on('/buttons', msg => {

    let replyMarkup = bot.keyboard([
        [bot.button('contact', 'Your contact'), bot.button('location', 'Your location')],
        ['/back', '/hide']
    ], { resize: true });

    return bot.sendMessage(msg.from.id, 'Button example.', { replyMarkup });

}); */
/* bot.on('/cancelar', msg => {
    return bot.sendMessage(
        msg.from.id, 'Cancelaste.', { replyMarkup: 'hide' }
    );
}); */

/* bot.on("/removetask", (msg) => {
    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton("callback", { callback: "this_is_data" }),
            bot.inlineButton("inline", { inline: "some query" }),
            bot.inlineButton("callback", { callback: "this_is_data" }),
            bot.inlineButton("inline", { inline: "some query" }),
        ],
        [bot.inlineButton("Cancelar", { url: "https://telegram.org" })],
    ]);

    console.log(msg.message_id);

    // bot.deleteMessage(mensaje.message_id)
    return bot.sendMessage(msg.chat.id, "Inline keyboard example.", {
        replyMarkup,
    });
}); */

bot.on(["/all"], async (msg) => {
    const userAdminList = await bot.getChatAdministrators(msg.chat.id);

    const memberList = [];

    userAdminList.map(
        ({ user }) => !user.is_bot && memberList.push(user.username)
    );

    const message = `@${memberList.join(" @")} `;

    bot.sendMessage(msg.chat.id, message);
});

// bot.on(['/start', '/back'], msg => {

//     let replyMarkup = bot.keyboard([
//         ['/buttons', '/inlineKeyboard'],
//         ['/start', '/hide']
//     ], { resize: true });

//     return bot.sendMessage(msg.from.id, 'Keyboard example.', { replyMarkup });

// });

bot.on(["/cat"], (msg) => {
    const randomPick = Math.floor(Math.random() * 1000);
    axios
        .get(`http://placekitten.com/g/${randomPick}`, {
            responseType: "arraybuffer",
        })
        .then((res) => {
            const buffer = Buffer.from(res.data, "base64");
            bot.sendPhoto(msg.chat.id, buffer, {
                caption: `@${msg.from.first_name} hoy sos`,
            });
        })
        .catch((err) => {
            console.error(err);
        });
});

bot.start();
