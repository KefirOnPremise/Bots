import { Telegraf, Markup } from "telegraf"
import fetch from "node-fetch"
import dotenv from "dotenv"

const bot = new Telegraf(
    process.env.NOPURPOSE_BOT_TELEGRAM_TOKEN
)

const second = 1000
const minute = 60 * second

var reminderText = null
var timerIsRunning = false

var halfAnHour = {
    'message': 'half an hour',
    'time': (60 * minute) / 2
}

const waitAndSendText = (ctx, timeToWait, messageToSend) => {
    setTimeout(
	function() { ctx.reply(messageToSend) },
	timeToWait
    )
}

const getRandomUser = async () => {
    let randomUser = {
	'gender': null,
	'name': {
	    'first': null,
	    'last': null
	},
	'email': null,
	'login': {
	    'username': null,
	    'password': null,
	},
	'birth': {
	    'date': null,
	    'age': null
	},
	'picture': null,
	'location': {
	    'country': null,
	    'state': null,
	    'city': null,
	}
    }

    const api = 'https://randomuser.me/api/'
    const result = await fetch(api)
	  .then(x => x.json())
	  .then(x => {
	      randomUser.gender = x.results[0].gender,
	      randomUser.name.first = x.results[0].name.first,
	      randomUser.name.last = x.results[0].name.last,
	      randomUser.email = x.results[0].email,
	      randomUser.login.username =
		  x.results[0].login.username,
	      randomUser.login.password =
		  x.results[0].login.password,
	      randomUser.birth.date =
		  x.results[0].dob.date,
	      randomUser.birth.age =
		  x.results[0].dob.age,
	      randomUser.picture = x.results[0].picture.large
	  })
	  .catch(function(error) {
	      console.log(`An error occured - ${error}`)
	  })

    return randomUser
}

const random_user_command_message = (
    gender, first_name, last_name, email,
    username, password, birth_date, birth_age,
    country, state, city
) => {
    return `
gender: ${gender}
name: ${first_name} ${last_name}
email: ${email}
login: ${username} ${password}
birth date: ${birth_date}
birth age: ${birth_age}
country: ${country}
state: ${state}
city: ${city}
`
}

bot.start(
    (ctx) => ctx.reply('Welcome!')
)

bot.command('first_dialog', (ctx) =>
    ctx.reply(
	'What do you want?',
	Markup.keyboard(
	    ['set timer', 'smoke something']
	).oneTime().resize()
    )
)

bot.hears('set timer', (ctx) =>
    ctx.reply(
	'How choose time type',
	Markup.keyboard(
	    [
		halfAnHour.message,
		'one hour',
		'one hour and a half',
		'two hours'
	    ]
	).oneTime().resize()
    )
)

bot.hears(halfAnHour.message, (ctx) =>
    ctx.reply(`
Use /half_an_hour command with message you want to get
as a reminder when time will come, eg:
  /half_an_hour cook a dinner
`)
)

bot.command('half_an_hour', (ctx) => {
    if (reminderText == null)
    {
	if (timerIsRunning == false)
	{
	    let replyArray = ctx.message.text.split(' ')
	    replyArray.shift()
	    reminderText = replyArray.join(' ')

	    ctx.reply('Timer is starting')
	    waitAndSendText(ctx, halfAnHour.time, reminderText)
	}
	else
	{
	    ctx.reply('Timer is already started')
	}
    }
    else
    {
	ctx.reply(`
Message to remind is already set.
Use /delete_reminder_text to erase it
`)
    }
})

bot.command('delete_reminder_text', (ctx) => {
    reminderText = null
    ctx.reply('Message to remind is erased')
})

bot.hears('one hour', (ctx) => ctx.reply('indev'))
bot.hears('one hour and a half', (ctx) => ctx.reply('indev'))
bot.hears('two hours', (ctx) => ctx.reply('indev'))

bot.hears(
    'smoke something',
    (ctx) => ctx.reply('call friends and arrange a meeting')
)

bot.command('random_user', (ctx) => {
    let randomUser = getRandomUser()
	.then(x => {
	    ctx.replyWithPhoto({ url: x.picture })
	    ctx.reply(
		random_user_command_message(
		    x.gender, x.name.first, x.name.last,
		    x.email, x.login.username, x.login.password,
		    x.birth.date, x.birth.age
		)
	    )
	})
})

console.log('Bot is starting...')
bot.launch().then(() => console.log('Bot is online.'))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
