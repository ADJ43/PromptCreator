function sendPrompt() {
    const topic = document.getElementById('topic').value;
    const style = document.getElementById('style').value;
    const tone = document.getElementById('tone').value;
    const language = document.getElementById('language').value;
  
    const data = JSON.stringify({
      topic: topic,
      style: style,
      tone: tone,
      language: language
    });
  
    fetch('http://localhost:3030/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('response').textContent = JSON.stringify(data, null, 2);
    });
  }
  