export function add2(req, res, next){
    let i = +req.params.val;
    console.log("add2 middleware", i+2)
    next();
}

export function mult5(req, res, next) {
    let i = +req.params.val;
    console.log("mult5 middleware", i * 5);
    next();
}