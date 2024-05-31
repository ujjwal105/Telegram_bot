import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import userModel from './src/models/user.js'
import connectDb from './src/config/db.js'
import  eventModel from './src/models/Events.js'
import { message } from 'telegraf/filters';
import user from './src/models/user.js';

// Load environment variables from .env file
dotenv.config();

// Initialize the bot with the token from environment variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_API);

//OpenAi Instance 
const openai = new OpenAI({
  apiKey: process.env['OPENAI_KEY'], // This is the default and can be omitted
});

//Initialize DB
try {
    connectDb()
    console.log("Database Connected Succesfully...");
} catch (err) {

    console.log(err);
    process.kill(process.pid,'SIGTERM');

}



bot.start(async (ctx) => {
  //console.log("ctx", ctx);

  // Store the information of User into DB

  const from = ctx.message.from;
  console.log('from',from);

  try {
     await userModel.findOneAndUpdate({tgID:from.id},{
        $setOnInsert:{
            firstName:from.first_name,
            lastName:from.last_name,
            isBot:from.is_bot,
            userName:from.username
        }
     },{upsert:true,new:true});
    await ctx.reply(`Welcome to the Caption Bot, ${from.first_name}!
     I can help you find the perfect caption for your posts.
     
     Please provide me with the following information:
     1. Your name
     2. Your current feeling or mood
     
     For example, you can type:
     - Name: John
     - Feeling: Happy
     
     Let's get started!`);

  } catch (err) {
    console.log(err);
    await ctx.reply("Facing Dificultis ")
  }
});

bot.help((ctx)=>{
   ctx.reply("
             `
             Hi! I'm your social media caption generator bot. Here's how you can use me:

/generate - Generate a social media post caption based on your recent activity and feeling.
/help - Get a list of commands and how to use them.

To get started, simply describe what you're doing and how you're feeling, and I'll help you create a great post!

If you have any questions or need assistance, feel free to contact the bot admin: @yourusername

             `
             ")
})

bot.command('generate', async(ctx)=>{

  const from = ctx.update.message.from;
  
  const {message_id:waitingMessageId} = await ctx.reply(`
  Hey! ${from.first_name}, kindly wait for a moment. I am creating posts for you 🚀⏳
  `)

  const {message_id:loadingStickerMessageId} = await ctx.replyWithSticker(
    'CAACAgIAAxkBAAMOZgKX_Wn?pNh7-jl1FvdtHVR985gAA?4SAALsmS1Jf0_ZpUf3ZDsOBA'
  )
  
  const startOfTheDay = new Date();
  
  startOfTheDay.setHours(0,0,0,0);
  
  const endOfTheDay = new Date();
  
  endOfTheDay.setHours(23,59,59,999);
  
  
    //Get Data from the user
  
    const events = await eventModel.find({
  
      tgId:from.id,
  
      createdAt:{
  
        $gte:startOfTheDay,
  
        $lte:endOfTheDay
  
      }
    })
  
    if(events.legth === 0 ){
      await ctx.deleteMessage(waitingMessageId);
      await ctx.deleteMessage(loadingStickerMessageId);
      await ctx.reply("No Events for the Day")
      return;
    }
  
  
    console.log('events',events);
    //Make openAi Api call 
    
    try{
      const chatCompletion = await openai.chat.completions.create({
        messages:[
          {
            role:'system',
            content:'Act as a senior copywriter, you write highly engaging posts for linkedin, facebook, Instagram and twitter using provided thoughts/events throught the day.',
          },
          {
            role:'user',
            content:
            `Write Like a human, for humans. Craft three engaging social media posts tailored for LinkedIn, Facebook, and Twitter audiences. Use simple language. Use given time labels just to 
             understand the order of the event, don't mention the time in the posts. Each post should creatively highlight the following events. Ensure the tone is conversational and impactful.
             Focus on engaging the respective platform's audience, encouraging interaction, and driving interest in the events:
             ${events.map((event) => event.text).join(', ')}
             `
          }
        ],
        model:process.env.OpenAI_Model
      })

      console.log('completion',chatCompletion);

      //Store Token Count

      await userModel.findOneAndUpdate({
        tgId:from.id
      },{


        $inc:{

          promptToken:chatCompletion.usage.prompt_tokens,
          completionTokens:chatCompletion.usage.completion_tokens

        }

      })


      await ctx.deleteMessage(loadingStickerMessageId);

      await ctx.deleteMessage(waitingMessageId);

      await ctx.reply(chatCompletion.choices[0].message.content);

    }catch(err){
      console.log(err);
      await ctx.reply("Facing Difficulties, Try again after some time")
    }

  
  });

bot.on(message('text'),async (ctx)=>{

  const from = ctx.update.message.from;
  const message = ctx.update.message.text;


  try {
    await eventModel.create({
      text:message,
      tgId:from.id,
    })

    await ctx.reply("'Noted 👍, Keep texting me your thoughts. To generate the posts, just enter the command: /generate'");


  } catch (err) {
    console.log(err);
    await ctx.reply("Facing Dificulties, pls try again later");
  }
  console.log(ctx); 
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
