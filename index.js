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
    // for (const i in value) {
    //   if (value[i] !== '') {
    //     obj.push(value[i]);
    //   }
    // }
    return obj;
  }, []);
  return flatArr;
};

const cleanData = (data) => {
  const clean = [];
  data.forEach((obj) => {
    Object.keys(obj).forEach((k) => {
      if (obj[k] === '' || undefined) {
        delete obj[k];
      } else if (Array.isArray(obj[k])) {
        obj[k] = flatten(obj[k]);
      }
    });
    clean.push(obj);
  });
  return clean;
};

const cb = (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log('JSON Cleaned!');
  }
};

const getFile = (fpath) => {
  fs.readFile(fpath, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const newData = JSON.parse(data);
      const clean = JSON.stringify(cleanData(newData));
      fs.writeFile(fpath, clean, cb);
    }
  });
};

const cleanFile = (fpath) => {
  getFile(fpath);
};

const callback = (err, data, dst) => {
  if (err) {
    console.log('JSON Conversion Error: ' + err);
  } else {
    console.log('JSON Conversion Successful!', 'Cleaning JSON.');
    cleanFile(dst);
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
