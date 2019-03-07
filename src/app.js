// this is an example of improting data from JSON
import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

import './styles.css';


export default (function () {
    const ordersData = getOrdersData();
    let currentOrdersData = getOrdersData();
    const tableBody = document.getElementById('orders_table_body');

    let currentCellWithArrow;

    fillTableBody(currentOrdersData);

    const inputElement = document.getElementById('search');

    inputElement.addEventListener("input", (event) => search(event.target.value));

    function getOrdersData() {
        return orders.map(order => {
            const user = users.find((currentUser) => {
                    return currentUser.id === order.user_id;
                }
            );

            const company = companies.find((currentCompany) => {
                    return currentCompany.id === user.company_id;
                }
            );

            return {
                ...order,
                created_at: parseInt(order.created_at, 10),
                total: parseFloat(order.total),
                user: user,
                company: company,
                userFullName: `${user.first_name} ${user.last_name}`

            }
        })
    }

    const transactionIdHeaderElement = document.getElementById('transaction_id_header');

    transactionIdHeaderElement.onclick = function () {
        fillTableBody(currentOrdersData.sort((order1, order2) => order1.transaction_id.localeCompare(order2.transaction_id)));
        setArrowToElement(this);
    };

    const orderDateHeaderElement = document.getElementById('order_date_header');

    orderDateHeaderElement.onclick = function () {
        fillTableBody(currentOrdersData.sort((order1, order2) => {
            return order2.created_at > order1.created_at ? -1 : order2.created_at < order1.created_at ? 1 : 0;
        }));
        setArrowToElement(this);
    };

    const orderAmountHeaderElement = document.getElementById('order_amount_header');

    orderAmountHeaderElement.onclick = function () {
        fillTableBody(currentOrdersData.sort((order1, order2) => {
            return order1.total < order2.total ? -1 : order1.total > order2.total ? 1 : 0;
        }));
        setArrowToElement(this);
    };

    const userInfoHeaderElement = document.getElementById('user_info_header');

    userInfoHeaderElement.onclick = function () {
        fillTableBody(currentOrdersData.sort((order1, order2) => {
            return order1.userFullName < order2.userFullName ? -1 : order1.userFullName > order2.userFullName ? 1 : 0;
        }));
        setArrowToElement(this);
    };

    const cardTypeHeaderElement = document.getElementById('card_type_header');

    cardTypeHeaderElement.onclick = function () {
        fillTableBody(currentOrdersData.sort((order1, order2) => {
            return order1.card_type < order2.card_type ? -1 : order1.card_type > order2.card_type ? 1 : 0;
        }));
        setArrowToElement(this);
    };

    const locationHeaderElement = document.getElementById('location_header');

    locationHeaderElement.onclick = function () {
        fillTableBody(currentOrdersData.sort((order1, order2) => {
            if (order1.order_country.localeCompare(order2.order_country) < 0) {
                return -1;
            }
            if (order2.order_country.localeCompare(order1.order_country) > 0) {
                return 1;
            }
            if (order1.order_ip.localeCompare(order2.order_ip) < 0) {
                return 1;
            }

            if (order2.order_ip.localeCompare(order1.order_ip) > 0) {
                return -1;
            }
            return 0;
        }));
        setArrowToElement(this);
    };

    function search(dataFromUser) {
        debugger;


        currentOrdersData = ordersData.filter(order => {
            return order.total.toString().includes(dataFromUser) || order.userFullName.includes(dataFromUser) || order.transaction_id.includes(dataFromUser) || order.card_type.includes(dataFromUser) || order.order_ip.includes(dataFromUser) || order.order_country.includes(dataFromUser);
        });

        fillTableBody(currentOrdersData);

    }

    function getArrowElement() {
        const arrowSpan = document.createElement('SPAN');
        arrowSpan.innerHTML = '&#8595';

        return arrowSpan;
    }

    function setArrowToElement(element) {
        currentCellWithArrow && currentCellWithArrow.removeChild(currentCellWithArrow.getElementsByTagName('SPAN')[0]);
        element.appendChild(getArrowElement());
        currentCellWithArrow = element;
    }

    function fillTableBody(currentOrdersData) {
        clearTableBody();

        currentOrdersData.forEach(order => {
            addTableRow(order, tableBody);
        });

        createStatistics();
    }

    function clearTableBody() {
        tableBody.innerHTML = "";
    }

    function addTableRow(order, tableBody) {
        const tableRow = document.createElement('TR');
        tableRow.setAttribute('id', `order_${order.id}`);
        addTableCell(tableRow, order.transaction_id);
        addTableCell(tableRow, order.user_id, order).className = 'user_data';
        addTableCell(tableRow, getFormattedDate(new Date(order.created_at)));
        addTableCell(tableRow, '$' + order.total);
        addTableCell(tableRow, getFormattedCardNumber(order.card_number));
        addTableCell(tableRow, order.card_type);
        addTableCell(tableRow, `${order.order_country} (${order.order_ip})`);
        tableBody.appendChild(tableRow);
    }

    function createStatistics() {
        crateTableRowWithJointColumns('Orders Count');
        crateTableRowWithJointColumns('Orders Total');
        crateTableRowWithJointColumns('Median Value');
        crateTableRowWithJointColumns('Average Check');
        crateTableRowWithJointColumns('Average Check (Female)');
        crateTableRowWithJointColumns('Average Check (Male)');
    }

    function crateTableRowWithJointColumns(name) {
        let statisticsResult;
        const tableRow = document.createElement('TR');
        const dataHeader = addTableCell(tableRow, name);
        dataHeader.colSpan = "4";
        if (name === 'Orders Count') {
            statisticsResult = addTableCell(tableRow, getTotalOrders(currentOrdersData));
        } else if (name === 'Orders Total') {
            statisticsResult = addTableCell(tableRow, `$ ${getTotalAmount(currentOrdersData)}`);
        } else if (name === 'Median Value') {
            statisticsResult = addTableCell(tableRow, `$ ${getMedian()}`);
        } else if (name === 'Average Check') {
            statisticsResult = addTableCell(tableRow, `$ ${getAverageCheck(currentOrdersData)}`);
        } else if (name === 'Average Check (Female)') {
            statisticsResult = addTableCell(tableRow, `$ ${getAverageCheck(getOrdersByGender('Female'))}`);
        } else if (name === 'Average Check (Male)') {
            statisticsResult = addTableCell(tableRow, `$ ${getAverageCheck(getOrdersByGender('Male'))}`);
        }

        statisticsResult.colSpan = "3";
        tableBody.appendChild(tableRow);
    }

    function getTotalOrders(array) {
        return array.length;
    }

    function getOrdersByGender(gender) {
        return currentOrdersData.filter(order => {
            return order.user.gender === gender;
        });
    }

    function getAverageCheck(orderItems) {
        return ((getTotalAmount(orderItems) / getTotalOrders(orderItems)).toFixed(2));
    }

    function getTotalAmount(array) {
        return (array.reduce((amount, currentValue) => {
            if (currentValue.total) {
                return amount + parseFloat(currentValue.total);
            } else {
                return amount + parseFloat(currentValue);
            }
        }, 0)).toFixed(2);
    }

    function getMedian() {
        const sortedOrderAmount = getDescendingSortingAmount();
        const centralElementForOdd = (sortedOrderAmount[(sortedOrderAmount.length / 2) + 1] + sortedOrderAmount[(sortedOrderAmount.length / 2) + 1]) / 2;
        if (sortedOrderAmount % 2 === 0) {
            return sortedOrderAmount[((sortedOrderAmount.length + 1) / 2)];
        } else {
            return centralElementForOdd;
        }
    }

    function getDescendingSortingAmount() {
        const sortedOrdersTotal = currentOrdersData.sort((order1, order2) => {
            return order1.total > order2.total ? -1 : order1.total < order2.total ? 1 : 0;
        });

        return sortedOrdersTotal.map((currentValue) => (
            (currentValue.total)));
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
        const ordersDataElement = document.createElement('TD');

        if (order) {
            const userDetailsElement = document.createElement('DIV');
            const userLink = document.createElement('A');
            const user = order.user;
            const company = order.company;

            userLink.href = '#';
            const fullName = `${getGenderPrefix(user.gender)} ${order.userFullName}`;
            userLink.appendChild(document.createTextNode(fullName));
            ordersDataElement.appendChild(userLink);

            userDetailsElement.className = "user-details hidden";
            userLink.onclick = function (event) {
                event.preventDefault();
                handleUserNameClick(userDetailsElement);
            };

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
            ordersDataElement.appendChild(userDetailsElement);

        } else {
            ordersDataElement.appendChild(document.createTextNode(data));
        }

        tableRow.appendChild(ordersDataElement);

        return ordersDataElement;
    }
}());
