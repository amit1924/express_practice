//  The urlencoded middleware is used to parse incoming requests with URL-encoded payloads. This middleware is particularly useful when dealing with form submissions where data is sent using the application/x-www-form-urlencoded content type.

import express from "express";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

// simple html form
app.get("/", (req, res) => {
  res.send(`
        <form action="/submit" method="POST" style="text-align:center;
        color:red; margin:90px;padding:35px; border:2px solid blue;background-color:pink ">
        
        <label for="">Name: </label>
        <input type ="text" id="name" name="name"/><br/><br/><br/><br/>
       
        <label for="">Email: </label>
        <input type ="email" id="email" name="email"/><br/><br/><br/><br/>
       <button type="submit">Submit</button>
        </form>
       `);
});

app.post("/submit", (req, res) => {
  // Access parse form data
  const { name, email } = req.body;
  res.send(`Name:${name}<br/><br/>Email:${email}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Output with extended: true

// {
//   "user": {
//     "name": "John",
//     "age": "30"
//   }
// }

// Output with extended: false

// {
//   "user[name]": "John",
//   "user[age]": "30"
// }
