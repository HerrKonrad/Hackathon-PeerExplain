const url = 'https://alpha-vantage.p.rapidapi.com/query?interval=5min&function=TIME_SERIES_INTRADAY&symbol=MSFT&datatype=json&output_size=compact';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '2430fb70e9msha3067e616c46e9bp1d73afjsn72c8e74a45d0',
    'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
  }
};

try {
  const response = await fetch(url, options);
  if (response.ok) {
    const result = await response.text();
    document.getElementById("message").innerHTML = result;
    console.log(result);
  } else {
    console.error('Erro na solicitação:', response.status, response.statusText);
  }
} catch (error) {
  console.error(error);
}
