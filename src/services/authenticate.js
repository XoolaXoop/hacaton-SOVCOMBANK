async function authenticate(ip, data, api) {
  try {
    let request = await fetch(ip + api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return request.ok;
  } catch (err) {
    console.log(err);
  }
}
export { authenticate };