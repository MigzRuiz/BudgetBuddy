//BUDGET CONTROLLER
var budgetController = (function(){

    //Constructors
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    //Expense prototype to add the percentages
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    //Expense prototype for getting the calculated percentage
    Expense.prototype.getPercentage = function(){
        return this.percentage;
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
            //Checked which part of the array it is.
            //inc: [1,2,3,4]
            var ids, index;

            //Map all the ids on either inc or exp
            ids = data.allItems[type].map(function(currentValue){
                return currentValue.id;
            });

            //Check the index of the id
            index = ids.indexOf(id);

            //Delete that index using splice. Only delete if index !== -1
            if (index !== -1) {
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

        calculatePercentages: function(){
            //for each expense item, calculate the percentage against the total income
            /*
                a = 10 //10/100 * 100
                b = 20
                c = 40

                Total is 100
            */
            data.allItems.exp.forEach(function(currentValue){
               currentValue.calcPercentage(data.total.inc);
            });
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(currentValue){
                return currentValue.getPercentage();
            });

            return allPerc;
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
            //console.log(data.allItems);
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
        content: ".content",
        expensePercLabel: ".item__percentage",
        dateLabel: ".budget__title-date"
    };

    var formatNumber = function(num, type) {
        var splitNum, int, dec;
    
        //Must be formatted up to 2 decimal points
        num = Math.abs(num);
        num = num.toFixed(2);

        splitNum = num.split(".");
        int = splitNum[0];
        dec = splitNum[1];
        
        //Comma on thousands
        int = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        //+ or - at the start
        return (type === "exp" ? "- " : "+ ") + int + "." + dec;
    };

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

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="right-item item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorID){
            //We are gonna delete using the selector ID either inc-x or exp-x
            //But this only works for child items so I have to use the parentNode to move up
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc,"inc");
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp,"exp");
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
        },

        displayPercentage: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expensePercLabel);

            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i],i);
                }
            }

            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0 ){
                    current.textContent = percentages[index] + "%";
                } else {
                    current.textContent = "---";
                }
            });
        },

        displayMonth: function() {
            var now, year, month;
            
            now = new Date();
            year = now.toLocaleDateString("en-US", {year: 'numeric'});
            month = now.toLocaleDateString("en-US", {month: 'long'});

            document.querySelector(DOMStrings.dateLabel).textContent = month + " " + year;
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
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem)
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

    var updatePercentages = function(){
        //1.) Calculate the percentages
        budgetCtrl.calculatePercentages();

        //2.) Return that percentage
        var percentages = budgetCtrl.getPercentages(); 

        //3.) Display percentage
        UICtrl.displayPercentage(percentages);
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

            //5.) Calculate and Update the Budget
            updateBudget();

            //6.) Calculate and Update the Percentage
            updatePercentages();
        }
    }

    //The event is there to get the target element when the button is clicked.
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //If there is an ID
        if (itemID) {
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //remove the item in the data structure
            budgetCtrl.deleteItem(type, ID);

            //remove the item in the display
            UICtrl.deleteListItem(itemID);

            //update the new total/budget
            updateBudget();
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
            UICtrl.displayMonth();
        }
    }

})(budgetController, UIController);

controller.init();