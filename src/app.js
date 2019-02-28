// this is an example of improting data from JSON
import orders from '../data/orders.json';

export default (function () {
    // YOUR CODE GOES HERE
    // next line is for example only
    document.getElementById('app').innerHTML = '<h1>Hello WG Forge</h1>';

    const ordersTable = document.createElement('TABLE');
    document.body.appendChild(ordersTable);


    const tableHead = document.createElement('THEAD');
    ordersTable.appendChild(tableHead);

    const tableRow = document.createElement('TR');
    tableHead.appendChild(tableRow);

    createTableHeader('Transaction ID', tableRow);
    createTableHeader('User Info', tableRow);
    createTableHeader('Order Date', tableRow);
    createTableHeader('Order Amount', tableRow);
    createTableHeader('Card Number', tableRow);
    createTableHeader('Card Type', tableRow);
    createTableHeader('Location', tableRow);

    const tableBody = document.createElement('TBODY');
    ordersTable.appendChild(tableBody);

    orders.forEach(order => {
        createOrderRow(order, tableBody);
    });

    function createTableHeader(th_name, tableRow){
        const tableHeader = document.createElement('TH');
        const text = document.createTextNode(th_name);
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader);
    }

    function createOrderRow(order, tableBody){
        const tableRow = document.createElement('TR');
        tableRow.setAttribute('id', `order_${order.id}`);
        createCell(tableRow, order.transaction_id);
        createCell(tableRow, order.user_id).className = 'user_data';
        createCell(tableRow, new Date(parseInt(order.created_at, 10)));
        createCell(tableRow, '$'+order.total);
        createCell(tableRow, getFormattedCardNumber(order.card_number));
        createCell(tableRow,order.card_number);
        createCell(tableRow, order.order_country);
        createCell(tableRow, order.order_ip);
        tableBody.appendChild(tableRow);
    }

    function getFormattedCardNumber(cardNumber) {
        return cardNumber;
    }

    function createCell(tableRow, data){
        const tableData = document.createElement('TD');
        const text = document.createTextNode(data);

        tableData.appendChild(text);
        tableRow.appendChild(tableData);

        return tableData;
    }

}());
