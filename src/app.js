// this is an example of improting data from JSON
import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

import './styles.css';


export default (function () {
    const tableBody = document.getElementById('orders_table_body');

    orders.forEach(order => {
        createOrderRow(order, tableBody);
    });

    function createTableHeader(th_name, tableRow) {
        const tableHeader = document.createElement('TH');
        const text = document.createTextNode(th_name);
        tableHeader.appendChild(text);
        tableRow.appendChild(tableHeader);
    }

    function createOrderRow(order, tableBody) {
        const tableRow = document.createElement('TR');
        tableRow.setAttribute('id', `order_${order.id}`);
        createCell(tableRow, order.transaction_id);
        createCell(tableRow, order.user_id, order).className = 'user_data';
        const date = new Date(parseInt(order.created_at, 10));
        let dateFormat = `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
        createCell(tableRow, dateFormat);
        createCell(tableRow, '$' + order.total);
        createCell(tableRow, getFormattedCardNumber(order.card_number));
        createCell(tableRow, order.card_type);
        createCell(tableRow, `${order.order_country} (${order.order_ip})`);
        tableBody.appendChild(tableRow);
    }

    function getFormattedCardNumber(cardNumber) {
        return cardNumber.split('').map((currentValue, index, array) => (
            (index < 2 || index > array.length - 5) ? currentValue : '*'
        )).join('');
    }

    function createTextParagraph(div, data) {
        const parag = document.createElement('P');
        const text = document.createTextNode(data);
        parag.appendChild(text);
        div.appendChild(parag);
    }

    function getGenderPrefix(gender) {
        if (gender === 'Female') {
            return 'Ms.';
        }
        return 'Mr.';
    }

    function handleUserNameClick(userDetailsElement) {
        if (userDetailsElement.classList.contains('hidden')){
            userDetailsElement.classList.remove('hidden');
        }
        else{
            userDetailsElement.classList.add('hidden');
        }
    }

    function addParagraphWithImg(userDetailsElement, user){
        const parag = document.createElement('P');
        const avatar = document.createElement('IMG');
        avatar.src = user.avatar;
        avatar.style.width = '100px'; //тут или width просто 100, что потом конвертируется в пиксели, но отображается как width:100, или так, но тогда добавляется style
        parag.appendChild(avatar);
        userDetailsElement.appendChild(parag);
    }

    function addParagraphWithLink(userDetailsElement, company){
        const parag = document.createElement('P');
        parag.appendChild(document.createTextNode('Company: '));
        const companyLink = document.createElement('A');
        companyLink.href = company.url;
        companyLink.appendChild(document.createTextNode(company.title));
        parag.appendChild(companyLink);
        userDetailsElement.appendChild(parag);
    }
    function createCell(tableRow, data, order) {
        const tableData = document.createElement('TD');

        if (order) {

            const user = users.find((currentUser) => {
                    return currentUser.id === order.user_id;
                }
            );

            const userLink = document.createElement('A');
            userLink.href = '#';
            const fullName = `${getGenderPrefix(user.gender)} ${user.first_name} ${user.last_name}`;

            userLink.appendChild(document.createTextNode(fullName));

            tableData.appendChild(userLink);
            const userDetailsElement = document.createElement('DIV');
            userDetailsElement.className= "user-details hidden";
            userLink.onclick = function () {
                handleUserNameClick(userDetailsElement);
            };

            companies.forEach(company => {
                if (order.user_id === company.id) {
                    const date = new Date(parseInt(user.birthday, 10));
                    const dateFormat = `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
                    createTextParagraph(userDetailsElement, dateFormat);
                    addParagraphWithImg(userDetailsElement, user);
                    addParagraphWithLink(userDetailsElement, company);
                    createTextParagraph(userDetailsElement, `Industry: ${company.industry}`);
                }

                tableData.appendChild(userDetailsElement);
            });


        } else {
            tableData.appendChild(document.createTextNode(data));
        }


        tableRow.appendChild(tableData);

        return tableData;
    }

}());
