require('dotenv').config()
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.TOKEN)

bot.start((ctx) => ctx.reply("Hi!"))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.hears('hi', (ctx) => ctx.reply('hi, again!'))

bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('modern', ({ reply }) => reply('Yo'))
bot.command('hipster', Telegraf.reply('λ'))

bot.launch()
