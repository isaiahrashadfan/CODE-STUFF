const fs = require('node:fs');
const yappers = require('../../yappers.json');

const { booleanTrue } = require('@sapphire/shapeshift');
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeframe')
        .setDescription('Sets the timeframe for which you will be monitored (closely).')
        .addNumberOption(option => option.setName('duration').setDescription('Session length').setRequired(true)),

    async execute(interaction) {
        let sessionLength = interaction.options.getNumber('duration');
        let date = new Date();
        let newTime = new Date(date.getTime() + sessionLength * 60000); // in epoch, new time

        yappers[interaction.user.username] = newTime.getTime() // writes up a new entry for dictionary with its key value
        fs.writeFileSync('./yappers.json' , JSON.stringify(yappers, null , 2)) // actually writes into the dictionary with the new entry
        await interaction.reply("**your timeframe has been set for *" + sessionLength + "* minutes** \n***your session will end at " + newTime.toLocaleTimeString('en-US') + "***");
    },
}