import express, { Request, Response, NextFunction } from "express";
import auth from "./middleware/auth";
import userRoute from "./routes/user.routes";
import memberRoute from "./routes/member.routes";
import db from "./models";
import cors from "cors"; // Importing cors directly
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser");
const { swaggerServe, swaggerSetup } = require("./config/config");
const cron = require('node-cron');
import { Encrypt } from "./controllers/common/encryptpassword";
import cronJobs from "./controllers/TradesController";
import emailServices from "./emailServices/emailServices";
import fees_service from "./middleware/fees_service";
import codeController from "./controllers/service/code.controller";

const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

const app = express();

app.use(cors()); // Enable CORS for all routes

// Handle preflight requests
app.options("*", cors());

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(bodyParser.text({ limit: "500mb" }));
// Static file serving
app.use("/profile", express.static(__dirname + "/profile"));
app.use("/productimage", express.static(__dirname + "/productimage"));
app.use("/productvideo", express.static(__dirname + "/productvideo"));
app.use("/kyc", express.static(__dirname + "/kyc"));
app.use("/articleimg", express.static(__dirname + "/articleimg"));


app.use(express.static("resources"));

// API routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/member", auth, memberRoute);
app.use("/verify", swaggerSetup);
app.use("/api-docs", swaggerServe, swaggerSetup);


// To get it working for all sources, use this instead:
// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);     

  // Pass to next layer of middleware
  next();
});

app.get('/', function (req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  res.send('hello world')
})
// Welcome endpoint
const port = process.env.PORT || 4000;

app.get("/api/v1/welcome", (req, res) => {
  res.status(200).send({
    message: `https://api.asvatok.com/api-docs`,
    data: {
      active: true,
    },
  });
});

app.get('/api/v1/reset-password-form', async (req, res) => {  
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(400).send('Failed to reset password');
    }

    // Decode the token to extract the email
    const decode = jwt.decode(token);

    if (!decode || !decode.email) {
      return res.status(400).send('Failed to reset password');
    }

    const email = decode.email;

    const updatePassword = await db.users.findOne({
      where: { email },
    });

    if (!updatePassword) {
      return res.status(400).send('Failed to reset password');
    }

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: linear-gradient(to right, #191654, #43C6AC);
            }

            .container {
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                width: 400px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            h2 {
                text-align: center;
                color: #4CAF50;
            }

            input[type="password"] {
                width: 100%;
                padding: 12px;
                margin: 8px 0;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .btn {
                width: 100%;
                background-color: #4CAF50;
                color: white;
                padding: 14px 20px;
                margin: 8px 0;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            }

            .btn:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Reset Password</h2>
            <form id="resetPasswordForm">
                <input type="password" id="password" name="password" placeholder="New Password" required>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required>
                <button type="button" class="btn" id="submitBtn">Reset Password</button>
            </form>
        </div>

        <script>
            document.getElementById('submitBtn').addEventListener('click', async function() {
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }

                try {
                    const response = await fetch(\`https://api.asvatok.com/api/v1/resetpassword?password=\${encodeURIComponent(password)}&token=\${encodeURIComponent("${token}")}\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        alert('Password reset successfully!');
                         window.location.href = 'https://asvatok.com/'; // Redirect to the specified URL
                    } else {
                        alert('Error resetting password.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred.');
                }
            });
        </script>
    </body>
    </html>`;

    res.send(html);
  } catch (e) {
    console.log(e);
    return res.status(400).send('Internal server error');
  }
});

app.post('/api/v1/resetpassword', async (req, res) => {
  try {
    const token = req.query.token
    const password = req.query.password

    const decode = jwt.decode(token)
    const email = decode.email;

    if (!token) {
      return res.status(400).send('Failed to reset password (token)');
    }

    // Decode the token to extract the email

    if (!decode || !email) {
      return res.status(400).send('Failed to reset password (decode/email)');
    }

    if (!password) {
      return res.status(400).send('Failed to reset password');
    }

    console.log(email, "email");
    console.log(password, "password");

    const hash = await Encrypt.cryptPassword(password.toString());

    // Update the user's password in the database
    const updatePassword = await db.users.update(
      { password: hash },  // assuming the password field in the DB is 'password'
      { where: { email: email } }
    );

    if (updatePassword) {
      // Sending the reset password success response
      return res.status(200).send(`Password reset successful for ${email}`);
    } else {
      return res.status(400).send(`Failed to reset password for ${email}`);
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send('Internal server error');
  }
});

app.get('/api/v1/verify', async (req, res: Response) => {
  // Get the token from the query parameters
  //  const email = (req as any).user?.email;
  try {
    const token = req.query.token
    const decode = jwt.decode(token);

    const email = decode.email

    let accountNumber =  await codeController.generateAccountNumber()
    const insert = await db.users.update({
      email,
      active: true,
      accountNumber
    }, {
      where: {
        email
      }
    });

    const html = await emailServices.redirectToHome()
    return res.status(200).send(html);
  } catch (error) {
    return res.status(400).send(`Internal server error`);
  }

});
// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ error: { message: err.message } }); // Send error message instead of the entire error object
});

// Database synchronization and server startup
db.sequelize.sync().then(async() => {

  // if (cluster.isPrimary) {
  //   console.log(`Primary ${process.pid} is running`);

  //   // Fork workers.
  //   for (let i = 0; i < numCPUs; i++) {
  //     cluster.fork();
  //   }

  //   cluster.on('exit', (worker: { process: { pid: any; }; }, code: any, signal: any) => {
  //     console.log(`worker ${worker.process.pid} died`);
  //   });

    //  Optionally, you could place the cron job here if you want it to run only in the primary process
    // cron.schedule('*/10 * * * * *', async () => {
      //  cronJobs.checkAllMatchingTrades()  
      // console.log('running a task every minute');
    // });
  // await fees_service()

  // } else {
  app.listen(port, async () => {
    // console.log(`App Started on port ${port} and Worker ${process.pid} started`);
    await fees_service()
    console.log("App Started");
  });
  // }
});
