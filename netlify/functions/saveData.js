// netlify/functions/saveData.js
exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  console.log("body:",body);
  const response = await fetch('https://script.google.com/macros/s/AKfycbzqU9f5WBlb_u93SPP6BEGQvxOkpjHIOfUJwBzP_1hTjZOpd6ytCJWEmKd0uuFJwLUZ/exec', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  });
  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}
