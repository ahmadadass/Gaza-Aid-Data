const { google } = require("googleapis");
const path = require('path');
const { Readable } = require('stream');

exports.handler = async (event) => {
  // 1. التعامل مع طلبات OPTIONS (Preflight) لتجنب أخطاء CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body);

    console.log("body (JSON)",body);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });
    
    const spreadsheetId = "13fNUlWnVrKkvKDo__0kwAdTUoN_Rgjbcvfdkkj9lwvQ";

    // 2. تحويل كائن البيانات (JSON) إلى مصفوفة (Row) ليفهمها Google Sheets
    // ترتيب الأعمدة هنا يجب أن يطابق ترتيب الأعمدة في ملف الإكسل
    const head = body.headOfFamily || {};
    const housing = body.housing || {};
    const wives = body.wives || [];
    const children = body.children || [];
    const martyrs = body.martyrs || [];
    
    const row = [
        head.firstName || "",
        head.fatherName || "",
        head.grandName || "",
        head.familyName || "",
        head.id || "",
        head.idImage || "",
        head.dob || "",
        head.socialStatus || "",
        head.health.chronic || "",
        head.health.chronicType || "",
        head.health.chronicImage || "",
        head.health.warInjury || "",
        head.health.injuryDetails || "",
        head.health.injuryDate || "",
        head.health.injuryEffect || "",
        head.injuryImage || "",
        head.spouseStatus || "",
        head.job || "",
        head.deceasedSpouse.name || "",
        head.deceasedSpouse.id || "",
        head.deceasedSpouse.date || "",
        head.phones.primary || "",
        head.phones.alt || "",
        housing.original.city || "",
        housing.original.street || "",
        housing.original.desc || "",
        housing.current.gov || "",
        housing.current.city || "",
        housing.current.neighborhood || "",
        housing.current.landmark || "",
        housing.current.type || "",
        housing.hasMartyrWife || "",
        housing.wives || "",
        housing.children || "",
        housing.martyrs || "",
        housing.whatsapp || ""
    ];

    console.log("wives:",wives);
    Object.keys(wives).forEach((key) => {
        console.log("wives[" + key + "]:",wives[key]);
        row.push(wives[key]?.name || "");
        row.push(wives[key]?.id || "");
        row.push(wives[key]?.IdImageDrive || ""),
        row.push(wives[key]?.dob || "");
        row.push(wives[key]?.phone || "");
        row.push(wives[key]?.pregnant || "");
        row.push(wives[key]?.nursing || "");
        row.push(wives[key]?.sick || "");
        row.push(wives[key]?.diseaseImageDrive || "");
        row.push(wives[key]?.diseaseDetails || "");
        row.push(wives[key]?.injured || "");
        row.push(wives[key]?.injuryDesc || "");
        row.push(wives[key]?.injuryDate || "");
        row.push(wives[key]?.injuryImageDrive || "");
        row.push(wives[key]?.missing || "");
        row.push(wives[key]?.missingDate || "")
        row.push(wives[key]?.prisoner || "");
        row.push(wives[key]?.prisonDate || "");
    });
    const wivesCount = Object.keys(wives).length;
    for(let i=0; i < 4-wivesCount;i++){
        console.log("wives[" + i + "]:",wives[i]);
        row.push(wives[i]?.name || "");
        row.push(wives[i]?.id || "");
        row.push(wives[i]?.IdImageDrive || ""),
        row.push(wives[i]?.dob || "");
        row.push(wives[i]?.phone || "");
        row.push(wives[i]?.pregnant || "");
        row.push(wives[i]?.nursing || "");
        row.push(wives[i]?.sick || "");
        row.push(wives[i]?.diseaseImageDrive || "");
        row.push(wives[i]?.diseaseDetails || "");
        row.push(wives[i]?.injured || "");
        row.push(wives[i]?.injuryDesc || "");
        row.push(wives[i]?.injuryDate || "");
        row.push(wives[i]?.injuryImageDrive || "");
        row.push(wives[i]?.missing || "");
        row.push(wives[i]?.missingDate || "")
        row.push(wives[i]?.prisoner || "");
        row.push(wives[i]?.prisonDate || "");
    }

    console.log("children:",children);
    Object.keys(children).forEach((key) => {
        console.log("children[" + key + "]:",children[key]);
        row.push(children[key]?.id || "");
        row.push(children[key]?.dob || "");
        row.push(children[key]?.phone || "");
        row.push(children[key]?.pregnant || "");
        row.push(children[key]?.nursing || "");
        row.push(children[key]?.sick || "");
        row.push(children[key]?.missing || "");
        row.push(children[key]?.missingDate || "");
        row.push(children[key]?.diseaseDetails || "");
        row.push(children[key]?.diseaseImageDrive || "");
        row.push(children[key]?.injured || "");
        row.push(children[key]?.injuryDesc || "");
        row.push(children[key]?.injuryDate || "");
        row.push(children[key]?.injuryImageDrive || "");
        row.push(children[key]?.missing || "");
        row.push(children[key]?.prisoner || "");
        row.push(children[key]?.prisonDate || "");
    });

    const childernCount = Object.keys(children).length;
    for (let i = 0;i < 12-childernCount; i++) {
        console.log("children[" + i + "]:",children[i]);
        row.push(children[i]?.id || "");
        row.push(children[i]?.dob || "");
        row.push(children[i]?.phone || "");
        row.push(children[i]?.pregnant || "");
        row.push(children[i]?.nursing || "");
        row.push(children[i]?.sick || "");
        row.push(children[i]?.missing || "");
        row.push(children[i]?.missingDate || "");
        row.push(children[i]?.diseaseDetails || "");
        row.push(children[i]?.diseaseImageDrive || "");
        row.push(children[i]?.injured || "");
        row.push(children[i]?.injuryDesc || "");
        row.push(children[i]?.injuryDate || "");
        row.push(children[i]?.injuryImageDrive || "");
        row.push(children[i]?.missing || "");
        row.push(children[i]?.prisoner || "");
        row.push(children[i]?.prisonDate || "");
    }

    console.log("martyrs:",martyrs);
    Object.keys(martyrs).forEach((key) => {
        console.log("martyrs[" + key + "]:",martyrs[key]);
        row.push(martyrs[key]?.name || "");
        row.push(martyrs[key]?.relation || "");
        row.push(martyrs[key]?.id || "");
        row.push(martyrs[key]?.date || "");
    })

    const martyrsCount = Object.keys(martyrs).length;    
    for (let i = 0;i < 5-martyrsCount; i++) {
        console.log("martyrs[" + i + "]:",martyrs[i]);
        row.push(martyrs[i]?.name || "");
        row.push(martyrs[i]?.relation || "");
        row.push(martyrs[i]?.id || "");
        row.push(martyrs[i]?.date || "");
    }

    row.push(JSON.stringify(body));  // العمود 10: كافة التفاصيل (JSON) كنسخة احتياطية

    for (let i = 0; i < row.length; i++) {
      if (typeof row[i] === 'object' && row[i] !== null && !Array.isArray(row[i])){
        row[i] = "error intering data";
      }
    }

    console.log("adding row:",row);

    // 3. الإضافة إلى الشيت
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId: spreadsheetId, // تم إضافة المفتاح المفقود
      range: "sheet1!A:A", // تأكد أن اسم الورقة في جوجل شيت هو sheet1
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [row] // يجب أن تكون مصفوفة داخل مصفوفة
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*' // السماح بالوصول من أي مكان
      },
      body: JSON.stringify({ status: "success" })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ status: "error", message: error.message })
    };
  }
};