// this is an example of improting data from JSON
import orders from '../data/orders.json';

export default (function () {
    const tableBody = document.getElementById('orders_table_body');

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
        return cardNumber.split('').map((currentValue, index, array) => (
            (index < 2 || index > array.length - 5) ? currentValue : '*'
        )).join('');
    }

    function createCell(tableRow, data){
        const tableData = document.createElement('TD');
        const text = document.createTextNode(data);

        tableData.appendChild(text);
        tableRow.appendChild(tableData);

        return tableData;
    }

}());
