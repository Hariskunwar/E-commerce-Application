const DataURIParser=require("datauri/parser");
const path=require("path");

module.exports=(photo)=>{
    const parser=new DataURIParser();
    const extension=path.extname(photo.originalname).toString();
    return parser.format(extension,photo.buffer);
}