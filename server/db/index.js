const mysql = require('mysql');
const { request } = require('express');
const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: 'Kappa123',
    database: 'rdatabase',
    host: 'localhost',
    port: '3306',
    multipleStatements: true
})

let rdb = {};

rdb.viewUser = () => {
        return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM user', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.searchUser = (usr_id) => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM user WHERE usr_id = ?', [usr_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        })
    })
}

rdb.deleteUser = (usr_id) => {
    return new Promise((resolve, reject) =>{
        pool.query('SET FOREIGN_KEY_CHECKS=0; DELETE FROM user WHERE usr_id = ?; SET FOREIGN_KEY_CHECKS=1;', [usr_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.addorupdateuser = (usr_id, usr_fname, usr_lname) => {
    return new Promise((resolve, reject) =>{
        var sql = "SET @usr_id = ?; SET @usr_fname = ?; SET @usr_lname = ?; CALL addorupdateuser(@usr_id, @usr_fname, @usr_lname);"
        pool.query(sql, [usr_id, usr_fname, usr_lname], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.viewItem = () => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM item', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.searchItem = (item_name) => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM item where item_name like "%?%"', [item_name], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.viewInventory = () => {
    return new Promise((resolve, reject) =>{
        pool.query('select item.item_id, item.item_name, supplier.supplier_name, inventory.inv_availability, inventory.inv_quantity, item.item_description from item left join inventory on item.inv_id = inventory.inv_id left join supplier on item.supplier_id = supplier.supplier_id where inventory.inv_availability != "archived" group by item.item_id', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.addorupdateinventory = (inv_id, inv_quantity) => {
    return new Promise((resolve, reject) =>{
        var sql = "SET @inv_id = ?; SET @inv_quantity = ?; CALL addorupdateinventory(@inv_id, @inv_quantity);"
        pool.query(sql, [inv_id, inv_quantity], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.deleteInventory = (inv_id) => {
    return new Promise((resolve, reject) =>{
        pool.query('SET FOREIGN_KEY_CHECKS=0; DELETE FROM inventory WHERE inv_id = ?; SET FOREIGN_KEY_CHECKS=1;', [inv_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.addorupdatebook = (item_id, item_name, item_description, inv_id, supplier_id) => {
    return new Promise((resolve, reject) =>{
        var sql = "SET @item_id = ?; SET @item_name = ?; SET @item_description = ?; SET @inv_id = ?; SET @supplier_id = ?; CALL addorupdatebook(@item_id, @item_name, @item_description, @inv_id, @supplier_id);"
        pool.query(sql, [item_id, item_name, item_description, inv_id, supplier_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.deleteItem = (item_id) => {
    return new Promise((resolve, reject) =>{
        pool.query('SET FOREIGN_KEY_CHECKS=0; DELETE FROM item WHERE item_id = ?; SET FOREIGN_KEY_CHECKS=1;', [item_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.viewBorrowing = () => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM borrowing', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.deleteBorrowing = (borrow_id) => {
    return new Promise((resolve, reject) =>{
        pool.query('SET FOREIGN_KEY_CHECKS=0; DELETE FROM borrowing WHERE borrow_id = ?; SET FOREIGN_KEY_CHECKS=1;', [borrow_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.addorupdateborrowing = (borrow_id, return_days, borrow_status, usr_id, emp_id, item_id) => {
    return new Promise((resolve, reject) =>{
        var sql = "SET @borrow_id = ?; SET @return_days = ?; SET @borrow_status = ?; SET @usr_id = ?; SET @emp_id = ?; SET @item_id = ?; CALL addorupdateborrowing(@borrow_id, @return_days, @borrow_status, @usr_id, @emp_id, @item_id);"
        pool.query(sql, [borrow_id, return_days, borrow_status, usr_id, emp_id, item_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.searchBorrowing = (borrow_id) => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM borrowing where borrow_id like ?', [borrow_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        })
    })
}

rdb.viewReturns = () => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM returns', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.addorupdatereturns = (return_id, return_dmgstatus, return_fee, borrow_id) => {
    return new Promise((resolve, reject) =>{
        var sql = "SET @return_id = ?; SET @return_dmgstatus = ?; SET @return_fee = ?; SET @borrow_id = ?; CALL addorupdatereturns(@return_id, @return_dmgstatus, @return_fee, @borrow_id);"
        pool.query(sql, [return_id, return_dmgstatus, return_fee, borrow_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.deleteReturns = (return_id) => {
    return new Promise((resolve, reject) =>{
        pool.query('SET FOREIGN_KEY_CHECKS=0; DELETE FROM returns WHERE return_id = ?; SET FOREIGN_KEY_CHECKS=1;', [return_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.viewEmployee = () => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM employee', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.addorupdateemployee = (emp_id, amp_fname, emp_lname, emp_job) => {
    return new Promise((resolve, reject) =>{
        var sql = "SET @emp_id = ?; SET @amp_fname = ?; SET @emp_lname = ?; SET @emp_job = ?; CALL addorupdateemployee(@emp_id, @amp_fname, @emp_lname, @emp_job);"
        pool.query(sql, [emp_id, amp_fname, emp_lname, emp_job], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.deleteEmployee = (emp_id) => {
    return new Promise((resolve, reject) =>{
        pool.query('SET FOREIGN_KEY_CHECKS=0; DELETE FROM employee WHERE emp_id = ?; SET FOREIGN_KEY_CHECKS=1;', [emp_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.viewSupplier = () => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM supplier', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.addorupdatesupplier = (supplier_id, supplier_name) => {
    return new Promise((resolve, reject) =>{
        var sql = "SET @supplier_id = ?; SET @supplier_name = ?; CALL addorupdatesupplier(@supplier_id, @supplier_name);"
        pool.query(sql, [supplier_id, supplier_name], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

rdb.deleteSupplier = (supplier_id) => {
    return new Promise((resolve, reject) =>{
        pool.query('SET FOREIGN_KEY_CHECKS=0; DELETE FROM supplier WHERE supplier_id = ?; SET FOREIGN_KEY_CHECKS=1;', [supplier_id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}
module.exports = rdb;