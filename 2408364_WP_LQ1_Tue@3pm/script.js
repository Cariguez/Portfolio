/*==================================
  Name: Carlos Rodriguez
  ID #:  2408364
  Date: December 2, 2025
  Lab Time: Tuesday, 3pm - 5pm
  Lecturer: C.Anuli
  ==================================*/


  
// First and Last Name validation with disabling/enabling
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const firstNameMsg = document.getElementById('firstNameMsg');
const lastNameMsg = document.getElementById('lastNameMsg');

// Validation function for the name fields
function handleDisabling(field, msgElement)
{
    if (field.value.trim().length <= 3)
        {
        let msg = 'Must be more than 3 characters';
        msgElement.textContent = msg;
        field.setCustomValidity(msg);
    }
    else
    {
        msgElement.textContent = '';
        field.setCustomValidity('');
        field.disabled = true;
    }
}

// Enable field on double-click
function dblClickEnabling(field)
{
    field.disabled = false;
}

// For First Name
firstName.addEventListener('blur', () => handleDisabling(firstName, firstNameMsg));
firstName.addEventListener('dblclick', () => dblClickEnabling(firstName));

// For Last Name
lastName.addEventListener('blur', () => handleDisabling(lastName, lastNameMsg));
lastName.addEventListener('dblclick', () => dblClickEnabling(lastName));



// Email validation
const email = document.getElementById('email');
const emailHelp = document.getElementById('emailHelp');

email.addEventListener('input', () => {
    if (!email.value.includes('students.utech.edu.jm'))
    {
        emailHelp.textContent = 'Use email format: abc@students.utech.edu.jm';
        email.setCustomValidity('Must include students.utech.edu.jm');
    }
    else
    {
        emailHelp.textContent = '';
        email.setCustomValidity('');
    }
});



// Statement Date
const statementDate = document.getElementById('statementDate');
statementDate.max = new Date().toISOString().split('T')[0];



// Account number
const accountNumber = document.getElementById('accountNumber');
const accountMsg = document.getElementById('accountMsg');

accountNumber.addEventListener('input', () => {
    if (!/^\d{3}-\d{3}-\d{3}$/.test(accountNumber.value))
    {
        accountMsg.textContent = 'Format: 000-000-000';
        accountNumber.setCustomValidity('Format: 000-000-000');
    }
    else
    {
        accountMsg.textContent = '';
        accountNumber.setCustomValidity('');
    }
});



// CSV Number
const csvNumber = document.getElementById('csvNumber');
const csvHelp = document.getElementById('csvHelp');

csvNumber.addEventListener('input', () => {
    if (csvNumber.value.length !== 3 || isNaN(csvNumber.value))
    {
        csvHelp.textContent = 'CSV must be 3 digits';
        csvNumber.setCustomValidity('CSV must be 3 digits');
    }
    else if (csvNumber.value !== '123')
    {
        csvHelp.textContent = "Doesn't match default value!";
        csvNumber.setCustomValidity("Doesn't match default value!");
    }
    else
    {
        csvHelp.textContent = '';
        csvNumber.setCustomValidity('');
    }
});



// Total Purchases (bing random, and disabled)
const totalPurchases = document.getElementById('totalPurchases');

function setRandomPurchase()
{
    totalPurchases.value = (Math.random() * (13000 - 1) + 1).toFixed(2);
    totalPurchases.disabled = true;
}

setRandomPurchase(); // Call the function on loadup



/* ====== Local storage, and output ======= */
const cardType = document.getElementById('cardType');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsDiv = document.getElementById('results');
const localDataDiv = document.getElementById('localStorageData');
const STUDENT_ID = "2408364"; // My ID#

window.onload = function ()
{
    setRandomPurchase();
    let stored = localStorage.getItem(STUDENT_ID);
    if (stored) localDataDiv.innerHTML = `<b>Stored:</b> <br>${stored}`;
};

// Calculate buton operations
calculateBtn.onclick = function ()
{
    // Validate all again before output
    let fname = firstName.value.trim();
    let lname = lastName.value.trim();
    let date = statementDate.value;
    let acct = accountNumber.value;
    let purchase = parseFloat(totalPurchases.value);
    let type = cardType.value, cashBack = 0;

    if (type === "silver" && purchase > 1500)
    {
        cashBack = (0.0005 * purchase).toFixed(2);
    }
    else if (type === "platinum" && purchase > 1800)
    {
        cashBack = (0.07 * purchase).toFixed(2);
    }

    let output =
    `
        Customer First Name: ${fname}<br>
        Customer Last Name: ${lname}<br>
        Statement Date: ${date}<br>
        Account Number: ${acct}<br>
        Cash Back Amount: $${cashBack}
    `;

    resultsDiv.innerHTML = `<b>Results:</b><br>${output}`;
    localStorage.setItem(STUDENT_ID, output);
    localDataDiv.innerHTML = `<b>Data stored!</b>`;
};

// Reset buton operations
resetBtn.onclick = function ()
{
    resultsDiv.innerHTML = '';
    localDataDiv.innerHTML = '';
    setRandomPurchase();
    firstName.disabled = lastName.disabled = false;
};