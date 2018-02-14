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

const flatten = (data) => {
  const flatArr = data.reduce((obj, value) => {
    Object.keys(value).forEach((i) => {
      if (value[i] !== '') {
        obj.push(value[i]);
      }
    });
    return obj;
  }, []);
  return flatArr;
};

const reformat = (data) => {
  const formatted = [];
  data.forEach((obj) => {
    Object.keys(obj).forEach((k) => {
      if (obj[k] === '' || undefined) {
        delete obj[k];
      } else if (Array.isArray(obj[k])) {
        obj[k] = flatten(obj[k]);
      }
    });
    formatted.push(obj);
  });
  return formatted;
};

const cb = (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log('JSON Reformatted!');
  }
};

const reformatFile = (fpath) => {
  fs.readFile(fpath, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const unformattedData = JSON.parse(data);
      const newFormat = JSON.stringify(reformat(unformattedData));
      fs.writeFile(fpath, newFormat, cb);
    }
  });
};

const callback = (err, data, dst) => {
  if (err) {
    console.log('JSON Conversion Error: ' + err);
  } else {
    console.log('JSON Conversion Successful!', 'Formatting JSON.');
    reformatFile(dst);
  }
};

fs.readdir(srcFolder, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      const srcFile = srcFolder + file;
      const filePath = 'dest/' + path.parse(file).name;
      const finalPath = filePath + '/map.json';

      convertExcel(srcFile, finalPath, options, callback);
    });
  }
});
