// this is an example of improting data from JSON
import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

import './styles.css';


export default (function () {
    const tableBody = document.getElementById('orders_table_body');

    let currentCellWithArrow;
    fillTableBody(orders);

    const transactionIdHeaderElement = document.getElementById('transaction_id_header');

    transactionIdHeaderElement.onclick = function () {
        fillTableBody(orders.sort((order1, order2) => order1.transaction_id.localeCompare(order2.transaction_id)));
    };

    const orderDateHeaderElement = document.getElementById('order_date_header');

    orderDateHeaderElement.onclick = function () {
        fillTableBody(orders.sort((order1, order2) => {
            return order2.created_at > order1.created_at ? -1 : order2.created_at < order1.created_at ? 1 : 0;
        }))
    };

    const orderAmountHeaderElement = document.getElementById('order_amount_header');

    orderAmountHeaderElement.onclick = function () {
        fillTableBody(orders.sort((order1, order2) => {
            return order1.total > order2.total ? -1 : order1.total < order2.total ? 1 : 0;
        }))
    };

    function fillTableBody(orders) {
        tableBody.innerHTML = "";

        orders.forEach(order => {
            addTableRow(order, tableBody);
        });
    }

    function addTableRow(order, tableBody) {
        const tableRow = document.createElement('TR');
        tableRow.setAttribute('id', `order_${order.id}`);
        addTableCell(tableRow, order.transaction_id);
        addTableCell(tableRow, order.user_id, order).className = 'user_data';
        addTableCell(tableRow, getFormattedDate(new Date(parseInt(order.created_at, 10))));
        addTableCell(tableRow, '$' + order.total);
        addTableCell(tableRow, getFormattedCardNumber(order.card_number));
        addTableCell(tableRow, order.card_type);
        addTableCell(tableRow, `${order.order_country} (${order.order_ip})`);
        tableBody.appendChild(tableRow);
    }

    function getFormattedCardNumber(cardNumber) {
        return cardNumber.split('').map((currentValue, index, array) => (
            (index < 2 || index > array.length - 5) ? currentValue : '*'
        )).join('');
    }

    function getGenderPrefix(gender) {
        if (gender === 'Female') {
            return 'Ms.';
        }
        return 'Mr.';
    }

    function handleUserNameClick(userDetailsElement) {
        if (userDetailsElement.classList.contains('hidden')) {
            userDetailsElement.classList.remove('hidden');
        } else {
            userDetailsElement.classList.add('hidden');
        }
    }

    function addParagraphWithText(userDetailsElement, text) {
        const paragraphElement = document.createElement('P');

        paragraphElement.appendChild(document.createTextNode(text));
        userDetailsElement.appendChild(paragraphElement);
    }

    function addParagraphWithImg(userDetailsElement, imageSrc) {
        const paragraphElement = document.createElement('P');
        const imageElement = document.createElement('IMG');

        imageElement.src = imageSrc;
        imageElement.width = 100;
        paragraphElement.appendChild(imageElement);
        userDetailsElement.appendChild(paragraphElement);
    }

    function addParagraphWithLink(userDetailsElement, title, url) {
        const paragraphElement = document.createElement('P');

        paragraphElement.appendChild(document.createTextNode('Company: '));
        if (url) {
            const companyLink = document.createElement('A');
            companyLink.href = url;
            companyLink.target = '_blank';
            companyLink.appendChild(document.createTextNode(title));
            paragraphElement.appendChild(companyLink);
        } else {
            paragraphElement.appendChild(document.createTextNode(title));
        }

        userDetailsElement.appendChild(paragraphElement);
    }

    function getFormattedDate(date) {
        return (`${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`);
    }

    function addTableCell(tableRow, data, order) {
        const tableData = document.createElement('TD');

        if (order) {
            const userDetailsElement = document.createElement('DIV');
            const user = users.find((currentUser) => {
                    return currentUser.id === order.user_id;
                }
            );

            const userLink = document.createElement('A');
            userLink.href = '#';
            const fullName = `${getGenderPrefix(user.gender)} ${user.first_name} ${user.last_name}`;
            userLink.appendChild(document.createTextNode(fullName));
            tableData.appendChild(userLink);

            userDetailsElement.className = "user-details hidden";
            userLink.onclick = function (event) {
                event.preventDefault();
                handleUserNameClick(userDetailsElement);
            };

            const company = companies.find((currentCompany) => {
                    return currentCompany.id === user.company_id;
                }
            );

            if (user.birthday) {
                addParagraphWithText(userDetailsElement, getFormattedDate(new Date(parseInt(user.birthday, 10))));
            }
            if (user.avatar) {
                addParagraphWithImg(userDetailsElement, user.avatar);
            }

            if (company) {
                addParagraphWithLink(userDetailsElement, company.title, company.url);
                addParagraphWithText(userDetailsElement, `Industry: ${company.industry}`);
            }
            tableData.appendChild(userDetailsElement);

        } else {
            tableData.appendChild(document.createTextNode(data));
        }

        tableRow.appendChild(tableData);

        return tableData;
    }
}());
