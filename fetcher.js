const request = require('request');
const fs = require('fs');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

let url = process.argv.slice(2)[0];
let localFilePath = process.argv.slice(2)[1];

// In fetch, we put write function as a param, then call the param function inside it (pass the body to the write function)
const fetch = (url, writeFunc) => {
  // load the webpage, seems like the first second and third params in the callback would always be error, response and body of the website
  request(url, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      console.log('response: ', response && response.statusCode);
      return;
    }
    writeFunc(localFilePath, body);
  })
};

const write = (localFilePath, body) => {
  //write body to specific path
    if(localFilePath) {
      rl.question('File already exists. Do you want to overwrite? Press "Y/N"  ',(answer) => {
        if (answer === 'Y' || answer === 'y') {
          fs.writeFile(localFilePath, body, () => {
            console.log(`Downloaded and saved ${body.length} bytes to ${localFilePath}`);
            rl.close();
            })
        } else process.exit();
      })
    } else {
      fs.writeFile(localFilePath, body, () => {
        console.log(`Downloaded and saved ${body.length} bytes to ${localFilePath}`);
        })
    }
}


fetch(url, write);

// Below is code that puts fs.write into fetch as a callback, but not a param of fetch. We pass the param of fetech directly to the callback. Also works.

// const fetch = (url, localFilePath) => {
//   // load the webpage, seems like the first second and third params in the callback would always be error, response and body of the website
//   request(url, (error, response, body) => {
//     if (error) {
//       console.log('Error: ', error);
//       console.log('response: ', response && response.statusCode);
//       return;
//     }
//     write(localFilePath, body.toString());
//   })
// };

// fetch(url, localFilePath);