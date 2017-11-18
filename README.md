# Bamazon

#### Main Skills: 
  * mysql connection:
  
    ````const mysql = require('mysql');
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
        });````
        
   
   * mysql data retrival and manipulation---- department.js----function view()
   
   ````var query = 'SELECT * FROM products WHERE?';
      var condition = {item_id: index};
      connection.query(query, condition, (err,res)=>{
      }````
