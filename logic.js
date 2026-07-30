$(document).ready(function () {

    let expenses = [];

    // Get saved expenses
    if (localStorage.getItem("expenses") != null) {
        expenses = JSON.parse(localStorage.getItem("expenses"));
    }

    let editIndex = -1;

    displayExpenses();

    $("#expenseForm").submit(function (pr) {

        pr.preventDefault();

        let name = $("#expenseName").val();
        let amount = $("#expenseAmount").val();
        let date = $("#expenseDate").val();
        let category = $("#expenseCategory").val();
        let payment = $("#paymentMethod").val();

        if (editIndex == -1) {

            expenses.push({
                name: name,
                amount: amount,
                date: date,
                category: category,
                payment: payment
            });

        } else {

            expenses[editIndex].name = name;
            expenses[editIndex].amount = amount;
            expenses[editIndex].date = date;
            expenses[editIndex].category = category;
            expenses[editIndex].payment = payment;

            editIndex = -1;

            $("button[type='submit']").text("Add Expense");
        }

        saveData();
        displayExpenses();

        $("#expenseForm")[0].reset();

    });

    // Save data
    function saveData() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    // Display all expenses
    function displayExpenses() {

        $("#expenseTable").html("");

        let total = 0;
        let highest = 0;
        let monthTotal = 0;

        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();
        //total, highest, month total
        for (let i = 0; i < expenses.length; i++) {

            total = total + Number(expenses[i].amount);

            if (Number(expenses[i].amount) > highest) {
                highest = Number(expenses[i].amount);
            }

            let d = new Date(expenses[i].date);

            if (d.getMonth() == currentMonth && d.getFullYear() == currentYear) {
                monthTotal = monthTotal + Number(expenses[i].amount);
            }

            $("#expenseTable").append(`
                <tr>
                    <td>${expenses[i].date}</td>
                    <td>${expenses[i].category}</td>
                    <td>₹${expenses[i].amount}</td>
                    <td>${expenses[i].payment}</td>
                    <td>${expenses[i].name}</td>
                    <td>
                        <button class="editBtn btn btn-warning btn-sm" data-index="${i}">Edit</button>
                        <button class="deleteBtn btn btn-danger btn-sm" data-index="${i}">Delete</button>
                    </td>
                </tr>
            `);
        }
        //avg
        let average = 0;

        if (expenses.length > 0) {
            average = total / expenses.length;
        }

        // texting here
        $("#totalExpense").text("₹" + total);
        $("#avgExpense").text("₹" + average.toFixed(2));
        $("#highestExpense").text("₹" + highest);
        $("#thisMonth").text("₹" + monthTotal);
        $("#totalEntries").text(expenses.length);
    }
    //del
    $(document).on("click", ".deleteBtn", function () {

        let index = $(this).data("index");

        for (let i = index; i < expenses.length - 1; i++) {
            expenses[i] = expenses[i + 1];
        }

        expenses.length--;

        saveData();
        displayExpenses();
        alert("Expense deleted successfully!");
    });
    //edit
    $(document).on("click", ".editBtn", function () {

        let index = $(this).data("index");

        $("#expenseName").val(expenses[index].name);
        $("#expenseAmount").val(expenses[index].amount);
        $("#expenseDate").val(expenses[index].date);
        $("#expenseCategory").val(expenses[index].category);
        $("#paymentMethod").val(expenses[index].payment);

        editIndex = index;

        $("button[type='submit']").text("Update Expense");
        

    });

});