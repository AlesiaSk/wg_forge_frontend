// this is an example of improting data from JSON
import orders from '../data/orders.json';

export default (function () {
    // YOUR CODE GOES HERE
    // next line is for example only
    document.getElementById('app').innerHTML = '<h1>Hello WG Forge</h1>';

    const tableElement = document.createElement('TABLE');
    document.body.appendChild(tableElement);


    const theadElement = document.createElement('THEAD');
    tableElement.appendChild(theadElement);

    const trElement = document.createElement('TR');
    theadElement.appendChild(trElement);

    createTH('Transaction ID', trElement);
    createTH('User Info', trElement);
    createTH('Order Date', trElement);
    createTH('Order Amount', trElement);
    createTH('Card Number', trElement);
    createTH('Card Type', trElement);
    createTH('Location', trElement);

    const tbodyElement = document.createElement('TBODY');
    tableElement.appendChild(tbodyElement);

    orders.forEach(order => {
        createTRwithTD(order, tbodyElement);
    });

    function createTH(th_name, trElement){
        const thElement = document.createElement('TH');
        const textElement = document.createTextNode(th_name);
        thElement.appendChild(textElement);
        trElement.appendChild(thElement);
    }

    function createTRwithTD(order, tbodyElement){
        const trElement = document.createElement('TR');
        trElement.setAttribute('id', `order_${order.id}`);
        setTD(trElement, order.transaction_id);
        setTD(trElement, order.user_id).className = 'user_data';
        setTD(trElement, new Date(parseInt(order.created_at, 10)));
        setTD(trElement, '$'+order.total);
        setTD(trElement, getFormattedCardNumber(order.card_number));
        setTD(trElement,order.card_number);
        setTD(trElement, order.order_country);
        setTD(trElement, order.order_ip);
        tbodyElement.appendChild(trElement);
    }

    function getFormattedCardNumber(cardNumber) {
        return cardNumber;
    }

    function setTD(trElement, data){
        const tdElement = document.createElement('TD');
        const text = document.createTextNode(data);

        tdElement.appendChild(text);
        trElement.appendChild(tdElement);

        return tdElement;
    }

}());
