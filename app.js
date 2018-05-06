
//BUDGET CONTROLLER
var budgetController = (function(){

})();


//UI CONTROLLER
var UIController = (function(){

    //some code later


})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var ctrlAddItem = function() {
        
        //1.) Get data (description and value)

        //2.) Assign that data to internal data structure (budget controller)

        //3.) Display those data (ui controller)

        //4.) Calculate Budget

        //5.) Display Budget
    }

    //When button is clicked 
    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

    //When enter is pressed
    document.addEventListener("keypress", function(event){

        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        };

    });

})(budgetController, UIController);