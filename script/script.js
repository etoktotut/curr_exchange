const form = document.getElementById('exchange');
const currFrom = document.getElementById('currencyFrom');
const currTo = document.getElementById('currencyTo');
const amount = document.getElementById('amount');
const result = document.getElementById('result');
const access_key = '30af7b69c7357b2d8e8c7516a5b75357';
const exchRates = {};



const postData = key =>
    fetch('http://api.exchangeratesapi.io/v1/latest?access_key=' + key + '&symbols=USD,RUB');

currTo.addEventListener('change', () => {
    result.value = '';
});
currFrom.addEventListener('change', () => {
    result.value = '';
});

form.addEventListener('submit', event => {
    event.preventDefault();
    if (currFrom.value === currTo.value || amount.value === '') {
        result.value = amount.value;
        return;
    }
    result.value = 'Ждем ответа c биржи!';
    postData(access_key)
        .then(response => {
            if (response.status !== 200) {
                throw new Error('response status not 200');
            }
            return (response.json());
        })
        .then(response => {
            const euru = response.rates.RUB;
            const euus = response.rates.USD;
            exchRates.EURRUB = euru;
            exchRates.EURUSD = euus;
            exchRates.RUBEUR = 1 / euru;
            exchRates.RUBUSD = euus / euru;
            exchRates.USDRUB = euru / euus;
            exchRates.USDEUR = 1 / euus;
            result.value = String(Math.floor(+amount.value * exchRates[currFrom.value + currTo.value], 2));
        })
        .catch(error => {
            console.error(error);
            result.value = "Ошибка запроса!";
        });

});