const express = require("express");
const shortid = require("shortid");
const server = express();
const PORT = 5000;
let users = [];

server.use(express.json());

// server works
server.get("/", (req, res) => {
  res.status(200).json({ api: "up and running." });
});

//Adds new user
server.post("/api/users", (req, res) => {
  const userInfo = req.body;
  userInfo.id = shortid.generate();
  if (!userInfo.name || !userInfo.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    users.push(userInfo);
    if (!users.includes(userInfo)) {
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
      });
    } else {
      res.status(201).json(userInfo);
    }
  }
});

//Gets all users
server.get("/api/users", (req, res) => {
  res.status(200).json(users);
});

//Gets user by ID
server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const specifiedUser = users.find(user => user.id === id);
  if (specifiedUser) {
    res.status(200).json(specifiedUser);
  } else {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const userToDelete = users.find(user => user.id === id);
  if (userToDelete) {
    users = users.filter(user => {
      user === userToDelete;
    });
  } else {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  }
  const isUserThere = users.find(user => user.id === userToDelete.id);
  if (isUserThere) {
    res.status(500).json({ errorMessage: "The user could not be removed" });
  }
});

server.listen(PORT, () => {
  console.log(`\n ** API on http://localhost:${PORT} **\n`);
});
