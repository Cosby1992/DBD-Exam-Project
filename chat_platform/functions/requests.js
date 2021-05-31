var request = require("request");

requestTool = {};

// Used to send a post HTTP request with a body
requestTool.post = (url = "", body = {}) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: "http://" + url,
        method: "POST",
        json: true, // <--Very important!!!
        body: body,
      },
      function (error, response, body) {
        if (error) reject(error);
        else resolve({ response: response, body: body });
      }
    );
  });
};

// Used to send a post HTTP request with a body
requestTool.get = (url = "", callback) => {
  return new Promise((resolve, reject) => {
    request(
        {
          url: "http://" + url,
          method: "GET",
          // json: true, // <--Very important!!!
          // body: body,
        },
        function (error, response, body) {
            if(error) reject(error);
            else resolve({response: response, body: body})
        }
      );
  }) 
};

module.exports = requestTool;
