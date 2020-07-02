const axios = require("axios");

const API_KEY = "49e406b156mshac47d57b9bf09e8p148147jsn6c66055738e7";

const getSummary = async (url) => {
  

  const  res = await axios({
    method: "POST",
    url:
      "https://textanalysis-text-summarization.p.rapidapi.com/text-summarizer",
    headers: {
      "content-type": "application/json",
      "x-rapidapi-host": "textanalysis-text-summarization.p.rapidapi.com",
      "x-rapidapi-key": API_KEY,
      accept: "application/json",
      useQueryString: true,
    },
    data: {
      url: url,
      text: "",
      sentnum: 8,
    },
  });
  const data = res.data.sentences

  
  // cleaning data and creating delta for quill js
  // const arr = []
  // data.map(val=>{
  //     const obj = {}
  //     const objAttr = {}
  //     const objSpace = {}
  //     const cleanString = val.replace(/ *\[[^a-z)]*\] */g, "");

  //     obj['insert'] = cleanString;
  //     obj['attributes'] ={bold: true}
  //     arr.push(obj)

  //     objAttr['insert'] = '\n';
  //     objAttr['attributes'] ={list: 'bullet'}
  //     arr.push(objAttr)

  //     objSpace['insert'] = '\n';
  //     arr.push(objSpace)
  //   })
  //   const delta = {
  //     ops:[...arr]
  //   }  
  
    

  // return delta
  //-------------------------------------------------------------

  const arr = []
  data.map(val=>{
      const obj = {}
      const cleanString = val.replace(/ *\[[^a-z)]*\] */g, "");
      obj['checked'] =false
      obj['title'] = ''
      obj['summary'] = cleanString
      arr.push(obj)
    })
  return arr
};

module.exports = getSummary;
