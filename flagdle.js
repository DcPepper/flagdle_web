var trueColor = [];

function logw(c) {
    console.log(c);
}

function changeColor(e) {
    colour = hextoRGB(e.id);
    console.log(trueColor);
    canvasReponse = document.getElementById("reponse");
    ctxReponse = canvasReponse.getContext("2d");
    if (trueColor.includes(colour.slice(0, 3).join())) {
        console.log("Yes");
    } else {
        console.log("Nay");
    }

    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    data = ctx.getImageData(0, 0, w, h);
    pixels = data["data"]
    var pixelsCol = [];
    for (var i = 0; i < pixels.length; i += 4) {
        pixelsCol.push(pixels.slice(i, i + 4));
    }
    for (var i = 0; i < pixelsCol.length; i++) {
        col = pixelsCol[i]
        r = col[0];
        g = col[1];
        b = col[2];
        if (r != 1 && g != 1 && b != 1) {
            pixelsCol[i] = colour;
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
}

function hextoRGB(c) {
    c = c.slice(1);
    r = parseInt(c.slice(0, 2), 16);
    g = parseInt(c.slice(2, 4), 16);
    b = parseInt(c.slice(4, 6), 16);
    return [r, g, b, 255]
}

function canvasImage() {
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
        divElt.addEventListener("click", function () { changeColor(this); });
    }

    var canvas = document.getElementById("myCanvas")
    var canvasHidden = document.getElementById("reponse");
    var ctx2 = canvasHidden.getContext("2d");

    var ctx = canvas.getContext("2d");
    var image = new Image();

    image.crossOrigin = "anonymous";

    image.onload = function () {
        canvasHidden.width = this.width;
        canvasHidden.height = this.height;
        canvas.width = Math.floor(this.width);
        canvas.height = Math.floor(this.height);
        ctx2.drawImage(this, 0, 0, Math.floor(this.width), Math.floor(this.height));
        ctx.drawImage(this, 0, 0, Math.floor(this.width), Math.floor(this.height));
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height);

        var pixels = data["data"];
        var pixelsCol = [];
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
        logw(trueColor);

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

    image.src = "https://flagcdn.com/w640/sm.png";


}


