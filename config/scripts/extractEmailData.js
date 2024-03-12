const fs = require('fs');

// Read the log file
fs.readFile('./backend-out.log', 'utf8', (err, logData) => {
 if (err) {
    console.error('Error reading the log file:', err);
    return;
 }

 // Regular expression to match the JSON body of each request
 const jsonBodyRegex = /Body:\s*({[^}]*})/g;
 let match;
 const jsonBodies = [];

 // Extract all JSON bodies
 while ((match = jsonBodyRegex.exec(logData)) !== null) {
    try {
      // Fix JSON format: replace single quotes with double quotes and add double quotes around property names
      let jsonBody = match[1].replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
      // Parse the JSON string to a JavaScript object
      jsonBody = JSON.parse(jsonBody);
      jsonBodies.push(jsonBody);
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }
 }

 // Write the extracted JSON bodies to requests.json
 fs.writeFile('./emails.json', JSON.stringify(jsonBodies, null, 2), (err) => {
    if (err) {
      console.error('Error writing to requests.json:', err);
      return;
    }
    console.log('Successfully wrote to requests.json');
 });
});
