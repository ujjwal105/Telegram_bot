# Telegram Bot for Generating Social Media Posts

## Project Overview

This Telegram bot helps users generate social media posts based on their daily activities and feelings. Users can interact with the bot to describe what they're doing and how they're feeling, and the bot will create a suitable caption for their social media post. This bot aims to simplify the process of crafting engaging and personalized social media content.

## Technologies Used

- **API**: 
  - **Telegraf**: For Telegram bot framework.
  - **OpenAI**: For generating creative and contextually appropriate captions.
- **JavaScript**: For programming the bot's logic.
- **MongoDB**: For storing user inputs and generated captions.
- **Node.js**: For running the bot's server-side code.

## Features

### `/generate`
This command generates a social media post caption based on the user's most recent input regarding their current activity and feeling.

**Example Usage:**
```
/generate
```

**Bot's Response:**
```
Hey! @User, kindly wait for a moment. I am creating posts for you 🚀⏳

"Enjoying a sunny day at the park! Feeling so relaxed and happy. 🌞 #Relaxation #SunnyDay"

```

### `/help`
This command provides the user with information on how to use the bot and a list of available commands. It also includes contact information for the bot admin.

**Example Usage:**
```
/help
```

**Bot's Response:**
```
Hi! I'm your social media caption generator bot. Here's how you can use me:

/generate - Generate a social media post caption based on your recent activity and feeling.
/help - Get a list of commands and how to use them.

To get started, simply describe what you're doing and how you're feeling, and I'll help you create a great post!

If you have any questions or need assistance, feel free to contact the bot admin: @yourusername
```

## How to Use

1. **Start the bot:** Begin a chat with the bot and start interacting by describing your current activity and how you're feeling.
2. **Generate a caption:** After providing your input, use the `/generate` command to receive a creative and personalized caption for your social media post.

## How to Run

1. Clone the repository:
   ```
   git clone https://github.com/ujjwal105/SocioBot.git
   ```
2. Install the required dependencies:
   ```
   cd SocioBot
   npm install
   
   ```
3. Set up your environment variables in a `.env` file:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   OPENAI_API_KEY=your_openai_api_key
   MONGODB_URI=your_mongodb_uri
   ```
4. Start the bot:
   ```
   node server.js
   
   ```

## Contributing

We welcome contributions to enhance the functionality of this bot. Feel free to fork the repository and create a pull request with your improvements.

---

Enjoy generating creative social media posts with ease! If you have any questions or feedback, please reach out through the issues section on GitHub or contact the bot admin: @yourusername.
