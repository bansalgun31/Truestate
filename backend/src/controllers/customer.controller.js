const salesService=require('../services/sales.service.js');
const handleAllSales=async(req,res)=>{
    try{
        const page=parseInt(req.query.page) || 1;
        const search=req.query.search || "";
        const Gender=req.query.Gender || "";
        const CustomerRegion=req.query.CustomerRegion || "";
        const ProductCategory=req.query.ProductCategory || "";
        const Tags=req.query.Tags || "";
        const PaymentMethod=req.query.PaymentMethod || "";
        const AgeMin=req.query.AgeMin || "";
        const AgeMax=req.query.AgeMax || "";
        const DateStart=req.query.DateStart || "";
        const DateEnd =req.query.DateEnd || "";
        const SortBy=req.query.SortBy || "";
        const SortOrder=req.query.SortOrder || "asc";
        const result=await salesService.getAllSales({page,search,
            Gender,
            CustomerRegion,
            ProductCategory,
            Tags,
            PaymentMethod,
            AgeMax,
            AgeMin,
            DateStart,
            DateEnd,
            SortBy,
            SortOrder,
        });
       res.status(200).json({
  success: true,
  data: {
    sales: result.sales,
    metadata: result.metadata
  }
});


    }
    catch(err){
        res.status(500).json({message:"Internal server error",success:false});
    }
}
module.exports={handleAllSales};
