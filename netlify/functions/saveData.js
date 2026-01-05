//const express = require("express");
const {google} = require("googleapis");

exports.handler = async (event) => {

  const body = JSON.parse(event.body);

  const auth = new google.auth.GoogleAuth({
    //keyFile: "credentials.json",
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      // IMPORTANT: replace escaped newlines or the key won't work
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: "https://www.googleapis.com/auth/spreadsheets",

  });

  const client = auth.getCilent();

  const gooleSheets = google.sheets({ version: "v4", auth: client});

  //const metaData = await googleSheets.spreadsheets.get(
  //  auth,
  //  "13fNUlWnVrKkvKDo__0kwAdTUoN_Rgjbcvfdkkj9lwvQ",
  //});

  // read all sheet1
  //const getRows = await googleSheets.spreadsheets.values.get({
  //  auth,
  //  "13fNUlWnVrKkvKDo__0kwAdTUoN_Rgjbcvfdkkj9lwvQ",
  //  range:"sheet1",
  //});

  // wiite to sheet1
  const data = await googleSheets.spreadsheets.values.append({
    auth,
    "13fNUlWnVrKkvKDo__0kwAdTUoN_Rgjbcvfdkkj9lwvQ",
    range:"sheet1",
    valueInputOption: "USER_ENTERED",
    resource: body,
  });

  
  //console.log("body:",body);
  //const response = await fetch('', {
  //  method: 'POST',
  //  body: JSON.stringify(body),
  //  headers: {'Content-Type': 'application/json'}
  //});
  //const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}
