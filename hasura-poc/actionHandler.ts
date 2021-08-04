const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const getProfileInfo = (user_id) => {
  const headers = {
    Authorization: "Bearer " + process.env.AUTH0_MANAGEMENT_API_TOKEN,
  };
  console.log(headers);
  return { email: "myemail", picture: "mypic" };
};

app.post("/auth0", async (req, res) => {
  // get request input
  const { session_variables } = req.body;

  const user_id = session_variables["x-hasura-user-id"];
  // make a rest api call to auth0
  return getProfileInfo(user_id).then(function (resp) {
    console.log(resp);
    if (!resp) {
      return res.status(400).json({
        message: "error happened",
      });
    }
    return res.json({
      email: resp.email,
      picture: resp.picture,
    });
  });
});

app.listen(PORT);
