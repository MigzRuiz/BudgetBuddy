
//BUDGET CONTROLLER
var budgetController = (function(){

})();


//UI CONTROLLER
var UIController = (function(){

    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    }

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //either income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        getDOMstrings: function(){
            return DOMStrings;
        }
    };

})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var DOM = UICtrl.getDOMstrings();

    var ctrlAddItem = function() {
        
        //1.) Get input fields (type, description, value)
        var input = UICtrl.getInput();
        console.log(input);

        //2.) Assign that data to internal data structure (budget controller)

        //3.) Display those data (ui controller)

        //4.) Calculate Budget

        //5.) Display Budget
    }

    //When button is clicked 
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    //When enter is pressed
    document.addEventListener("keypress", function(event){

        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        };

    });

})(budgetController, UIController);