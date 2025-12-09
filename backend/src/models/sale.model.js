const mongoose=require('mongoose');
const saleSchema=new mongoose.Schema({
    TransactionId:{
        type:Number,
    },
    Date:{
        type:String,
    },
    CustomerId:{
        type:String,
    },
    CustomerName:{
        type:String,
    },
    PhoneNumber:{
        type:String,
    },
    Gender:{
        type:String,
    },
    Age:{
        type:Number,
    },
    CustomerRegion:{
        type:String,
    },
    CustomerType:{
        type:String,
    },
    ProductID:{
        type:String,
    },
    ProductName:{
        type:String,
    },
    Brand:{
        type:String,
    },
    ProductCategory:{
        type:String,
    },
    Tags:{
        type:String,
    },
    Quantity:{
        type:Number,
    },
    PriceperUnit:{
        type:Number,
    },
    DiscountPercentage:{
        type:Number,
    },
    TotalAmount:{
        type:Number,
    },
    FinalAmount:{
        type:String,
    },
    PaymentMethod:{
        type:String,
    },
    OrderStatus:{
        type:String,
    },
    DeliveryType:{
        type:String,
    },
    StoreId:{
        type:String,
    },
    StoreName:{
        type:String,
    },
    StoreLocation:{
        type:String,
    },
    SalespersonId:{
        type:String,
    },
    EmployeeName:{
        type:String,
    },






})
const Sale=mongoose.model('Sale',saleSchema);
module.exports=Sale;