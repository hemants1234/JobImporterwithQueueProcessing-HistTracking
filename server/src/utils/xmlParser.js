const xml2js = require('xml2js');

exports.parseXML = async (xml) => {
  const parser = new xml2js.Parser({ explicitArray: true });
  return await parser.parseStringPromise(xml);
};
