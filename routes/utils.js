let encry=require('crypto');
module.exports={
    md5(str){
        return encry.createHmac('sha1','zfpx').update(str).digest("hex");//加盐算法；
    }
};