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

    var data={
        allitems:{
            exp:[],
            inc:[]
        },
        total:{
            exp:0,
            inc:[]
        }
    }

    return{
        additem:function(type,des,val){
            var newitem,ID=1;
            console.log(data.allitems[type].length);
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
                html='<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else{
                //some code
            }

            newhtml=html.replace('%id%',obj.id);
            newhtml=newhtml.replace('%desc%',obj.desc);
            newhtml=newhtml.replace('%value%',obj.val);

            document.querySelector(elememt).insertAdjacentHTML('beforeend',newhtml);

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

    document.querySelector(DomString.btn).addEventListener('click',ctrlAddItem);
    document.addEventListener('keydown',function(event){
        if(event.keyCode==13){
            ctrlAddItem();
        }
    });

})(UIcontroller,budgetController);