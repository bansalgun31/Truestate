const express=require('express');
const router=express.Router();
const Sale=require('../models/sale.model.js');
const {handleAllSales}=require('../controllers/customer.controller.js');
router.get('/sales',handleAllSales);
module.exports=router;