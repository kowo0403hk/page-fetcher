const request = require('request-promise-native');
const fs = require('fs');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

let url = process.argv.slice(2)[0];
let localFilePath = process.argv.slice(2)[1];

const fetch = () => {
  return request(url);
};

const write = (body) => {
  // first check if file already exists
  fs.access(localFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      // if error, it means file doesn't exist, write file directly
      fs.writeFile(localFilePath, body, () => {
        console.log(`Downloaded and saved ${body.length} bytes to ${localFilePath}`);
        process.exit();
        });
    } else {
      // if no error, it means file already exists, we have to ask the user if he/she wants to overwrite
      rl.question('File already exists. Do you want to overwrite? Press "Y/N"  ',(answer) => {
        if (answer === 'Y' || answer === 'y') {
          fs.writeFile(localFilePath, body, () => {
            console.log(`Downloaded and saved ${body.length} bytes to ${localFilePath}`);
            rl.close();
          })
        } else process.exit();
      })
    }
  })
};

const fetchPromise = () => {
  fetch()
    .then(write)
    .catch((error) => {
      console.log(error);
      process.exit();
    });
};

fetchPromise();