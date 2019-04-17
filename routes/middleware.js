function middleToken(req, res, next){
    const xaccesstokenHeader = req.headers['authorization'];
    if(typeof xaccesstokenHeader !== 'undefined'){
        const xaccesstoken = xaccesstokenHeader.split(' ');
        req.token = xaccesstoken[1];
        next();
    } else {
        res.sendStatus(403);
    }
}
module.exports = {middleToken};