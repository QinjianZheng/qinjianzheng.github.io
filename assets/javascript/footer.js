let body = document.getElementsByTagName("body")[0];
let footer = document.getElementById("footer");

const putFooterBottom = () => {
    footer.style.position = 'fixed';
    footer.style.bottom = '0';
    footer.style.left = "50%";
    footer.style.marginLeft = '-425px';
}

if(body.getClientRects()[0].height < window.innerHeight) {
    putFooterBottom();
}
