const convertExcel = require('excel-as-json').processFile;

const options = {
  sheet: '1',
  omitEmptyFields: false,
};

const callback = (err) => {
  if (err) {
    console.log('JSON Conversion Error:' + err);
  }
};

const srcFile = 'source/Data_Test_WRN_bulk.xlsx';

convertExcel(srcFile, 'dest/map.json', options, callback);
