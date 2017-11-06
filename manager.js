const mysql = require('mysql');
const inquirer = require('inquirer');


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
	menu()
});


function menu(){

	var choices = ['View Products for Sale',
				   'View Low Inventory',
				   'Add to Inventory',
				   'Add New Product']

	inquirer.prompt({
		type:'list',
		name:'activity',
		choices: choices,
		message:"what would you like to do today Manager?"
	}).then((res)=>{
		switch(res.activity){	
			case 'View Products for Sale':
				product();
				break;

			case 'View Low Inventory':
				low();
				break;

			case 'Add to Inventory':
				add();
				break;

			case 'Add New Product':
				newProduct();
				break;
		}

	})

}

function product(){

	var query = "SELECT * FROM products";

	connection.query(query, (err,res)=>{

		for (var i = 0; i < res.length; i++) {
			var item = res[i];

			console.log(
				`ID: ${item.item_id} |`+
				`Product Name: ${item.product_name} |`+
				`Price: ${item.price} |`+
				`Quantity: ${item.stok_quantity}`		
			)
		}

		menu();
	})
}


function low(){

	var query = "SELECT * FROM products HAVING stok_quantity < 5";
	//var condition = stok_quantity < 50;

	let que = connection.query(query,(err,res)=>{

		for (var i = 0; i < res.length; i++) {
			console.log(res[i].product_name)
		}

		menu();
	})	
}


function add(){
	var questions = [{
		type:'input',
		message:'Which id of item do you want to add ?',
		name:'target'
	},{
		type:'input',
		message:'How many do you want to add ?',
		name:'quantity'
	}]

	inquirer.prompt(questions).then((answers)=>{
		var number = parseInt(answers.quantity);
	    var item = answers.target;
		var left;
		var query = 'SELECT * FROM products WHERE?';
		var condition = {item_id: item};
//get left quantity
		connection.query(query, condition, (err,res)=>{
			//console.log(res[0])
			left = res[0].stok_quantity;

//update quantity

			var query2 = `UPDATE products SET stok_quantity = ? WHERE ?`
			var condition2 = [left + number, {item_id: item}]
			let que = connection.query(query2,condition2, (err,res)=>{

				console.log(`${number} of ${item} have been successfully added.`);
				//console.log(que.sql)
				menu();
			})
		
		})

	})

}

function newProduct(){
	var questions = [{
		type: 'input',
		message:'What is the NAME of the new product?',
		name:'name'
	},{
		type: 'input',
		message:'What is the PRICE of the new product?',
		name:'price'
	},{
		type: 'input',
		message:'What is the DEPARTMENT of the new product?',
		name:'department'
	},{
		type: 'input',
		message:'What is the QUANTITY of the new product?',
		name:'quantity'}]

	inquirer.prompt(questions).then((answers) =>{
		var price = parseInt(answers.price);
		var quantity = parseInt(answers.quantity);
		var query = 'INSERT INTO products'+
					' (product_name, department_name, price, stok_quantity)'+
					`VALUES ('${answers.name}', '${answers.department}',${price}, ${quantity})`

		let que = connection.query(query, (err,res)=>{
			console.log("The new product is added");
			//console.log(que.sql)
			menu();

		})

	})

}
