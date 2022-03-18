divElts = document.getElementsByClassName("color")
for (divElt of divElts) {
    divElt.style["width"] = "10px"
    divElt.addEventListener("mouseover", function (event) {
        this.style["width"] = "50px";
    });
    divElt.addEventListener("mouseleave", function (event) {
        this.style["width"] = "10px";
    });
}