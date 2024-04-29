import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;
app.use(express.json());

// Define the path to your JSON file
const filePath = "user.json";

// Read users data
app.get("/users", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    try {
      const users = JSON.parse(data);
      console.log(users);
      res.json(users);
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      res.status(500).send("Error parsing JSON data");
    }
  });
});
// Add more users
app.post("/users", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }
    try {
      const users = JSON.parse(data);

      const { id, name, email, password } = req.body;

      // Alternatively, you can directly assign values to the properties
      const newUser = {};
      newUser.id = id;
      newUser.name = name;
      newUser.email = email;
      newUser.password = password;

      // Add the new user to the existing users array
      users.push(newUser);

      newUser.email = email;

      // Write the updated data back to the file
      fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return res.status(500).send("Error writing file");
        }
        res.json(newUser); // Send the new user as response
      });
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      res.status(500).send("Error parsing JSON data");
    }
  });
});

// Update user password
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id); // Convert id parameter to integer

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    try {
      const users = JSON.parse(data);

      // Find the user with the specified ID
      const userToUpdate = users.find((user) => user.id === userId);
      console.log("updated user", userToUpdate);

      // If user is found, update the user properties

      if (userToUpdate) {
        const { name, email, password } = req.body;
        userToUpdate.name = name;
        userToUpdate.email = email;
        userToUpdate.password = password;

        // Write the updated data back to the file
        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Error writing file");
          }
          res.json(userToUpdate); // Send the updated user as response
        });
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      res.status(500).send("Error parsing JSON data");
    }
  });
});

//Delete the user
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }
    try {
      const users = JSON.parse(data);
      const remainingUsers = users.filter((user) => user.id !== userId);
      console.log(`remaining users: ${remainingUsers}`);
      if (remainingUsers.length !== users.length) {
        fs.writeFile(filePath, JSON.stringify(remainingUsers), (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Error writing file");
          }
          res
            .status(200)
            .send(`User with ID ${userId} has been deleted successfully`);
        });
      } else {
        res.status(404).send("User not found");
      }
    } catch (err) {
      console.error("Error parsing JSON data:", error);
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
