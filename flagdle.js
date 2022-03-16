var trueColor = [];
var pixelsCol = [];
spectre = {}
function logw(c) {
    console.log(1);
}
usedColor = {}
function spectreCol(trueColors) {
    console.log(trueColor)
    classColor = document.getElementsByClassName("color")
    allColors = []
    for (divElt of classColor) { spectre[divElt.id.toLowerCase()] = divElt.id.toLowerCase() }

    for (col of trueColors) {
        [r, g, b] = col.split(',');
        pmin = 100
        kmin = [-1, -1, -1]
        for (col2 of Object.keys(spectre)) {
            coltoChange = spectre[col2]
            p = 0
            o = hextoRGB(coltoChange)
            r2 = o[0]
            g2 = o[1]
            b2 = o[2]
            p = Math.abs(r - r2) + Math.abs(g - g2) + Math.abs(b - b2)
            p = p / (256 * 3)
            cc = [r2, g2, b2]
            if (p < pmin && (!trueColors.includes(cc.join()) || spectre[col2] == col2)) {
                pmin = p
                kmin = col2
            }
        }
        col3 = col.split(',').slice(0, 3).reduce(function (y, x) {
            if (parseInt(x).toString(16).length == 1) {
                return y + "0" + parseInt(x).toString(16)
            }
            else {
                return y + parseInt(x).toString(16)
            }
        }, "#")
        spectre[kmin] = col3
    }
    for (divElt of classColor) { divElt.style = 'background-color:' + spectre[divElt.id.toLowerCase()] + ";" }
    console.log(trueColor)
}

chosenColor = ""

function choseColor(e) {
    chosenColor = e.style["background-color"]
    chosenColor = chosenColor.replace('rgb(', '').replace(')', '').replaceAll(' ', '')
    boutonColor = document.getElementById("chosenColor")
    couleursplit = chosenColor.split(',')
    boutonColor.style["background-color"] = "rgb(" + couleursplit[0] + "," + couleursplit[1] + "," + couleursplit[2] + ")"
}
xglobal = 0
yglobal = 0

function changeColor(e) {


    if (chosenColor == "") {
        alert("Vous devez d'abord choisir une couleur")
    } else {


        xC = Math.round(e.getBoundingClientRect().x)
        yC = Math.round(e.getBoundingClientRect().y)

        posClickX = xglobal - xC - 1;
        posClickY = yglobal - yC - 1;



        canvasReponse = document.getElementById("reponse");
        ctxReponse = canvasReponse.getContext("2d");


        canvas = document.getElementById("myCanvas");
        ctx = canvas.getContext("2d");
        w = canvas.width;
        h = canvas.height;
        data = ctx.getImageData(0, 0, w, h);
        dataOriginal = ctxReponse.getImageData(0, 0, w, h);
        pixelsOriginal = dataOriginal["data"];
        pixels = data["data"]
        pixelsColOriginal = [];

        for (var i = 0; i < pixels.length; i += 4) {
            pixelsColOriginal.push(pixelsOriginal.slice(i, i + 4));
        }

        chosenColorPixel = posClickY * w + posClickX

        selectedColor = chosenColor.split(',')
        OriginalColor = pixelsColOriginal[chosenColorPixel]

        usedColor[OriginalColor] = selectedColor.join() + ",255"

        for (i = 0; i < pixelsCol.length; i++) {

            if (pixelsColOriginal[i][0] == OriginalColor[0] && pixelsColOriginal[i][1] == OriginalColor[1] && pixelsColOriginal[i][2] == OriginalColor[2]) {

                pixelsCol[i][0] = selectedColor[0];
                pixelsCol[i][1] = selectedColor[1];
                pixelsCol[i][2] = selectedColor[2];
            }
        }

        newPixels = []
        for (elt of pixelsCol) {
            for (c of elt) {
                newPixels.push(c);
            }
        }


        for (var i = 0; i < newPixels.length; i++) {
            data["data"][i] = newPixels[i];
        }

        ctx.putImageData(data, 0, 0);
        chosenColor = ""
        boutonColor.style["background-color"] = "rgb(200,200,200)"
    }
}

function hextoRGB(c) {
    c = c.slice(1);
    red = parseInt(c.slice(0, 2), 16);
    green = parseInt(c.slice(2, 4), 16);
    blue = parseInt(c.slice(4, 6), 16);
    return [red, green, blue, 255]
}

function printMousePos(e) {
    xglobal = e.clientX
    yglobal = e.clientY
}

