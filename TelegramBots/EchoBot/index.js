require('dotenv').config()
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.ECHO_BOT_TELEGRAM_TOKEN)

const helpMessage = `
available commands:
  /echo - echoes a message written after
  usage: /echo <message>

  /help - prints this message
`

bot.start((ctx) => ctx.reply('Welcome!'))

bot.help((ctx) => {
    ctx.reply(helpMessage)
})

bot.command('echo', ctx => {
    const message = ctx.message.text.split(' ')

    // remove the first element from array
    // bot will not print '/echo' command in the reply
    message.shift()

    ctx.reply(message.join(' '))
})

console.log('Bot is starting...')
bot.launch().then(() => console.log('Bot is online.'))
