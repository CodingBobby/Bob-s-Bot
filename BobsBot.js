/*
                    _________________________
                   |---|--- Bob's Bot ---|---|
                    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
                          VERSION 0.02

>> Project started in 2k17 by Bob Walter with the distag Bob#7648. <<
     >> All information took from the official documentation. <<
                 >>  https://discord.js.org/ <<

                     Join my Discord server
              >>   http://discord.gg/bobshome   <<

*/

// Requires
const Discord = require("discord.js"); // Imports Discord.js libary
const fs = require("fs"); // FileSave module
const config = require("./config.json"); // Imports configuration file
const owner = require("./owner.json"); // Owner settings

// Login settings
const disbot = new Discord.Client(); // Client name is disbot
disbot.login(config.general.token); // Logs in with token from config.json
disbot.on("debug", (m) => console.log(`\n[debug]\n\n`, m)); // Debug connection
disbot.on("warn", (m) => console.log(`\n[warn]\n\n`, m)); // Ask for possible issues
disbot.on("ready", () => { // Online announcement and game sttings
  console.log(`\nHere I am! - <@!${disbot.user.id}> \nNow serving ${disbot.users.size} users on ${disbot.guilds.size} servers with ${disbot.channels.size} channels!`); // Console message to confirm a successful start
  var lG = 1; // Change to 0 to stop loopGames
  function loopGame() { // Sets random games
    setTimeout(function() {
      disbot.user.setGame(`${config.general.prefix}help | ${config.vars.games[Math.floor(Math.random()*config.vars.games.length)]}`);
      if(lG > 0){
        loopGame();
      }
    },50000)
  }
  loopGame(); // Loops displayed game
});

//
// TEST | STABLE VERSION 0.02c
//

// Load specific files
var LOADDIR = config.directories.music
let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));

// Welcome message
disbot.on("guildMemberAdd", member => {
  setTimeout(function() {
    const channel = member.guild.channels.find("name", `${config.channels.welcome}`);
    if(!channel) return; // If channel was deleted
    var agree = "rules.agree";
    channel.send(`**Welcome to Bob's Home,** ${member}**!** Please read ${member.guild.channels.find("name", `${config.channels.rules}`)} and accept the listed rules by typing \`${agree}\` in this channel.`);

    setTimeout(function() { // Logs the event
      if(!member.guild.channels.find("name", `${config.channels.log}`)) return; // Return if no log channel was set
      function joinLog() {
        const embedLog = new Discord.RichEmbed();
          embedLog.setColor(config.colors.join);
          embedLog.setAuthor("Member Joined", member.user.avatarURL);
          embedLog.setTimestamp();
          embedLog.setFooter("Joined Server", disbot.user.avatarURL);
          embedLog.setThumbnail(member.user.avatarURL);
          embedLog.addField("UserTag", member.user.tag, true);
          embedLog.addField("UserID", `<@!${member.user.id}>`, true);
          embedLog.addField("Account created on:", member.user.createdTimestamp);
          disbot.channels.find("name", `${config.channels.log}`).sendEmbed(embedLog);
      }
      joinLog();
    },`${Math.round(disbot.ping)}`*3);

  },`${Math.round(disbot.ping)}`*3);
});

// Leave message
disbot.on("guildMemberRemove", member => {
  // Logs the event
  if(!member.guild.channels.find("name", `${config.channels.log}`)) return; // Return if no log channel was set
  function leaveLog() {
    const embedLog = new Discord.RichEmbed();
      embedLog.setColor(config.colors.leave);
      embedLog.setAuthor("Member Left", member.user.avatarURL);
      embedLog.setTimestamp();
      embedLog.setFooter("Left Server", disbot.user.avatarURL);
      embedLog.setThumbnail(member.user.avatarURL);
      embedLog.addField("UserTag", member.user.tag, true);
      embedLog.addField("UserID", member.user.id, true);
      disbot.channels.find("name", `${config.channels.log}`).sendEmbed(embedLog);
  }
  leaveLog();
});

