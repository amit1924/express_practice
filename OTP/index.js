// import express from "express";
// import twilio from "twilio";
// import dotenv from "dotenv";

// const app = express();
// const PORT = 3000;
// dotenv.config();

// app.get("/", (req, res) => {
//   res.send("<h1>Twilio</h1>");
// });

// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE;
// const client = twilio(accountSid, authToken);

// const users = [
//   {
//     username: "amish198",
//     password: "test1234",
//     phone: "+918340616588",
//   },
//   {
//     username: "amit19",
//     password: "test12345",
//     phone: "+919771685293",
//   },
// ];

// app.use(express.json());

// // Login Routes
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find(
//     (u) => u.username === username && u.password === password
//   );
//   if (!user) {
//     return res.status(403).json({ message: "Invalid Credentials" });
//   }

//   // Generate OTP
//   const otp = generateOTP();
//   console.log("typeof otp:", typeof otp);
//   // Set the lastGeneratedOTP property for the user
//   user.lastGeneratedOTP = otp;
//   sendOTP(user.phone, otp, res);
// });

// // Verify
// app.post("/verify", (req, res) => {
//   const { phone, otp } = req.body;

//   // Validate OTP
//   if (validateOTP(phone, otp)) {
//     res.json({ message: "OTP Verified Successfully" });
//     console.log(`OTP : ${phone} ${otp}`);
//     console.log(`Type of OTP :${otp}`);
//   } else {
//     console.log(`otp verification failed`);
//     res.status(403).json({ message: "Invalid OTP" });
//   }
// });

// // Function To Generate OTP(6-digit otp)
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// // Corrected sendOTP function with 'res' parameter
// const sendOTP = async (phone, otp, res) => {
//   try {
//     const message = await client.messages.create({
//       body: `Your OTP for verification is : ${otp}`,
//       from: twilioPhone,
//       to: phone,
//     });
//     console.log(message.sid);
//     res.status(200).send("OTP Successfully sent");
//   } catch (e) {
//     console.log(`Error while sending OTP: ${e.message}`);
//     res.status(500).send("OTP Error");
//   }
// };
// // Function to validate OTP
// function validateOTP(phone, otp) {
//   console.log(`Phone: ${phone} and otp: ${otp}`);
//   const user = users.find((u) => u.phone === phone);
//   if (user) {
//     // Assuming you have a way to retrieve the last generated OTP for the user
//     const generatedOTP = user.lastGeneratedOTP; // Replace 'lastGeneratedOTP' with your actual property name
//     console.log("user last generated otp :", user.lastGeneratedOTP);
//     console.log("Type of ", typeof user.lastGeneratedOTP);
//     return otp === generatedOTP;
//   }
//   return false;
// }

// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });
import express from "express";
import twilio from "twilio";
import dotenv from "dotenv";

const app = express();
const PORT = 3000;
dotenv.config();

app.get("/", (req, res) => {
  res.send("<h1>Twilio</h1>");
});

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
const client = twilio(accountSid, authToken);

const users = [
  {
    username: "amish198",
    password: "test1234",
    phone: "+918340616588",
    lastGeneratedOTP: "", // Add lastGeneratedOTP property to store OTP
    lastGeneratedTimestamp: 0, // Add lastGeneratedTimestamp property to store timestamp
  },
  {
    username: "amit19",
    password: "test12345",
    phone: "+919771685293",
    lastGeneratedOTP: "",
    lastGeneratedTimestamp: 0,
  },
];

app.use(express.json());

// Login Routes
app.post("/login", (req, res) => {
  const { username, password, phone } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(403).json({ message: "Invalid Credentials" });
  }

  // Generate OTP and timestamp
  const otp = generateOTP();
  const timestamp = Date.now(); // Current timestamp in milliseconds
  user.lastGeneratedOTP = otp; // Store OTP in user object
  user.lastGeneratedTimestamp = timestamp; // Store timestamp in user object
  sendOTP(user.phone, otp, res);
});

// Verify
app.post("/verify", (req, res) => {
  const { phone, otp } = req.body;

  // Validate OTP
  if (validateOTP(phone, otp)) {
    res.json({ message: "OTP Verified Successfully" });
    console.log(`OTP : ${phone} ${otp}`);
  } else {
    console.log(`OTP verification failed`);
    res.status(403).json({ message: "Invalid OTP" });
  }
});

// Function To Generate OTP (6-digit otp)
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Corrected sendOTP function with 'res' parameter
const sendOTP = async (phone, otp, res) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP for verification is : ${otp}`,
      from: twilioPhone,
      to: phone,
    });
    console.log(message.sid);
    res.status(200).send("OTP Successfully sent");
  } catch (e) {
    console.log(`Error while sending OTP: ${e.message}`);
    res.status(500).send("OTP Error");
  }
};

// Function to validate OTP
function validateOTP(phone, otp) {
  console.log(`Phone: ${phone} and OTP: ${otp}`);
  const user = users.find((u) => u.phone === phone);
  if (user) {
    // Retrieve the last generated OTP and timestamp for the user
    const { lastGeneratedOTP, lastGeneratedTimestamp } = user;
    if (lastGeneratedOTP && lastGeneratedTimestamp) {
      // Check if OTP is expired (2 hours)
      const currentTime = Date.now(); // Current timestamp in milliseconds
      const otpAge = currentTime - lastGeneratedTimestamp;
      const otpExpiration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      if (otpAge <= otpExpiration && lastGeneratedOTP === otp) {
        // OTP is valid and not expired
        return true;
      }
    }
  }
  return false;
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
