// this is an example of improting data from JSON
import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

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
        createCell(tableRow, order.user_id, true, order).className = 'user_data';
        const date = new Date(parseInt(order.created_at, 10));
        let dateFormat = `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
        createCell(tableRow, dateFormat);
        createCell(tableRow, '$'+order.total);
        createCell(tableRow, getFormattedCardNumber(order.card_number));
        createCell(tableRow,order.card_type);
        createCell(tableRow, `${order.order_country} (${order.order_ip})` );
        tableBody.appendChild(tableRow);
    }

    function getFormattedCardNumber(cardNumber) {
        return cardNumber.split('').map((currentValue, index, array) => (
            (index < 2 || index > array.length - 5) ? currentValue : '*'
        )).join('');
    }

    function createParagraph(div,data) {
        const parag= document.createElement('P');
        const text = document.createTextNode(data);
        parag.appendChild(text);
        div.appendChild(parag);
    }

    function createCell(tableRow, data, isUserInfo, order){
        const tableData = document.createElement('TD');
        let text;

        if(isUserInfo){
            users.forEach(user => {
                if(user.id == order.user_id){
                    const userLink = document.createElement('A');
                    userLink.href='';
                    if(user.gender == 'Female'){
                        data = `Ms. `;
                    }
                    else{
                        data = `Mr. `;
                    }
                    data += `${user.first_name} ${user.last_name}`;
                    text = document.createTextNode(data);
                    userLink.appendChild(text);
                    tableData.appendChild(userLink);
                    const user_details_div = document.createElement('DIV');
                    user_details_div.className = "user-details";
                    companies.forEach(company => {
                        if(order.user_id == company.id){
                            const date = new Date(parseInt(user.birthday, 10));
                            let dateFormat = `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
                            createParagraph(user_details_div, dateFormat);
                            let parag= document.createElement('P');
                            const avatar = document.createElement('IMG');
                            avatar.src = user.avatar;
                            avatar.style.width = '100px'; //тут или width просто 100, что потом конвертируется в пиксели, но отображается как width:100, или так, но тогда добавляется style
                            parag.appendChild(avatar);
                            user_details_div.appendChild(parag);

                            parag= document.createElement('P');
                            text = document.createTextNode('Company: ');
                            parag.appendChild(text);
                            const companyLink = document.createElement('A');
                            companyLink.href = company.url;
                            text = document.createTextNode(company.title);
                            companyLink.appendChild(text);
                            parag.appendChild(companyLink);
                            user_details_div.appendChild(parag);


                            createParagraph(user_details_div, `Industry: ${company.industry}`);
                        }

                        tableData.appendChild(user_details_div);
                    });

                    const button = document.createElement('A');
                    text = document.createTextNode('Click Me');
                    button.appendChild(text);

                    button.onclick = function() {
                        if(user_details_div.style.display == 'block')
                            user_details_div.style.display = 'none';
                        else
                            user_details_div.style.display = 'block';
                    };


                    button.style.cursor = 'pointer';
                    tableData.appendChild(button);
                }



            });
        }
        else{
            text = document.createTextNode(data);
            tableData.appendChild(text);
        }



        tableRow.appendChild(tableData);

        return tableData;
    }

}());
