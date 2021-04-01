function open_income()
{
    var income = document.getElementById("income_amount");
    var user_name = document.getElementById("user_name")
    if (income != '' && user_name != '')
    {
        document.getElementById('income_button').disabled=false;
    }
    else
    {
        document.getElementById('income_button').disabled=true;
    }
}
function deleteIncome(incomeId){
    var r = confirm("Do you want to delete?"); 
    if(r==true){
        document.getElementById('incomeId').value = incomeId;
        document.getElementById('deleteIncome_form').submit();
    }
    return false;
}
function deleteExpense(expenseId){
    var r = confirm("Do you want to delete?"); 
    if(r==true){
        document.getElementById('expenseId').value = expenseId;
        document.getElementById('deleteExpense_form').submit();
    }
    return false;
}
function deleteSavings(savingsId){
    var r = confirm("Do you want to delete?"); 
    if(r==true){
        document.getElementById('savingsId').value = savingsId;
        document.getElementById('deleteSavings_form').submit();
    }
    return false;
}
function addIncome() {

    if ((document.getElementById('incomeName').value!="") && 
    (document.getElementById('income_amount').value > 0))
    {
        if (document.getElementById('income_category').value == "one_time")
        {
            document.getElementById('income_period').value = "na";
        }
    }
    else
    {
        alert("Please enter Income Name and Amount");
        return false;
    }
    document.getElementById('income_form').submit();
}
function addExpense() {
    if ((document.getElementById('expenseName').value!="") && 
    (document.getElementById('expense_amount').value > 0))
    {
        if (document.getElementById('expense_category').value == "one_time")
        {
            document.getElementById('expense_period').value = "na";
        }
    }
    else
    {
        alert("Please enter Expense Name and Amount");
        return false;
    }
    document.getElementById('expense_form').submit();
}
function open_expense() {
    var user_name = document.getElementById("user_name");
	var expense_amount = document.getElementById("expense_amount");
	var with_who = document.getElementById("with_who");
    var description = document.getElementById("description");
    if (user_name != '' && expense_amount != '' && with_who != '' && description !='')
    {
        document.getElementById('expense_button').disabled=false;

    }
    else
    {
        document.getElementById('expense_button').disabled=true;
    }
}

function showIncome(){
    document.getElementById("incomeDisplay").display="inline";
}
function hideIncome(){
    document.getElementById("incomeDisplay").display="hidden";
}
function showExpesne(){
    document.getElementById("expenseDisplay").display="inline";
}
function hideExpesne(){
    document.getElementById("expenseDisplay").display="hidden";
}
function checkSelectIncome(select) {
    

    if (select.value!="one_time")
    {
        document.getElementById("income_period").disabled=false; 
    }
    else
    {
        document.getElementById("income_period").disabled=true; 
    }  
       
}

function checkSelectExpense(select) {
    

    if (select.value!="one_time")
    {
        document.getElementById("expense_period").disabled=false; 
    }
    else
    {
        document.getElementById("expense_period").disabled=true; 
    }  
       
}

function addGoal()
{
    document.getElementById('savingsGoal_form').submit();
}

function open_goal()
{
    var goal_amount = document.getElementById('goal_amount');
    if(goal_amount!='')
    {
        document.getElementById('goal_submit').disabled=false;
    }
    else
    {
        document.getElementById('goal_submit').disabled=true;
    }
}