// Message interaction w/o prefix
disbot.on("message", async message => {

  // Preventing bot replying on his own and dm messages
  if(message.author.bot || message.channel.type === "dm") return;

  // Join application
  function ruleAgree() {
    if(message.content === "rules.agree") {
      roleID = message.guild.roles.find("name", config.roles.user).id;
      message.member.addRole(roleID).catch(console.error);
    } else if(message.content === "rules.disagree") {
      message.member.kick("Disagreed with the rules");
    }
  }
  ruleAgree();

  // Replies
  async function userReplies() {

    if(message.content === "ayy") { // Ayy - Lmao
      message.channel.send("lmao");
    }

    if(message.content === "nice") { // Nice - Yes
      let nice = `${config.vars.nice[Math.floor(Math.random()*config.vars.nice.length)]}`;
      message.channel.send(`${nice}`);
    }

    if(message.content === "lenny") { // Lenny
      const lenny = await message.channel.send("(° ͜ʖ°)");
      setTimeout(function(){
        lenny.edit("( ‾ʖ̫‾)");
        setTimeout(function(){
          lenny.edit("( ͡°- ͡°)");
          setTimeout(function(){
            lenny.edit("( ͡° ᴥ ͡°)");
            setTimeout(function(){
              lenny.edit("(͡• ͜໒ ͡• )");
              setTimeout(function(){
                lenny.edit("( ͡° ͜ʖ ͡°)");
              },1000);
            },1000);
          },1000);
        },1000);
      },1000);
    }

  }
  userReplies();

  // Level system
  function lvlSystem() {
    if(!points[message.author.id]) points[message.author.id] = { // If user isn't saved already
      points: 0, // Set points and level to 0
      level: 0
    };

    let userData = points[message.author.id];
    userData.points++;
    if(message.content.startsWith(config.general.prefix)) {
      userData.points++; // Adds another point if message was a commands
    }

    let currentLvl = Math.floor(0.1 * Math.sqrt(userData.points));
    if(currentLvl > userData.level) {
      userData.level = currentLvl;
      message.reply(`you've leveled up to level **${currentLvl}**!`); // Level-up message
    }

    if(!message.content.startsWith(config.general.prefix) || message.author.bot) return; // Stops running code if message contains no prefix, has been sent by a bot or via dm
    const args = message.content.split(/\s+/g); // Separates command and given arguments
    const command = args.shift().slice(config.general.prefix.length).toLowerCase(); // Separates command and bot's prefix

    if(command === "level") {
      message.reply(`you're level **${userData.level}**!`);
    }

    fs.writeFile("./points.json", JSON.stringify(points), (err) => { // Saves points and level to json
      if(err) console.error(err);
    });
  }
  lvlSystem();

});

// Commands that just work for me
disbot.on("message", (message) => {
  if(!message.content.startsWith(config.general.prefix) || message.author.bot || message.author.id !== owner.ownerID) return; // Stops running code if message contains no prefix, has been sent by a bot or a member without the ownerID
  const args = message.content.split(/\s+/g); // Separates command and given arguments
  const command = args.shift().slice(config.general.prefix.length).toLowerCase(); // Separates command and bot's prefix

  if(command === "test") { // Simple test command to see if bot's alive
    message.reply("yep!");
  }
  /*
  // Commands below clear points.json for some reason
  if(command === "logout") { // Logs out
    disbot.logOut((err) => {
      console.log(err);
    });
  }

  if(command === "login") { // Logs in, works only if bot was logged out before
    disbot.login(config.general.token, (err) => {
      console.log(err);
    });
  }

  if(command === "destroy") { // Completely shuts down bot
    disbot.destroy((err) => {
      console.log(err);
    });
  }
  */
});

