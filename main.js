//to run, use 'node main.js'


// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');
const yappers = require('./yappers.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds , GatewayIntentBits.GuildMessages] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


let counter = 0;

function yap (message) {
    const phrases = ['back to work bucko!' , 'you\'re on the clock buddy...' , 'i don\'t get paid enough for this.' , 'kids these days...' , 'noong bata ako i used to finish the job'];
    if (yappers[message.author.username])
    {
        let epochTime = yappers[message.author.username];
        let currentDate = new Date();
        let newDate = new Date(yappers[message.author.username]);
        if (currentDate < epochTime)
        {
            message.channel.send(phrases[counter] + " your time doesn't end until " + newDate.toLocaleTimeString('en-US'));
        }
        counter++;
        if(counter == (phrases.length))
        {
            counter = 0;
        }
    }

    else
    {
        return
    }
}


client.on("messageCreate", yap)

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return
    
    const command = client.commands.get(interaction.commandName)
    if (!command) return
    
    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: false })
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: false })
        }
    }
})

// Log in to Discord with your client's token
client.login(token);