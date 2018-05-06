
//BUDGET CONTROLLER
var budgetController = (function(){

    //Constructors
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Data Structures
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val){
            // Variables
            var newItem, ID;

            // Create new ID
            // I want the new id to be the last id value + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id  + 1;
            } else {
                ID = 0;
            }


            // Create new item based on type ("exp" or "inc")
            if (type === "exp") {
                newItem = new Expense(ID, des, val);    
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }

            // Push it to the data structure
            data.allItems[type].push(newItem);

            // Return new element
            return newItem;
        },

        testing: function(){
            console.log(data);
        }
    }

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
                type: document.querySelector(DOMStrings.inputType).value, //either inc or exp
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

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        //When button is clicked 
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        //When enter is pressed
        document.addEventListener("keypress", function(event){
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            };
        });
    }

    var ctrlAddItem = function() {
        var input, newItem;

        //1.) Get input fields (type, description, value)
        input = UICtrl.getInput();
        console.log(input);

        //2.) Assign that data to internal data structure (budget controller)
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3.) Display those data (ui controller)

        //4.) Calculate Budget

        //5.) Display Budget
    }

    return {
        init: function() {
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();