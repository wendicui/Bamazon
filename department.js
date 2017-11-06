const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');


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

	var choices = [
				'View Product Sales by Department',
				'Create New Department']

	var questions = [{
		type:'list',
		message:'What would you like to do today Supervisor?',
		choices:choices,
		name:'activity'
	}]

	inquirer.prompt(questions).then((res)=>{

		switch (res.activity){
			case 'View Product Sales by Department':
				  view();
				  break;
			case 'Create New Department':
				  create();
				  break;
		}
	})
}

//add new department
function create(){

	var questions = [{
		type:'input',
		message:' What is the NAME of the new Department ?',
		name:'name'
	},{
		type:'input',
		message:'What is the OVERHEAD of this new Department ?',
		name:'overhead'
	}]

	inquirer.prompt(questions).then((res)=>{
		var name = res.name
		var query = `INSERT INTO departments (names,over_head_cost)`+
					 `VALUES('${name}', ${res.overhead} )`;

		connection.query(query, (err,res)=>{
			console.log(`The ${name} Department is added`)
			menu();
		})
	})
}

//show revenue
function view(){
	var query = ` SELECT  departments.department_id, departments.names,`+
				` departments.over_head_cost, SUM(products.totaL_Revenue) AS product_sales,`+
				` (SUM(products.totaL_Revenue) -departments.over_head_cost ) AS profits`+
				` FROM departments`+ 
				` LEFT JOIN products ON products.department_name = departments.names`+
				` Group BY department_id;`

	let que = connection.query(query,(err,res)=>{

		//console.log(res)
		console.table(res)
		menu();
	})

	//console.log(que.sql)
}