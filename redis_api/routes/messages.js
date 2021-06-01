var express = require("express");
var router = express.Router();
const redis = require("redis");

// key message:from_id:to_id:timestamp  value <message_string>

/* POST: CREATE MESSAGE */
router.post("/", function (req, res, next) {
  if (!req.body.from || !req.body.to || !req.body.message) {
    res.status(400);
    res.json({ error: "Missing parameter: message, from or to" });
    return;
  }

  const client = redis.createClient("redis://redis:6379");

  client.on("error", function (err) {
    res.status(500);
    res.json(err);
    return;
  });

  client.set(
    `message:${req.body.from}:${req.body.to}:${new Date().getTime()}`,
    req.body.message,
    (err, result) => {
      if (err) {
        res.status(500);
        res.json(err);
        return;
      }

      res.json({ message: result });
    }
  );
});

router.get("/", function (req, res, next) {
  if (!req.query.from || !req.query.to) {
    res.status(400);
    res.json({ error: "Missing parameter: message, from or to" });
    return;
  }

  var messageResult = {};
  messageResult.messages = [];

  var messageResult2 = {};
  messageResult2.messages = [];

  const client = redis.createClient("redis://redis:6379");

  client.on("error", function (err) {
    res.status(500);
    res.json(err);
    return;
  });

  client.KEYS(`message:${req.query.from}:${req.query.to}:*`, (error, keys) => {
    if (error) {
      res.status(500);
      res.json(error);
      return;
    }

    client.mget(keys, (error, messages) => {
      if (error) {
        res.status(500);
        res.json(error);
        return;
      }

      messages.forEach((message, index) => {
        messageResult.messages.push({
          user: req.query.from,
          timestamp: keys[index].split(":")[3],
          message: message,
        });
      });

      client.KEYS(
        `message:${req.query.to}:${req.query.from}:*`,
        (error2, keys2) => {
          if (error2) {
            res.status(500);
            res.json(error2);
            return;
          }

          client.mget(keys2, (error, messages) => {
            if (error) {
              res.status(500);
              res.json(error);
              return;
            }

            messages.forEach((message, index) => {
              messageResult2.messages.push({
                user: req.query.to,
                timestamp: keys2[index].split(":")[3],
                message: message,
              });
            });

            res.json(sortMessageArray(messageResult.messages, messageResult2.messages))

          });
        }
      );
    });
  });
});

sortMessageArray = (messageArray1 = [], messageArray2 = []) => {

  var messages = messageArray1.concat(messageArray2);

  messages.sort((a,b) => (a.timestamp < b.timestamp) ? -1 : (a.timestamp > b.timestamp) ? 1 : 0)

  return {messages: messages};

} 

module.exports = router;
