const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


const fs = require("fs");
require("dotenv").config();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

/*
   Defined endpoint routes:
   /getAllUsers [GET]: This will fetch all the users 
   /getUserMessages/:id [GET]: This will fetch all the messages of a particular user
   /addMessage/:userId [PUT]: This is for adding a message 
*/

// fetch all the users 
app.get("/getAllUsers", (req, res) => {
    const file = fs.readFileSync("./Database/users.json", {
      encoding: "utf8",
      flag: "r",
    });
    const userData = JSON.parse(file);
  
    if (userData) res.send(userData);
    res.send(new Error("User file is not present"));
  });


//fetch currentUser's messages
app.get("/getUserMessages/:id", (req, res) => {
  const file = fs.readFileSync("./Database/userMessages.json", {
    encoding: "utf8",
    flag: "r",
  });
  const userData = JSON.parse(file);

  const currentUser = userData.find((ele) => {
    return ele.id === req.params.id;
  });

  if (currentUser) res.send(currentUser);
  res.send(new Error("User not found"));
});


// Add message to list
app.put("/addMessage/:userId", (req, res) => {

    let userMessages = fs.readFileSync("./Database/userMessages.json", {
        encoding: "utf8",
        flag: "r",
    });

    //data of post request
    const data = req.body;

    const userMessagesData = JSON.parse(userMessages)
    const currentUserMessages = userMessagesData.find((userMessage) => {
        return userMessage.id === req.params.userId
    })
    currentUserMessages.messages.push(data)

    userMessages = userMessagesData.map((userMessage)=> {
        if(userMessage.id === req.params.userId) return currentUserMessages
        return userMessage
    })

    fs.writeFileSync("./database/userMessages.json", JSON.stringify(userMessages));
    res.json(data);

});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});