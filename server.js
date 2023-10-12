const express = require('express');
const path = require('path');
const app = express();
const port = 3030;
const openai = require('openai-api');
const fs = require('fs');
const axios = require('axios');


// get the API key from the json file
let apiKey = "";
fs.readFile('openai_key.json', (err, data) => {
  console.log("data:"+data)
    if (err) throw err;
    let key = JSON.parse(data);
    console.log(key);
    apiKey = key['OPENAI_API_KEY'];
    }   
);
//const openai = new OpenAIAPI({
//   key: process.env.OPENAI_API_KEY

//openai = new openai('OPENAI_API_KEY'); 


// Middleware to parse JSON payloads in POST requests
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static('./'));

// Serve index.html at the root URL '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});


// POST route
app.post('/test-prompt', async(req, res) => {
    const topic = req.body.topic;
    const style = req.body.style;
    const tone = req.body.tone;
    const language = req.body.language;
    res.json({  message: "Write a 100 word article on this topic: " + topic + "using this tone: " + tone + " in this style: " + style + " in this language: " + language });
});
// Existing imports and setup here...

// New /prompt POST route
app.post('/prompt', async(req, res) => {
    const topic = req.body.topic;
    const style = req.body.style;
    const tone = req.body.tone;
    const language = req.body.language;
    try {
        let prompt = "Write a 100 word article on this topic: " + topic + "using this tone: " + tone + " in this style: " + style + " in this language: " + language;
       
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          };
          
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: `${prompt}`}],
          },
          { headers }
        );
    
        const chatGptResponse = response.data.choices[0].message.content;
          // send response back to client in the form of a JSON object
          // containing the response from the GPT-3 chatbot.
         
        console.log('ChatGPT Respnse:'+ JSON.stringify(chatGptResponse));
        res.json({ message: chatGptResponse });
      } catch (err) {
        console.log('Error: ' + err);
        res.status(500).json({ error: 'An error occurred while processing your request' });
        }
  });
    
    
// Test API key
app.get('/test-key', async (req, res) => {
  try {
    await openai.createCompletion({
      prompt: "test",
      max_tokens: 5
    });
    res.send("API key is valid");
  } catch (error) {
    res.send("API key is invalid");
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
