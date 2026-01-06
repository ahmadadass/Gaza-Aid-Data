const { google } = require("googleapis");

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
    
    // حساب عدد الأفراد
    const wivesCount = (body.wives || []).length;
    const childrenCount = (body.children || []).length;
    
    // تجهيز الصف (Array of values)
    const row1 = [
      body.submissionDate || new Date().toISOString(), // العمود 1: التاريخ
      head.fullName || "",                             // العمود 2: الاسم الرباعي
      head.id || "",                                   // العمود 3: الهوية
      head.phones?.primary || "",                      // العمود 4: الجوال
      housing.current?.area || "",                     // العمود 5: المنطقة الحالية
      housing.current?.type || "",                     // العمود 6: نوع السكن
      wivesCount,                                      // العمود 7: عدد الزوجات
      childrenCount,                                   // العمود 8: عدد الأبناء
      housing.whatsapp || "",                          // العمود 9: واتساب
      JSON.stringify(body)                             // العمود 10: كافة التفاصيل (JSON) كنسخة احتياطية
    ];

    const row = [
        head.firstName || "",
        head.fatherName || "",
        head.grandName || "",
        head.firstName || "",
        head.id || "",
        head.dob || "",
        head.socialStatus || "",
        head.health.chronic || "",
        head.health.details || "",
        head.health.warInjury || "",
        head.health.injuryDetails || "",
        head.health.injuryDate || "",
        head.health.injuryEffect || "",
        head.spouseStatus || "",
        head.job || "",
        head.deceasedSpouse.name || "",
        head.deceasedSpouse.id || "",
        head.phones.primary || "",
        head.phones.alt || "",
        housing.original.city || "",
        housing.original.street || "",
        housing.original.desc || "",
        housing.current.gov || "",
        housing.current.area || "",
        housing.current.type || "",
        housing.hasMartyrWife || "",
        housing.wives || "",
        housing.children || "",
        housing.martyrs || ""
    ];

    console.log("wives:",wives);
    for (let i = 0;i < 5; i++) {
        console.log("wives[" + i + "]:",wives[i]);
        row.push(wives[i]?.name || "");
        row.push(wives[i]?.id || "");
        row.push(wives[i]?.dob || "");
        row.push(wives[i]?.phone || "");
        row.push(wives[i]?.pregnant || "");
        row.push(wives[i]?.nursing || "");
        row.push(wives[i]?.sick || "");
        row.push(wives[i]?.diseaseDetails || "");
        row.push(wives[i]?.injured || "");
        row.push(wives[i]?.injuryDesc || "");
        row.push(wives[i]?.injuryDate || "");
        row.push(wives[i]?.missing || "");
        row.push(wives[i]?.prisoner || "");
        row.push(wives[i]?.prisonDate || "");
    }

    console.log("children:",children);
    for (let i = 0;i < 13; i++) {
        console.log("children[" + i + "]:",children[i]);
        row.push(children[i]?.id || "");
        row.push(children[i]?.dob || "");
        row.push(children[i]?.phone || "");
        row.push(children[i]?.pregnant || "");
        row.push(children[i]?.nursing || "");
        row.push(children[i]?.sick || "");
        row.push(children[i]?.diseaseDetails || "");
        row.push(children[i]?.injured || "");
        row.push(children[i]?.injuryDesc || "");
        row.push(children[i]?.injuryDate || "");
        row.push(children[i]?.missing || "");
        row.push(children[i]?.prisoner || "");
        row.push(children[i]?.prisonDate || "");
   }

    console.log("martyrs:",martyrs);
    for (let i = 0;i < 5; i++) {
        console.log("martyrs[" + i + "]:",martyrs[i]);
        row.push(martyrs[i]?.name || "");
        row.push(martyrs[i]?.relation || "");
        row.push(martyrs[i]?.id || "");
        row.push(martyrs[i]?.date || "");
    }

    row.push(JSON.stringify(body));  // العمود 10: كافة التفاصيل (JSON) كنسخة احتياطية


    console.log("adding row:",row);

    // 3. الإضافة إلى الشيت
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId: spreadsheetId, // تم إضافة المفتاح المفقود
      range: "sheet1", // تأكد أن اسم الورقة في جوجل شيت هو sheet1
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