import * as bcrypt from "bcrypt"

let user_pass_arr = [
    {
        id: 1,
        passw: "hello456"
    }
]

let hashed_pass_arr = [

]

async function compare(){
    const passw1 = await bcrypt.hash(user_pass_arr[0].passw, 10);
    const passw2 = await bcrypt.hash(user_pass_arr[0].passw, 10);

    console.log("p1: ", passw1);
    console.log("p2: ", passw2);

    await bcrypt.compare("hello456", passw1, (err, result)=>{
        if(err) console.log("error from 1", err);
        else console.log("true from 1 comparation", result)
    });
    await bcrypt.compare("hello456", passw2, (err, result) => {
        if (err) console.log("error from 2", err);
        else console.log("true from 2 comparation", result);
    });

    await bcrypt.compare("hello457", passw2, (err, result) => {
        if (err) console.log("error from 3", err);
        else console.log("true from 3 comparation", result);
    });
}
compare();

// console.log();