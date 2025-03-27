const form1 = document.querySelector("#income");
const form2 = document.querySelector("#expense");
const sallery = document.querySelector("#sallary");
const incomedata = document.querySelector('#income-data');
const expenses = document.querySelector("#expenses");
const expenseDataDiv = document.querySelector("#expense-data");
const suggestionButton = document.querySelector("#suggestion-button");
const suggestions = document.querySelectorAll(".suggestion");

// tax calculator
const taxForm = document.querySelector("#tax-form");
const preSpan = document.querySelector("#pre_income");
const incomeInput = document.querySelector("#income-input");
const rate = document.querySelector("#tax_rate");
const tax = document.querySelector("#total-tax");
const taxIncome = document.querySelector("#post-tax-income");
const entryDiv = document.querySelector(".entryDiv");

// login/signup 


let totalIncome = 0;
let remainingBalance = 0;



// income form 
form1.addEventListener('submit',(e)=>{
    e.preventDefault(); // to show the value  use this

    totalIncome = parseFloat(sallery.value); // parsefloat is using for input float values 
    if (isNaN(totalIncome) || totalIncome <=0){ // if the value is not a number or less equal to 0
        alert("Please enter a valid income amount!");
        return
    }

    remainingBalance = totalIncome;
    incomedata.innerText = `Your Total Amount to spend is: ₹${totalIncome}`;
    incomedata.classList.add('income-style');
    updateRemainingBalance();
    sallery.value = "";
});
let expensesArray = []; // Store all expenses
let chartInstance = null;

// Expenses form
form2.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.querySelector("#description").value.trim();
    const expenseAmount = parseFloat(document.querySelector("#expenses").value);
    const datetime = document.querySelector("#datetime").value.trim();

    // Validate inputs
    if (description === "" || isNaN(expenseAmount) || expenseAmount <= 0 || datetime === "") {
        alert("Please enter valid expense details!");
        return;
    }

    // Check balance before adding expense
    let newBalance = remainingBalance - expenseAmount;
    if (newBalance < 0) {
        alert("Not enough balance");
        return;
    }

    // Update remaining balance
    remainingBalance = newBalance;
    if(Number(remainingBalance) <= (Number(totalIncome)*10/100)){
        alert("You have exhausted your 90% of Balance"
            
        )
    };

    // Store expense in array
    const newExpense = { description, expenseAmount, datetime };
    expensesArray.push(newExpense);

  

    // Re-render expenses list
    renderExpenses();
    updateChart()

    // Update remaining balance display
    updateRemainingBalance();

    // Clear input fields
    document.querySelector("#description").value = "";
    document.querySelector("#expenses").value = "";
    document.querySelector("#datetime").value = "";
});

// Function to render expenses using `forEach`
function renderExpenses() {
    expenseDataDiv.innerHTML = ""; // Clear previous list

    const fragment = document.createDocumentFragment(); // Use fragment for better performance

    expensesArray.forEach((expense, index) => {
        const expenseEntry = document.createElement('div');
        expenseEntry.classList.add("expenses-entry-styling");

        expenseEntry.innerHTML = `
            <p><strong>Description:</strong> ${expense.description}</p>
            <p><strong>Expense Amount:</strong> ₹${expense.expenseAmount}</p>
            <p><strong>Date & Time:</strong> ${expense.datetime}</p>
        `;
                                               
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add("fa-solid", "fa-trash");
        // deleteBtn.innerText = "Delete";
        deleteBtn.classList.add('delete-btn');

        // Delete functionality
        deleteBtn.addEventListener('click', () => {
            remainingBalance += expense.expenseAmount; // Restore balance
            expensesArray.splice(index, 1); // Remove from array
            renderExpenses(); // Re-render list
            updateRemainingBalance();
            updateChart();
        });

        expenseEntry.appendChild(deleteBtn);
        fragment.appendChild(expenseEntry);
    });

    expenseDataDiv.appendChild(fragment);
}

function updateRemainingBalance() {
    let balanceDiv = document.getElementById("remaining-balance");
    
    // ✅ If balance div doesn't exist, create it once
    if (!balanceDiv) {
        balanceDiv = document.createElement("div");
        balanceDiv.id = "remaining-balance";
        balanceDiv.classList.add("balance-style");
        document.body.appendChild(balanceDiv);

        let wrapperDiv = document.querySelector(".wrapper");

        if (wrapperDiv) {
            wrapperDiv.insertAdjacentElement("afterend", balanceDiv);
        }
    }
    
    // ✅ Correctly update balance text
    balanceDiv.innerText = `Your remaining balance is: ₹${remainingBalance}`;
}

// Function to initialize & update Chart.js

function updateChart(chartType = 'pie') {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    // Extract labels (descriptions) and data (expenses)
    const labels = expensesArray.map(expense => expense.description);
    const data = expensesArray.map(expense => expense.expenseAmount);


    const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
    ];


    // Ensure enough colors for all bars (if more expenses exist)
    const dynamicColors = labels.map((_, i) => backgroundColors[i % backgroundColors.length])

 // ✅ Destroy existing chart before creating a new one
     if (chartInstance !== null) {
        chartInstance.destroy();
    }

    // Destroy previous chart instance to prevent duplication
    // if (chartInstance) {
    //     chartInstance.destroy();
    // }

    // Create new chart
    chartInstance = new Chart(ctx, {
        type: chartType, // Bar chart type
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                backgroundColor: dynamicColors, // Bar color
                borderColor: dynamicColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
updateChart('pie');

//Tax calculator
taxForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission
  
    // Get income value and update pre-tax income
    const incomeValue = Number(incomeInput.value);
    preSpan.innerText = incomeValue;
  
    let incomeAfterTax;
    let taxToBeDeducted;
  
    // Tax slab logic based on income range
    if (incomeValue >= 1000000) {
      rate.innerText = "20%";
      taxToBeDeducted = (incomeValue * 20) / 100;
    } else if (incomeValue >= 700000) {
      rate.innerText = "15%";
      taxToBeDeducted = (incomeValue * 15) / 100;
    } else if (incomeValue >= 500000) {
      rate.innerText = "10%";
      taxToBeDeducted = (incomeValue * 10) / 100;
    } else if (incomeValue >= 300000) {
      rate.innerText = "5%";
      taxToBeDeducted = (incomeValue * 5) / 100;
    } else {
      rate.innerText = "0%";
      taxToBeDeducted = 0;
    }
  
    incomeAfterTax = incomeValue - taxToBeDeducted;
  
    // Display the calculated tax and post-tax income
    tax.innerText = taxToBeDeducted.toFixed(2);
    taxIncome.innerText = incomeAfterTax.toFixed(2);

   
  });


  suggestionButton.addEventListener('click',(e)=>{
  
      if (Number(remainingBalance) <= Number(totalIncome) * 0.3) {
        suggestions[0].innerText = "You have spent 70% of your budget. Keep an eye on your expenses!";
        suggestions[1].innerText = "Try to set aside some savings now before it gets too late.";
    }
    
    if (Number(remainingBalance) <= Number(totalIncome) * 0.2) {
        suggestions[0].innerText = "You have spent 80% of your total budget. Be careful with further spending!";
        suggestions[1].innerText = "Consider cutting unnecessary expenses to maintain financial stability.";
    }
    
    if (Number(remainingBalance) <= Number(totalIncome) * 0.1) {
        suggestions[0].innerText = "You have spent 90% of your total budget. Try to reduce your expenses!";
        suggestions[1].innerText = "Try to save more funds because if you save today, it will help you tomorrow! Remember this...";
    }
    
  });

