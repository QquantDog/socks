export function Root(){
    
    // async function handlerPut(){
    //     await fetch('http://localhost:3088', {
    //         method: "put",
    //         mode: "cors",
    //         body: JSON.stringify({"heh": "heh"})
    //     })
    // }
    // async function handlerGet() {
    //     await fetch("http://localhost:3088", {
    //         method: "get",
    //         mode: "cors",
    //     });
    // }
    // async function handlerPost() {
    //     await fetch("http://localhost:3088", {
    //         method: "post",
    //         mode: "cors",
    //         body: JSON.stringify({ heh: "heh" }),
    //     });
    // }
    
    return (
        <div>
            root element!
            {/* <button onClick={handlerPut}>put to 3088</button>
            <button onClick={handlerGet}>get to 3088</button>
            <button onClick={handlerPost}>post to 3088</button> */}
        </div>
    );
}