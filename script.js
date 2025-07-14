let windows = document.getElementsByClassName("left")[0]
let startmenu = document.getElementsByClassName("startmenu")[0]

windows.addEventListener("click", ()=>{
    console.log('....');
    if (startmenu.style.bottom == '-640px') {
        startmenu.style.bottom = '50px';
    } else {
        startmenu.style.bottom = '-640px';
    }
})

let c_panel = document.querySelector(".icons").children[1];
let icons_img = document.querySelector(".icons_pop");

// c_panel.addEventListener("dblclick", ()=>{
//     console.log('....');
//     if (icons_img.style.top == '-465px') {
//         icons_img.style.top = '100px';
//     } else {
//         icons_img.style.top = '-465px';
//     }
// })

c_panel.addEventListener("dblclick", ()=>{
    console.log('....');
    if (icons_img.style.visibility == 'hidden') {
        icons_img.style.visibility = 'visible';
    } else {
        icons_img.style.visibility = 'hidden';
    }
})
