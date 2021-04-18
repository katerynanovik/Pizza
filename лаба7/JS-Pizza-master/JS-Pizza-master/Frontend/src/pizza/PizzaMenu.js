var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
const API = require("../API");
var Pizza_List = API.getPizzaList(initPizzaList);
var filter='1';

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
  
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find("#big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find("#small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });
        switch(filter){
          case '1':
            $pizza_list.append($node);
            break;
          case '2':
            if(pizza.meat)
            $pizza_list.append($node);
            break;
          case '3':
            if(pizza.pineapple)
            $pizza_list.append($node);
            break;
          case '4':
             if(pizza.mushroom)
             $pizza_list.append($node);
             break;
          case '5':
             if(pizza.seafood)
             $pizza_list.append($node);   
             break;
          case '6':
            if(pizza.vega)
            $pizza_list.append($node);  
            break;  
        }
       
    }

    list.forEach(showOnePizza);
}

function initialiseMenu() {
    for(var i=1 ; i<=6;i++){
        $('#'+i).click(function name() {
          filter = $(this).attr("id");
      
          console.log(filter);
          showPizzaList(Pizza_List);
        });
      };
    //Показуємо усі піци
    API.getPizzaList(initPizzaList);
}

function initPizzaList(error, data) {
    if (error == null) {
        Pizza_List = data;
        showPizzaList(Pizza_List);

    }
}

function sendToBack(error, data) {
    let receipt_details = data;
    console.log('receipt_details');
    console.log(receipt_details);
    if (!error) {
        LiqPayCheckout.init({
            data:	receipt_details.data,
            signature:	receipt_details.signature,
            embedTo:	"#liqpay",
            mode:	"popup"	//	embed	||	popup
        }).on("liqpay.callback",	function(data){
            console.log(data.status);
            console.log(data);
        }).on("liqpay.ready",	function(data){
//	ready
        }).on("liqpay.close",	function(data){
//	close
        });
    }
    else{
        console.log('some error');
    }
}
$("#exampleInputName1").keyup(function(){
    if (this.value.length >= 6){
        $("#name").css("color","green");
        $("#nameError").text("");
        document.getElementById("submit-order").disabled = false;

    } else {
        $("#name").css("color","red");
        $("#nameError").text("Здається, ви ввели неправильне ім'я");
        $("#nameError").css("color","red");
        document.getElementById("submit-order").disabled = true;


    }
});

$("#exampleInputPhone1").keyup(function(){
    if (!this.value.match("^([0|\\+[0-9]{1,9})?([7-9][0-9]{9}[0-9])$")){
        $("#phone").css("color","red");
        $("#phoneError").text("Упс... Здається, ви ввели неправильний номер телефону");
        $("#phoneError").css("color","red");

        document.getElementById("submit-order").disabled = true;

    }
    else {
        $("#phone").css("color","green");
        $("#phoneError").text("");
        document.getElementById("submit-order").disabled = false;

    }
});
$("#exampleInputAddress1").keyup(function(){
    if (this.value.length >= 4){
        $("#address").css("color","green");
        $("#addressError").text("");

        document.getElementById("submit-order").disabled = false;

    } else {
        $("#address").css("color","red");
        $("#addressError").text("Ну хоч тут введіть все правильно");
        $("#addressError").css("color","red");

        document.getElementById("submit-order").disabled = true;
    }
});

$("#submit-order").click(function () {
    var phoneNumber = $("#exampleInputPhone1").val();
    var login = $("#exampleInputName1").val();
    var address = $("#exampleInputAddress1").val();
    if (phoneNumber === "" || login === "" || address === "") {
        console.log("//////////////////////////////////");
        return;
    }


    var pizza = [];
    PizzaCart.getPizzaInCart().forEach(element =>
        pizza.push(element));
    var order_info = {
        phoneNumber: phoneNumber,
        login: login,
        address: address,
        pizzas: pizza
    }
    console.log('pizza');
    console.log(pizza);
    API.createOrder(order_info, sendToBack);
});



exports.initialiseMenu = initialiseMenu;