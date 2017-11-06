const mysql = require('mysql');
const inquirer = require('inquirer');
var numberNeeded;
var numberLeft;
var revenue
var index

var connection = mysql.createConnection({
	host:'localhost',
	port:3306,
	user:'root',
	password:'',
	database:'bamazon'
})
//create connection
connection.connect((err)=>{
	if(err) throw err;
	display()
});


//display all items
function display(){
	var query = "SELECT * FROM products";

	connection.query(query, (err,res)=>{

		for (var i = 0; i < res.length; i++) {
			var item = res[i];

			console.log(
				`ID: ${item.item_id} |`+
				`Product Name: ${item.product_name} |`+
				`Price: ${item.price} `		
			)
		}
		ask();
	})

	
}

//ask what does the user want to buy
function ask(){
	var questiones = [{
		type: 'input',
		message:' What is the Id of the item you would like to buy?',
		name:'item_toBuy',
		validate: function(value){
			if(parseInt(value)){
				return true;
			}
			return false;
		}

		},{
			type:'input',
			message:' How many would you like to buy?',
			name:'item_Quant',
			validate: function(value){
			if(parseInt(value)){
				return true;
			}
			return false;
		}
		}]


	inquirer.prompt(questiones).then((res)=>{

//check whether have enough quantity
		checkQuantity(res)
		

	})

}

function checkQuantity(userResponse){
	index = userResponse.item_toBuy
	var query = 'SELECT * FROM products WHERE?';
	var condition = {item_id: index};
	connection.query(query, condition, (err,res)=>{
		numberLeft = res[0].stok_quantity;
		numberNeeded = parseInt(userResponse.item_Quant);

		// console.log(numberLeft);
		// console.log(numberNeeded);

		if(numberLeft >= numberNeeded){
			console.log("Order Processed")
			update(userResponse,res);
		}else{
			console.log("Insufficient Quantity")
			display();
		}
	 })
}
//update the database about the quantity;

function update(userRes,ress){
	//console.log(numberLeft - numberNeeded);
	revenue = ress[0].totaL_Revenue
	var query = 'UPDATE products SET ? WHERE ?';
	var updates = [{stok_quantity: (numberLeft - numberNeeded)},{item_id: index}]
	let que = connection.query(query, updates,(err,res)=>{
	
		cost(numberNeeded, ress);
	})
	
}

//return the total cost
function cost(numberNeeded,res){
	var amount = res[0].price * numberNeeded;
	console.log(`Your total is  $${amount}`);
	revenue += amount;
	console.log(revenue)
	loginRevenue(revenue);

}

//update revnue into database;
function loginRevenue(x){
	var query = 'UPDATE products SET ? WHERE ?';
	var updates = [{totaL_Revenue: x},{item_id: index}]
	connection.query(query,updates);

	again();
}


//ask whether want to continue shopping?
function again(){

	var questions = [{
		type:'confirm',
		message:'Do you want to continue shopping?',
		name:'continueShopping',
		default:true
	}]

	inquirer.prompt(questions).then((res)=>{
		if(res.continueShopping){
			display();
		}else{
			console.log('Thank you for shopping with us')
		}

	})


}

