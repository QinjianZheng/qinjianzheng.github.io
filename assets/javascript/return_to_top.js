const button = document.getElementById("return-to-top");

window.addEventListener("scroll", () => {
    if(document.body.scrollTop > 30 || 
        document.documentElement.scrollTop > 30) { 
            button.setAttribute("active", "");
    } else {
        button.removeAttribute("active");
    }
});
button.addEventListener("click", () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})
