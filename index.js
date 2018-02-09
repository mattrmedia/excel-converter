// Documentation for excel-as-json
// https://github.com/stevetarver/excel-as-json

const path = require('path');
const fs = require('fs');
const convertExcel = require('excel-as-json').processFile;

const srcFolder = './source/';
const options = {
  sheet: '1',
  omitEmptyFields: false,
};

const callback = (err) => {
  if (err) {
    console.log('JSON Conversion Error: ' + err);
  } else {
    console.log('JSON Conversion Successful!');
  }
};

fs.readdir(srcFolder, (err, files) => {
  files.forEach((file) => {
    const srcFile = srcFolder + file;
    const filePath = 'dest/' + path.parse(file).name;
    const finalPath = filePath + '/map.json';

    convertExcel(srcFile, finalPath, options, callback);
  });
});