function canvasImage() {
    var btn = document.querySelector("input")
    btn.addEventListener('click', valider);
    colors = ["#FFC0CB"
        , "#FF0000"
        , "#800000"
        , "#A52A2A"
        , "#FA8072"
        , "#FF4500"
        , "#D2691E"
        , "#FFA500"
        , "#FFD700"
        , "#FFFF00"
        , "#808000"
        , "#9ACD32"
        , "#7FFF00"
        , "#008000"
        , "#40E0D0"
        , "#00FFFF"
        , "#008080"
        , "#0000FF"
        , "#000080"
        , "#8A2BE2"
        , "#DDA0DD"
        , "#FF00FF"
        , "#800080"
        , "#D2B48C"
        , "#F5F5DC"
        , "#808080"
        , "#2F4F4F"
        , "#FFFFFF"
        , "#000000"]
    colorsRGB = []
    for (var i = 0; i < colors.length; i++) {
        colorsRGB.push(hextoRGB(colors[i]));
    }

    divColor = document.getElementsByClassName("color")
    for (divElt of divColor) {
        divElt.addEventListener("click", function () { choseColor(this); });
    }

    var canvas = document.getElementById("myCanvas")
    canvas.addEventListener("click", printMousePos)
    canvas.addEventListener("click", function () { changeColor(this); })
    var canvasHidden = document.getElementById("reponse");
    var ctx2 = canvasHidden.getContext("2d");

    var ctx = canvas.getContext("2d");
    var image = new Image();

    image.crossOrigin = "anonymous";

    image.onload = function () {
        boutonColor = document.getElementById("chosenColor")

        canvasHidden.width = this.width;
        canvasHidden.height = this.height;
        canvas.width = Math.floor(this.width);
        boutonColor.width = Math.floor(this.width)
        canvas.height = Math.floor(this.height);
        ctx2.drawImage(this, 0, 0, Math.floor(this.width), Math.floor(this.height));
        ctx.drawImage(this, 0, 0, Math.floor(this.width), Math.floor(this.height));
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height);

        var pixels = data["data"];

        for (var i = 0; i < pixels.length; i += 4) {
            pixelsCol.push(pixels.slice(i, i + 4));
        }

        couleurs = {}
        for (var i = 0; i < pixelsCol.length; i++) {
            var col = pixelsCol[i];
            var r = col[0];
            var g = col[1];
            var b = col[2];
            var str = [r, g, b].join();
            if (Object.keys(couleurs).includes(str)) {
                couleurs[str] += 1;
            } else {
                couleurs[str] = 1;
            }
        }

        for (var i = 0; i < Object.entries(couleurs).length; i++) {
            if (Object.entries(couleurs)[i][1] > 2500) {
                trueColor.push(Object.entries(couleurs)[i][0]);
            }
        }
        spectreCol(trueColor)

        for (var i = 0; i < pixelsCol.length; i++) {
            var col = pixelsCol[i];
            var r = col[0];
            var g = col[1];
            var b = col[2];
            var str = [r, g, b].join();
            if (trueColor.includes(str)) {
                pixelsCol[i] = [200, 200, 200, 255];
            } else {
                pixelsCol[i] = [1, 1, 1, 255];
            }
        }


        pixels = pixelsCol.flat();

        var newData = Uint8ClampedArray.from(pixels)
        var newDatas = ctx.createImageData(canvas.width, canvas.height);
        for (var i = 0; i < newData.length; i++) {
            newDatas.data[i] = newData[i]
        }

        ctx.putImageData(newDatas, 0, 0);




    }

    image.src = "https://flagcdn.com/w640/tm.png";

}

function valider() {
    console.log("oui")
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pixels = data["data"]

    var wrong_colors = [];
    for (var key of Object.keys(usedColor)) {
        if (!trueColor.includes(usedColor[key].split(',').slice(0, 3).join())) {
            wrong_colors.push(usedColor[key])
        }
    }
    console.log(pixelsCol)
    for (var i = 0; i < pixelsCol.length; i++) {
        pixCol = pixelsCol[i].join()
        if (wrong_colors.includes(pixCol)) {
            pixelsCol[i] = [200, 200, 200, 255]
        }
    }
    console.log(pixelsCol)

    for (var i = 0; i < pixelsCol; i) {
        pixels[i + 4 * i] = pixelsCol[i][0];
        pixels[i + 1 + 4 * i] = pixelsCol[i][1];
        pixels[i + 2 + 4 * i] = pixelsCol[i][2];
        pixels[i + 3 + 4 * i] = pixelsCol[i][3];
    }

    console.log(pixels)

    var newData = Uint8ClampedArray.from(pixels)
    var newDatas = ctx.createImageData(canvas.width, canvas.height);
    for (var i = 0; i < newData.length; i++) {
        newDatas.data[i] = newData[i]
    }

    ctx.putImageData(newDatas, 0, 0);
}








