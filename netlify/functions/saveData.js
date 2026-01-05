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
        body.headOfFamily.firstName || "",
        body.headOfFamily.fatherName || "",
        body.headOfFamily.grandName || "",
        body.headOfFamily.firstName || "",
        body.headOfFamily.id || "",
        body.headOfFamily.dob || "",
        body.headOfFamily.socialStatus || "",
        body.headOfFamily.health.chronic || "",
        body.headOfFamily.health.details || "",
        body.headOfFamily.health.warInjury || "",
        body.headOfFamily.health.injuryDetails || "",
        body.headOfFamily.health.injuryDate || "",
        body.headOfFamily.health.injuryEffect || "",
        body.headOfFamily.spouseStatus || "",
        body.headOfFamily.job || "",
        body.headOfFamily.deceasedSpouse.name || "",
        body.headOfFamily.deceasedSpouse.id || "",
        body.headOfFamily.phones.primary || "",
        body.headOfFamily.phones.alt || "",
        body.housing.original.city || "",
        body.housing.original.street || "",
        body.housing.original.desc || "",
        body.housing.current.gov || "",
        body.housing.current.area || "",
        body.housing.current.type || "",
        body.housing.hasMartyrWife || "",
        body.housing.wives || "",
        body.housing.children || "",
        body.housing.martyrs || "",
        JSON.stringify(body)  // العمود 10: كافة التفاصيل (JSON) كنسخة احتياطية
    ];


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