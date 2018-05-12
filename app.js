
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

    //Functions
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(currentValue){
            sum += currentValue.value;
        });

        data.total[type] = sum;
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
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function(type, id){
            //Based on the type, it will remove the element which the ID is tied to.
            //type = inc then id = 1
            //given inc:[0 1 2 3 4]
            var ids, index;

            //Create a new map of the ids on either type
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            //Get the index of that id that was passed in the deleteItem function
            index = ids.indexOf(id);
            //We'll only run it if it's greater than -1
            if( index !== -1 ){
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function(){
            //calculate total income and expense
            calculateTotal('inc');
            calculateTotal('exp');
            
            //calculate total
            data.budget = data.total.inc - data.total.exp;

            //calculate the percentage
            if (data.total.inc > 0){
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
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
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income-value",
        expenseLabel: ".budget__expense-value",
        percentageLabel: ".budget__expense-percentage",
        content: ".content"
    }

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type){
            var html, newHtml, element;

            //Create HTML strings with placeholder text
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === "exp"){
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            //We want to re

        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);

            //To slice the fields as an array (even though it's not an array)
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(currentValue, indexOfArray, array) {
                //console.log(currentValue.value);
                currentValue.value = "";    //Setting the value of the current element to zero
                                            //So it will do it for the inputDescription then inputValue               
            });
        },

        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
        },

        getDOMstrings: function() {
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

        //Delete item
        document.querySelector(DOM.content).addEventListener("click", ctrlDeleteItem);
    }
    
    var updateBudget = function(obj, type){
        //1.) Calculate Budget
        budgetCtrl.calculateBudget();

        //2.) Return that Budget
        var budget = budgetCtrl.getBudget();

        //3.) Display Budget
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;

        //1.) Get input fields (type, description, value)
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2.) Assign that data to internal data structure (budget controller)
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3.) Display those data (ui controller)
            UICtrl.addListItem(newItem, input.type);

            //4.) Clear the fields
            UICtrl.clearFields();

            //5.)  Calculate and Update the Budget
            updateBudget(newItem, input.type);
        }
    }

    //The event is there to get the target element when the button is clicked.
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        //Will get the target ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //If there is an ID
        if (itemID) {
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //remove the item in the data structure
            budgetCtrl.deleteItem(type, ID);
            
            //remove the item in the display

            //update the new total/budget
        }
    }

    return {
        init: function() {
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();