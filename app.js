var budgetController=(function(){
    
    var Expense=function(id,desc,val){
        this.id=id;
        this.desc=desc;
        this.val=val;
    }

    var Income=function(id,desc,val){
        this.id=id;
        this.desc=desc;
        this.val=val;
    }

    var calculateTotal=function(type){

        var sum=0;
        data.allitems[type].forEach(function(cur){
            sum+=cur.val;
        });
        
        data.total[type]=sum;
    }

    var data={
        allitems:{
            exp:[],
            inc:[]
        },
        total:{
            exp:0,
            inc:0,
        },
        budget:0,
        percentage:-1,
    }

    return{
        additem:function(type,des,val){
            var newitem,ID=1;
            //console.log(data.allitems[type].length);
            if(data.allitems[type].length>=1){
            ID=data.allitems[type][data.allitems[type].length-1].id+1;
            }
            else
            ID=1;
            if(type=='exp'){
                newitem=new Expense(ID,des,val);
            }
            else if(type=='inc'){
                newitem=new Income(ID,des,val);
            }

            data.allitems[type].push(newitem);
            return newitem;
        },


        calulateBudget:function(){

            calculateTotal('exp');
            calculateTotal('inc');
            data.budget=data.total.inc-data.total.exp;
            if(data.total.inc>0){
            data.percentage=Math.round((data.total.exp/data.total.inc)*100);
            }
            else{
                data.percentage=-1;
            }

        },


        getBudget:function(){
            return {
                budget:data.budget,
                totalInc:data.total.inc,
                totalExp:data.total.exp,
                percentage:data.percentage,
            }
        },

        deleteItem:function(type,id){
            var ids,index;
            ids=data.allitems[type].map(function(current){
                return (current.id);
            });
            index=ids.indexOf(id);
            if(index!==-1){
            data.allitems[type].splice(index,1);
            }

        },


        testing:function(){
            return data;
        }
    };
})();

var UIcontroller=(function(){

    var DomString={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        btn:'.add__btn',
        income_list:'.income__list',
        expense_list:'.expenses__list',
        budget_income:'.budget__income--value',
        budget_expense:'.budget__expenses--value',
        budget_value:'.budget__value',
        budget_percentage:'.budget__expenses--percentage',
        container:'.container',

    };

    return {
        getInput:function(){
            return {
                type:document.querySelector(DomString.inputType).value,
                description:document.querySelector(DomString.inputDescription).value,
                value:parseFloat(document.querySelector(DomString.inputValue).value),
            }
        },

        addInput:function(obj,type){
            var html,newhtml,elememt;

            if(type=='inc'){
                elememt=DomString.income_list;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else{
                elememt=DomString.expense_list;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newhtml=html.replace('%id%',obj.id);
            newhtml=newhtml.replace('%desc%',obj.desc);
            newhtml=newhtml.replace('%value%',obj.val);

            document.querySelector(elememt).insertAdjacentHTML('beforeend',newhtml);

        },

        displayBudget:function(budget){
            document.querySelector(DomString.budget_value).textContent=budget.budget;
            document.querySelector(DomString.budget_income).textContent=budget.totalInc;
            document.querySelector(DomString.budget_expense).textContent=budget.totalExp;
            document.querySelector(DomString.budget_percentage).textContent=budget.percentage;
            
        },

        deleteListItem:function(selectorId){
            var el=document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },

        clearFields:function(){
            var fields,fieldsArr;
            fields=document.querySelectorAll(DomString.inputDescription+", "+DomString.inputValue);
            fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value="";
            });

        },

        getDomString:function(){
            return DomString;
        }
    }

})();


var controller =(function(UIctlr,budgetctlr){

    var DomString=UIctlr.getDomString();


    var updateBudget=function(){
        var budget;
        budgetctlr.calulateBudget();
        budget=budgetctlr.getBudget();
        UIctlr.displayBudget(budget);
    }

    var ctrlAddItem=function(){

        var value=UIctlr.getInput();
        if(value.description!="" && !isNaN(value.value) && parseInt(value.value)>0){
            var newInput=budgetController.additem(value.type,value.description,value.value);
            console.log(newInput);
            UIctlr.addInput(newInput,value.type)
            UIctlr.clearFields();
            updateBudget();
        }
        //console.log("it works");
    }   

    var ctrlDeleteItem=function(event){
        var p=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(p){
            var s=p.split('-');
            var type=s[0];
            var ID=parseInt(s[1]);

            budgetController.deleteItem(type,ID);
            UIctlr.deleteListItem(p);
            updateBudget();
        }

    }
    
    document.querySelector(DomString.btn).addEventListener('click',ctrlAddItem,true);
    document.addEventListener('keydown',function(event){
        if(event.keyCode==13){
            ctrlAddItem();
        }
    });
    document.querySelector(DomString.container).addEventListener('click',ctrlDeleteItem);



    return{
        init:function(){
            UIctlr.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:0,
            })
        }
    }

})(UIcontroller,budgetController);


controller.init();