// User & Admin Commands - w/ prefix
disbot.on("message", async message => {
  if(!message.content.startsWith(config.general.prefix) || message.author.bot || message.channel.type === "dm") return; // Stops running code if message contains no prefix, has been sent by a bot or via dm
  const args = message.content.split(/\s+/g); // Separates command and given arguments
  const command = args.shift().slice(config.general.prefix.length).toLowerCase(); // Separates command and bot's prefix

  // User commands
  function userCommands() {

    // General commands for chat interaction
    async function generalCommands() {

      if(command === "help") { // Help
        const embedHelp = new Discord.RichEmbed(); // Creates embedding
        embedHelp.setColor(config.colors.help);
        embedHelp.setAuthor(`Here's your help, ${message.author.username}:`, disbot.user.avatarURL);
        embedHelp.addField("The prefix to use with *all* commands:", `${config.general.prefix}`);
        embedHelp.addField("General commands:", "`ping` - Check how cool I am \n`avatar` - See your profile in its full beauty \n`invite` - Get a link to invite your buddies to this pure awesomeness \n`flipcoin` - Flip a coin \n`rolldice` - Roll a dice");
        embedHelp.addField("Role commands:", "`roles` - Get further help for role commands")
        embedHelp.addField("Level commands:", "`level` - See which level you're currently in")
        embedHelp.addField("Music commands:", "Use command `music` to get more info");
        embedHelp.setFooter("Bob's Home | since 2k17", disbot.user.avatarURL);
        message.channel.sendEmbed(embedHelp); // Sends help
      }

      if(command === "roles") { // Role help
        const embedRoleHelp = new Discord.RichEmbed();
        embedRoleHelp.setColor(config.colors.help);
        embedRoleHelp.setAuthor(`Here's your help, ${message.author.username}:`, disbot.user.avatarURL);
        embedRoleHelp.addField("Role commands:", "`giveme` - Get a self-assignable role \n`remove` - Get rid of a self-assignable role");
        embedRoleHelp.addField("Available roles:", `\n\n**Regions:** \n\`${config.roles.regions}\` \n\n**Languages:** \n\`${config.roles.languages}\` \n\n**Games:** \n\`${config.roles.games}\` \n\n**Creative:** \n\`${config.roles.creative}\``);
        embedRoleHelp.setFooter("Bob's Home | since 2k17", disbot.user.avatarURL);
        message.channel.sendEmbed(embedRoleHelp); // Sends help
      }

      if(command === "music") { // Music help
        const embedMusicHelp = new Discord.RichEmbed();
        embedMusicHelp.setColor(config.colors.help);
        embedMusicHelp.setAuthor(`Here's your help, ${message.author.username}:`, disbot.user.avatarURL);
        embedMusicHelp.addField("General commands:", "Music feature currently in progress.");
        embedMusicHelp.setFooter("Bob's Home | since 2k17", disbot.user.avatarURL);
        message.channel.sendEmbed(embedMusicHelp); // Sends help
      }

      if(command === "ping") { // Ping test
        const ping = await message.channel.send("Calculating ping...");
        ping.edit(`Pong!!! Got a ping of ${ping.createdTimestamp - message.createdTimestamp}ms. API response took ${Math.round(disbot.ping)}ms.`);
      }

      if(command === "pong") { // Pong test
        message.reply("it doesn't work like that -.-");
      }

      if(command === "avatar") { // Get a bigger view on your avatar
        let avatar = `${config.vars.avatar[Math.floor(Math.random()*config.vars.avatar.length)]}`;
        const embedAvatar = new Discord.RichEmbed();
        embedAvatar.setColor(config.colors.help);
        embedAvatar.setAuthor(`${avatar}, ${message.author.username}:`, disbot.user.avatarURL);
        embedAvatar.setImage(message.author.avatarURL);
        message.channel.sendEmbed(embedAvatar);
      }

      if(command === "invite") { // Get server invite
        message.reply("invite your dudes with this: http://discord.gg/bobshome")
      }

      if(command === "flipcoin") { // Flips coin
        const flipcoin = await message.channel.send("Flipping coin...");
        setTimeout(function(){
          let coin = `${config.vars.coin[Math.floor(Math.random()*config.vars.coin.length)]}`;
          flipcoin.edit(`Flipped it! I see **${coin}**`);
        },800);
      }

      if(command === "rolldice") { // Rolles dice
        const rolldice = await message.channel.send("Rolling dice...");
        setTimeout(function(){
          let dice = `${config.vars.dice[Math.floor(Math.random()*config.vars.dice.length)]}`;
          rolldice.edit(`Rolled it! And got a **${dice}**`);
        },800);
      }
    }
    generalCommands();

    // Commands to apply changes to your roles
    function roleCommands() {
      if(command === "giveme") { // Get roles
        let giveRole = message.content.split(" ").slice(1, 2)[0]; // Get asked role from comman
        if(!giveRole) { // If nothing was given
          message.reply("tell me an available role to give you!"); // Reply
          return; // Return to beginning
        }
        if(config.roles.regions.indexOf(giveRole) === -1 && config.roles.creative.indexOf(giveRole) === -1 && config.roles.games.indexOf(giveRole) === -1 && config.roles.languages.indexOf(giveRole) === -1) { // If asked role is not self-assignable
          message.reply("sorry but there's no role like that!"); // Reply
        } else if(config.roles.regions.indexOf(giveRole) > -1 || config.roles.creative.indexOf(giveRole) > -1 || config.roles.games.indexOf(giveRole) > -1 || config.roles.languages.indexOf(giveRole) > -1) {
          let roleID = message.guild.roles.find("name", giveRole).id; // Get ID of asked role from server
          if(!message.member.roles.has(roleID)) { // If member doesn't have the asked role already
            message.member.addRole(roleID).catch(console.error); // Give member asked role
            const embedRole = new Discord.RichEmbed(); // If asked role was given
              embedRole.setColor(config.colors.giveRole);
              embedRole.setAuthor(`Added you to @${giveRole}!`, disbot.user.avatarURL);
            message.channel.sendEmbed(embedRole); // Reply
          } else { // If member already has the asked role
            message.reply("why're ya asking for that, you already have it!"); // Reply
          }
        }
      }

      if(command === "remove") { // Remove roles
        let rmRole = message.content.split(" ").slice(1, 2)[0]; // Get asked role from command
        if(!rmRole) { // If nothing was given
          message.reply("tell me what to remove from you!"); // Reply
          return; // Return to beginning
        }
        if(config.roles.regions.indexOf(rmRole) === -1 && config.roles.creative.indexOf(rmRole) === -1 && config.roles.games.indexOf(rmRole) === -1 && config.roles.languages.indexOf(rmRole) === -1) { // If asked role is not self-assignable
          message.reply("sorry but there's no role like that!"); // Reply
        } else if(config.roles.regions.indexOf(rmRole) > -1 || config.roles.creative.indexOf(rmRole) > -1 || config.roles.games.indexOf(rmRole) > -1 || config.roles.languages.indexOf(rmRole) > -1) {
          let roleID = message.guild.roles.find("name", rmRole).id; // Get ID of asked role from server
          if(message.member.roles.has(roleID)) { // If member actually has the role
            message.member.removeRole(roleID).catch(console.error); // Give member asked role
            const embedRole = new Discord.RichEmbed(); // If asked role was given
              embedRole.setColor(config.colors.rmRole);
              embedRole.setAuthor(`Took @${rmRole} away from you!`, disbot.user.avatarURL);
            message.channel.sendEmbed(embedRole); // Reply
          } else { // If member doesn't have the asked role
            message.reply("you don't even have that role!"); // Reply
          }
        }
      }
    }
    roleCommands();

    // Commands for voice channel usage
    function musicCommands() {
      // In progress
    }
    musicCommands();
  }
  userCommands();

  // Admin commands
  async function adminCommands() {

    if(command === "kick") { // Kick
      if(!message.member.roles.some(r=>[config.roles.owner, config.roles.admin].includes(r.name)) ) // Checks if user has required role
        return message.reply("Nope. You're not allowed to kick butts."); // Message if user can't kick members
      let member = message.mentions.members.first();
      if(!member) // Checks if a valid member was mentioned
        return message.reply("Mention a valid member first!"); // Message if no member was mentioned or the member isn't valid
      if(!member.kickable) // Checks if member can be kicked by that user
        return message.reply("Somehow I can't kick him/her :CriticalThink:");
      let reason = args.slice(1).join(' '); // Separates command/mention and given reason
      if(!reason) // Checks if a reason was given
        return message.reply("Hey boi, gimme a reason to do that!"); // Message if no reason was given
      await member.kick(reason) // Finally kicks the damn member
        .catch(error => message.reply(`Yo, I couldn't kick that bitch! :Wat: ${error}`)); // Message if an error occured
      message.channel.send(`${message.member.toString()} kicked **${member.user.tag}**! :Yay: The reason was "${reason}".`); // Message after member was successfully kicked
    }

    if(command === "ban") { // Ban
      if(!message.member.roles.some(r=>[config.roles.owner, config.roles.admin].includes(r.name)) ) // Checks if user has required role
        return message.reply("Nope. You can't swing the hammer!"); // Message if user can't kick members
      let member = message.mentions.members.first();
      if(!member) // Checks if a valid member was mentioned
        return message.reply("Mention a valid member first!"); // Message if no member was mentioned or the member isn't valid
      if(!member.bannable) // Checks if member can be banned by that user
        return message.reply("Shit! I can't hammer that dude! :Wat:");
      let reason = args.slice(1).join(' '); // Separates command/mention and given reason
      if(!reason) // Checks if a reason was given
        return message.reply("Yo boi, I don't ban anyone without a reason!"); // Message if no reason was given
      await member.ban(reason) // Finally swings the hammer
        .catch(error => message.reply(`Hey this didn't work out ${message.author.tag}! :Wat; ${error}`)); // Message if an error occured
      message.channel.send(`${message.member.toString()} has swung Mjölnir and hammered **${member.user.tag}**!`); // Message after member was successfully banned
    }

    if(command === "setprefix") { // Prefix
      if(!message.member.roles.some(r => [config.roles.owner].includes(r.name)) ) // Checks if user has required role
        return message.reply("Nahh, don't do that!"); // Message if user can't change the prefix
      let newPrefix = message.content.split(" ").slice(1, 2)[0]; // Splits written command to detect new prefix
      config.prefix = newPrefix; // Changes prefix in config to new prefix
      fs.writeFile("./config.json", JSON.stringify(sonfig), (err) => console.error); // saves config
    }

    function announce() { // Announcement function
      let announcement = args.join(" "); // Saves given announcement into variable
      const embedAnnounce = new Discord.RichEmbed(); // Creates embedding around announcement
      embedAnnounce.setColor(config.colors.announce);
      embedAnnounce.addField("New Announcement by " + message.author.username, `*${announcement}*`);
      embedAnnounce.setAuthor("Hey guys!", message.author.avatarURL);
      embedAnnounce.setFooter("Announced on");
      embedAnnounce.setTimestamp();
      disbot.channels.find("name", `${config.channel.announce}`).sendEmbed(embedAnnounce); // Sends announcement to given channel
      message.channel.sendMessage(`:ok_hand: Annoucement sent to ${disbot.channels.find("name", `${config.channel.rules}`)}`); // Confirms that announcement has been sent
    }
    if(command === "everyannounce") { // @Everyone annoucement
      if(!message.member.roles.some(r => [config.roles.owner, config.roles.admin].includes(r.name)) ) // Checks if user has required role
        return message.reply("Nuu, you don't have permission for that!"); // Message if user can't announce
      const everyoneRole = disbot.guild.roles.some(r => "everyone".includes(r.name)); // Line doesn't work
      disbot.channels.find("name", `${config.channels.announce}`).everyoneRole.mention();
      announce();
    }
    if(command === "announce") { // General announcement
      if(!message.member.roles.some(r => [config.roles.owner, config.roles.admin].includes(r.name)) ) // Checks if user has required role
        return message.reply("Nuu, you don't have permission for that!"); // Message if user can't announce
      announce();
    }
  }
  adminCommands();

});
