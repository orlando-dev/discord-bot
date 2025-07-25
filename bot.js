const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com Pong!'),

  new SlashCommandBuilder()
    .setName('msg')
    .setDescription('Envia uma mensagem personalizada')
    .addStringOption(option =>
      option.setName('texto')
        .setDescription('A mensagem que você quer enviar')
        .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Iniciando registro dos comandos...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
})();

client.once('ready', () => {
  console.log(`🤖 Bot ${client.user.tag} está online com Slash Commands!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  } else if (interaction.commandName === 'msg') {
    const texto = interaction.options.getString('texto');
    await interaction.reply(`📢 ${texto}`);
  }
});

client.login(TOKEN);
