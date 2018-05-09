
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
            //console.log(data.total.inc - data.total.exp);
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
        expensesContainer: ".expenses__list"
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

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === "exp"){
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    
    var updateBudget = function(obj, type){
        //1.) Calculate Budget
        budgetCtrl.calculateBudget();

        //2.) Return that Budget
        var budget = budgetCtrl.getBudget();

        //3.) Display Budget
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

    return {
        init: function() {
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();