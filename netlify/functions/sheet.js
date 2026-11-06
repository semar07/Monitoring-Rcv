// Proxy server-side untuk Google Sheets (publish to web, xlsx).
// Browser memanggil /.netlify/functions/sheet -> fungsi ini mengunduh xlsx dari Google
// lalu mengirimkannya kembali, sehingga tidak terkena blokir CORS.
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBfgYwWTp-ahBeiGyaXrTm_qxIGneAImhZwVRHFZEZjwFrG2mfE4Qfa0iJh5FHAE0BiIUilNXE5_fQ/pub?output=xlsx";

exports.handler = async () => {
  try {
    const res = await fetch(SHEET_URL, { redirect: "follow" });
    if (!res.ok) {
      return { statusCode: 502, body: "Google Sheets membalas HTTP " + res.status };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Cache-Control": "no-store",
      },
      body: buf.toString("base64"),
    };
  } catch (e) {
    return { statusCode: 502, body: "Gagal mengambil sheet: " + e.message };
  }
};
