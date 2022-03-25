

document.cookie = "";
function game() {
    var trueColor = [];
    var pixelsCol = [];
    changeID = {}
    spectre = {}
    function logw(c) {
        console.log(1);
    }
    usedColor = {}

    function copyToClipBoard() {
        day = new Date();
        day = day.toJSON().slice(0, 10);
        guesses = JSON.parse(localStorage.guesses)[day].totalTries;
        console.log(guesses)
        console.log(trueColor.length)
        text = ["Flagle, jour: " + jours.length + "\n"];

        for (guess of guesses) {
            g = "";
            for (i = 0; i < guess[0]; i++) {
                g += "🟩";
            }
            for (i = 0; i < guess[1]; i++) {
                g += "🟨";
            }

            for (i = 0; i < trueColor.length - (guess[1] + guess[0]); i++) {
                g += "⬜";
            }

            text.push(g);
        }
        if (JSON.parse(localStorage.guesses)[day].hasOwnProperty("star")) {
            if (JSON.parse(localStorage.guesses)[day].star == 1) {
                text[text.length - 1] += "🔷"
            }
        }

        console.log(text)

        div = document.querySelector("textarea");
        div.innerHTML = text.join('\n');
        div.innerHTML += '\n\nflagle.dcpepper.fr';
        div.select();
        navigator.clipboard.writeText(div.innerHTML);
    }


    function spectreCol(trueColors) {

        classColor = document.getElementsByClassName("color")
        classColor2 = document.getElementsByClassName("colore")
        allColors = []
        for (divElt of classColor) { spectre[divElt.id.toLowerCase()] = divElt.id.toLowerCase() }

        for (col of trueColors) {
            [r, g, b] = col.split(',');
            pmin = 100
            kmin = [-1, -1, -1]
            col3 = col.split(',').slice(0, 3).reduce(function (y, x) {
                if (parseInt(x).toString(16).length == 1) {
                    return y + "0" + parseInt(x).toString(16)
                }
                else {
                    return y + parseInt(x).toString(16)
                }
            }, "#");
            if (!Object.keys(spectre).includes(col3)) {
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

                    if (p < pmin && (!trueColors.includes(cc.join()))) {
                        pmin = p
                        kmin = col2
                    }
                }
            }

            spectre[kmin] = col3
            changeID[kmin] = col3
        }

        for (divElt of classColor) { divElt.style = 'background-color:' + spectre[divElt.id.toLowerCase()] + ";" }
        for (divElt of classColor2) {
            if (Object.keys(changeID).includes(divElt.id.slice(0, divElt.id.length - 1).toLowerCase())) {
                divElt.id = changeID[divElt.id.slice(0, divElt.id.length - 1).toLowerCase()].toUpperCase() + '.'
            }
            divElt.style = 'background-color:rgb(200,200,200)'
        }
        h2 = document.querySelector("h2")
        h2.innerHTML = "Il y a " + trueColor.length + " couleurs à trouver."

    }

    chosenColor = ""

    function choseColor(e) {
        chosenColor = e.style["background-color"]
        chosenColor = chosenColor.replace('rgb(', '').replace(')', '').replaceAll(' ', '')
        boutonColor = document.getElementById("chosenColor")
        couleursplit = chosenColor.split(',')
        boutonColor.style["background-color"] = "rgb(" + couleursplit[0] + "," + couleursplit[1] + "," + couleursplit[2] + ")"
        boutonColor.style["width"] = "50%";
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

            if (trueColor.includes(OriginalColor.slice(0, 3).join())) {
                usedColor[OriginalColor] = selectedColor.join() + ",255"

                for (i = 0; i < pixelsCol.length; i++) {

                    if (pixelsColOriginal[i][0] == OriginalColor[0] && pixelsColOriginal[i][1] == OriginalColor[1] && pixelsColOriginal[i][2] == OriginalColor[2]) {

                        pixelsCol[i][0] = selectedColor[0];
                        pixelsCol[i][1] = selectedColor[1];
                        pixelsCol[i][2] = selectedColor[2];
                    }
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
            boutonColor.style["width"] = "10%"
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

    btn = document.getElementById('button')

    btn.addEventListener('click', valider);

    var canvas = document.getElementById("myCanvas")
    canvas.addEventListener("click", printMousePos)
    canvas.addEventListener("click", function () { changeColor(this); })
    var canvasHidden = document.getElementById("reponse");
    var ctx2 = canvasHidden.getContext("2d");

    var ctx = canvas.getContext("2d");
    var image = new Image();
    boutonColor = document.getElementById("chosenColor")

    image.crossOrigin = "anonymous";
    couleurs = {}



    function restoreData() {
        if (localStorage.hasOwnProperty("guesses")) {
            day = new Date();
            day = day.toJSON().slice(0, 10);
            if (JSON.parse(localStorage.getItem("guesses")).hasOwnProperty(day)) {
                dayGuesses = JSON.parse(localStorage.getItem("guesses"))[day];
                good_colors = dayGuesses["good_colors"];
                almost_colors = dayGuesses["almost_colors"];
                wrong_colors = dayGuesses["wrong_colors"];
                if (dayGuesses.hasOwnProperty('data')) {
                    datas = dayGuesses["data"];
                } else {
                    datas = []
                }
                tries = dayGuesses["totalTries"];
                star = dayGuesses["star"];

                for (var k = 0; k < tries.length; k++) {
                    totalTries = tries[k];
                    divTry = document.createElement("div");
                    divTry.id = "divTry" + k;

                    divTry.style["display"] = "flex";
                    divTry.style["justify-content"] = "center";

                    document.getElementById("resultat").appendChild(divTry)

                    for (var i = 0; i < 2; i++) {
                        if (i == 0) {

                            for (j = 0; j < totalTries[i]; j++) {

                                divCol = document.createElement("div");
                                divCol.classList.add("blockCol");
                                divCol.style["border"] = "solid 1px";
                                divCol.style["background-color"] = "#67e56d";
                                document.getElementById("divTry" + k).appendChild(divCol)

                            }
                        }
                        else {

                            for (j = 0; j < totalTries[i]; j++) {

                                divCol = document.createElement("div");
                                divCol.classList.add("blockCol");
                                divCol.style["border"] = "solid 1px;";
                                divCol.style["background-color"] = "yellow";

                                document.getElementById("divTry" + k).appendChild(divCol)
                            }
                        }
                    }
                    ent = totalTries[0] + totalTries[1]

                    for (i = 0; i < trueColor.length - ent; i++) {

                        divCol = document.createElement("div");
                        divCol.classList.add("blockCol");
                        divCol.style["border"] = "solid 1px;";
                        divCol.style["background-color"] = "rgb(200,200,200)";
                        document.getElementById("divTry" + k).appendChild(divCol)
                    }
                }

                final = tries[tries.length - 1][0]

                if (final == trueColor.length || tries.length == 6) {

                    if (star == "1") {
                        h2 = document.querySelector("h2");
                        h2.innerHTML = "Impressionnant ! En effet, c'est bien le drapeau de " + CHOSENPAY + ". Rendez-vous demain pour le prochain défi !";

                        star = document.createElement("div");
                        star.id = "star-five";




                        document.getElementById("resultat").children[document.getElementById("resultat").children.length - 1].appendChild(star);
                        document.getElementById("resultat").children[document.getElementById("resultat").children.length - 1].style["margin-left"] = "45px";

                        clip = document.createElement("input");
                        clip.value = "PARTAGER";
                        clip.type = "button";
                        clip.id = "clip";
                        document.getElementById("resultat").appendChild(clip);
                        clip.addEventListener('click', copyToClipBoard);


                        document.getElementById("DivMain").style["display"] = "none";
                        document.getElementById("DivMain2").style["display"] = "none";
                        document.getElementById("chosenColor").style["display"] = "none";
                        document.getElementById("button").style["display"] = "none";
                        document.getElementById("guessCountry").style["display"] = "none";


                        document.getElementById("myCanvas").style["display"] = "none";
                        document.getElementById("reponse").style["display"] = "flex";
                        document.getElementById("resultat").style["display"] = "block";

                    } else if (star == "0") {

                        clip = document.createElement("input");
                        clip.value = "PARTAGER";
                        clip.type = "button";
                        clip.id = "clip";
                        document.getElementById("resultat").appendChild(clip);
                        clip.addEventListener('click', copyToClipBoard);
                        document.getElementById("DivMain").style["display"] = "none";
                        document.getElementById("DivMain2").style["display"] = "none";
                        document.getElementById("chosenColor").style["display"] = "none";
                        document.getElementById("button").style["display"] = "none";
                        document.getElementById("guessCountry").style["display"] = "none";

                        document.getElementById("myCanvas").style["display"] = "none";
                        document.getElementById("reponse").style["display"] = "flex";
                        document.getElementById("resultat").style["display"] = "block";
                        h2 = document.querySelector("h2");
                        h2.innerHTML = "Dommage ! C'est le drapeau de " + CHOSENPAY + ". Rendez-vous demain pour le prochain défi !";
                    }
                    else if (tries.length == 6) {
                        document.getElementById("DivMain").style["display"] = "none";
                        document.getElementById("DivMain2").style["display"] = "none";
                        document.getElementById("chosenColor").style["display"] = "none";
                        document.getElementById("button").style["display"] = "none";
                        document.getElementById("guessCountry").style["display"] = "none";


                        clip = document.createElement("input");
                        clip.value = "PARTAGER";
                        clip.type = "button";
                        clip.id = "clip";
                        document.getElementById("resultat").appendChild(clip);
                        clip.addEventListener('click', copyToClipBoard);

                        document.getElementById("myCanvas").style["display"] = "none";
                        document.getElementById("reponse").style["display"] = "flex";
                        document.getElementById("resultat").style["display"] = "block";
                        h2 = document.querySelector("h2");
                        h2.innerHTML = "Dommage ! C'est le drapeau de " + CHOSENPAY + ". Rendez-vous demain pour le prochain défi !";
                    }

                    else {

                        document.getElementById("search").value = "";
                        document.getElementById('search').focus();
                        h2 = document.querySelector("h2");
                        h2.innerHTML = "Bravo !  🚀\nPouvez vous deviner à qui appartient ce drapeau?";
                        document.getElementById("DivMain").style["display"] = "none";
                        document.getElementById("DivMain2").style["display"] = "none";
                        document.getElementById("chosenColor").style["display"] = "none";
                        document.getElementById("button").style["display"] = "none";
                        document.getElementById("guessCountry").style["display"] = "block";

                        btn = document.getElementById("button2");
                        btn.addEventListener('click', validerCountry);

                        document.getElementById("myCanvas").style["display"] = "none";
                        document.getElementById("reponse").style["display"] = "flex";
                    }
                } else {
                    minis = document.getElementsByClassName("mini");

                    for (var k = 0; k < datas.length; k++) {
                        mini = minis[k];
                        minictx = mini.getContext("2d");
                        miniData = minictx.getImageData(0, 0, mini.width, mini.height);
                        pixelmini = Object.values(datas[k]);

                        for (var l = 0; l < pixelmini.length; l++) {
                            miniData["data"][l] = pixelmini[l];
                        }

                        minictx.putImageData(miniData, 0, 0);

                    }

                    canvas = document.getElementById("myCanvas");
                    canvasctx = canvas.getContext("2d");
                    dataCanvas = canvasctx.getImageData(0, 0, canvas.width, canvas.height)
                    pixels = dataCanvas["data"];
                    pixelsCol = [];

                    canvasRep = document.getElementById("reponse")
                    ctxRep = canvasRep.getContext("2d")
                    dataOriginal = ctxRep.getImageData(0, 0, canvas.width, canvas.height)
                    pixelsOriginal = dataOriginal["data"]
                    pixelsColOriginal = []
                    for (var i = 0; i < pixels.length; i += 4) {
                        pixelsColOriginal.push(pixelsOriginal.slice(i, i + 4));
                    }

                    for (var i = 0; i < pixels.length; i += 4) {
                        pixelsCol.push(pixels.slice(i, i + 4));
                    }

                    console.log(good_colors)
                    for (col of good_colors) {
                        pix = []
                        for (var indexPixel = 0; indexPixel < pixelsColOriginal.length; indexPixel++) {
                            if (pixelsColOriginal[indexPixel].slice(0, 3).join() == col.split(',').slice(0, 3).join()) {
                                pix.push(indexPixel);
                                pixelsCol[indexPixel][0] = col.split(',')[0];
                                pixelsCol[indexPixel][1] = col.split(',')[1];
                                pixelsCol[indexPixel][2] = col.split(',')[2];
                            }
                        }
                        console.log(pix)
                        newPixel = []
                        for (elt of pixelsCol) {
                            for (p of elt) {
                                newPixel.push(p)
                            }
                        }

                        for (var k = 0; k < newPixel.length; k++) {
                            dataCanvas["data"][k] = newPixel[k];
                        }

                        col3 = col.split(',').slice(0, 3).reduce(function (y, x) {
                            if (parseInt(x).toString(16).length == 1) {
                                return y + "0" + parseInt(x).toString(16)
                            }
                            else {
                                return y + parseInt(x).toString(16)
                            }
                        }, "#") + "."
                        bout = document.getElementById(col3.toUpperCase());
                        document.getElementById(col3.toUpperCase()).style["background-color"] = "#67e56d";
                        if (bout.classList.length > 1) {
                            if (bout.classList[1] == "almost") {
                                bout.classList.remove("almost");
                            }
                        }
                        bout.classList.add("good")

                    }
                    canvasctx.putImageData(dataCanvas, 0, 0);

                    for (col of almost_colors) {
                        col3 = col.split(',').slice(0, 3).reduce(function (y, x) {
                            if (parseInt(x).toString(16).length == 1) {
                                return y + "0" + parseInt(x).toString(16)
                            }
                            else {
                                return y + parseInt(x).toString(16)
                            }
                        }, "#") + "."
                        document.getElementById(col3.toUpperCase()).style["background-color"] = "yellow";
                        bout = document.getElementById(col3.toUpperCase());
                        bout.classList.add("almost")
                    }

                    for (col of wrong_colors) {
                        col3 = col.split(',').slice(0, 3).reduce(function (y, x) {
                            if (parseInt(x).toString(16).length == 1) {
                                return y + "0" + parseInt(x).toString(16)
                            }
                            else {
                                return y + parseInt(x).toString(16)
                            }
                        }, "#") + "."
                        document.getElementById(col3.toUpperCase()).style["background-color"] = "black";
                        bout = document.getElementById(col3.toUpperCase());
                        bout.classList.add("wrong")
                    }
                }
            }
        }
    }
    image.onload = function () {

        height = Math.min(this.height, window.innerHeight / 2)
        width = this.width * (height / this.height)
        canvasHidden.width = width;
        canvasHidden.height = height;
        canvas.width = width;
        canvas.height = height;
        ctx2.drawImage(this, 0, 0, width, height);
        ctx.drawImage(this, 0, 0, width, height);
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        un = new Date();
        var pixels = data["data"];

        miniCanvas = document.getElementsByClassName("mini");

        for (can of miniCanvas) {
            can.width = Math.floor(canvas.width / 5)
            can.height = Math.floor(canvas.height / 5)


        }
        for (var i = 0; i < pixels.length; i += 4) {
            pixelsCol.push(pixels.slice(i, i + 4));
        }




        for (var i = 0; i < pixelsCol.length; i++) {
            var col = pixelsCol[i];
            var r = col[0];
            var g = col[1];
            var b = col[2];
            var str = [r, g, b].join();
            couleurs[str] = couleurs[str] ? couleurs[str] + 1 : 1;
        }

        for (colEntry of Object.entries(couleurs)) {
            if (colEntry[1] * 100 / (height * width) < 0.5) {
                delete couleurs[colEntry[0]];
            }
        }
        for (var i = 0; i < Object.entries(couleurs).length; i++) {

            if (CHOSENPAYISO.toLowerCase() == "ar") {
                if (Object.entries(couleurs)[i][1] > 1450) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
            } else if (CHOSENPAYISO.toLowerCase() == "aw") {
                if (Object.entries(couleurs)[i][1] > 2680) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
            }
            else if (CHOSENPAYISO.toLowerCase() == "br") {
                if (Object.entries(couleurs)[i][1] > 2380) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
            }
            else if (CHOSENPAYISO.toLowerCase() == "ky") {
                if (Object.entries(couleurs)[i][1] > 1500) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
            }
            else if (CHOSENPAYISO.toLowerCase() == "fj") {
                if (Object.entries(couleurs)[i][1] > 1450) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
            }
            else if (CHOSENPAYISO.toLowerCase() == "gt") {
                if (Object.entries(couleurs)[i][1] > 800) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
            }
            else if (CHOSENPAYISO.toLowerCase() == "lr") {
                if (Object.entries(couleurs)[i][1] > 3000) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
            }
            else if (CHOSENPAYISO.toLowerCase() == "mp") {
                if (Object.entries(couleurs)[i][1] > 3000) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
            }
            else if (CHOSENPAYISO.toLowerCase() == "sm") {
                if (Object.entries(couleurs)[i][1] * 100 / (height * width) > 0.5) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
            }
            else if (CHOSENPAYISO.toLowerCase() == "tk") {
                if (Object.entries(couleurs)[i][1] * 100 / (height * width) > 0.5) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
            }
            else {
                if (Object.entries(couleurs)[i][1] * 100 / (height * width) > 1) {
                    console.log({ "col": Object.entries(couleurs)[i] })
                    trueColor.push(Object.entries(couleurs)[i][0]);
                }
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
        boutonColor.style["width"] = canvas.width
        classColor = document.getElementsByClassName("color")
        classColor2 = document.getElementsByClassName("colore")
        for (divElt of classColor) {
            divElt.style["width"] = canvas.width * 2 / classColor.length
            divElt.style["height"] = canvas.width * 2 / classColor.length

        }
        for (divElt of classColor2) {
            divElt.style["width"] = canvas.width * 3 / classColor2.length
            divElt.style["height"] = canvas.width * 3 / classColor2.length
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


        restoreData();

    }




    function reload() {
        location.reload()
    }

    if (localStorage.hasOwnProperty('guesses')) {
        date = new Date();
        date = date.toJSON().slice(0, 10);
        if (JSON.parse(localStorage["guesses"]).hasOwnProperty(date)) {
            guesses = JSON.parse(localStorage["guesses"])[date]
            V = guesses = JSON.parse(localStorage["guesses"])[date]["V"];
        }
        else {
            V = -1;
        }
    } else {
        V = -1
    }


    function validerCountry() {
        text = document.getElementById("search").value;
        if (text.toLowerCase() == CHOSENPAY.toLowerCase()) {
            starBol = 1;



            h2 = document.querySelector("h2")
            h2.innerHTML = "Impressionnant ! En effet, c'est bien le drapeau de " + CHOSENPAY

            star = document.createElement("div")
            star.id = "star-five"




            document.getElementById("resultat").children[document.getElementById("resultat").children.length - 1].appendChild(star)
            document.getElementById("resultat").children[document.getElementById("resultat").children.length - 1].style["margin-left"] = "45px";

            clip = document.createElement("input");
            clip.value = "PARTAGER";
            clip.type = "button";
            clip.id = "clip";
            clip.addEventListener('click', copyToClipBoard);
            document.getElementById("resultat").appendChild(clip);
        } else {
            starBol = 0;
            h2 = document.querySelector("h2")
            h2.innerHTML = "Dommage ! C'est le drapeau de " + CHOSENPAY


            clip = document.createElement("input");
            clip.value = "PARTAGER";
            clip.type = "button";
            clip.id = "clip";
            clip.addEventListener('click', copyToClipBoard);
            document.getElementById("resultat").appendChild(clip);
        }

        guesses = JSON.parse(localStorage["guesses"])
        day = new Date();
        day = day.toJSON().slice(0, 10);
        guessDay = guesses[day];
        guessDay["star"] = starBol;
        guessDay["win"] = "1";

        if (guessDay.hasOwnProperty("data")) {
            delete guessDay["data"];
        }


        guesses[day] = guessDay;

        localStorage.setItem("guesses", JSON.stringify(guesses))
        statistiques();

        document.getElementById("button2").removeEventListener('click', validerCountry)

        document.getElementById("resultat").style["display"] = "block"
    }

    totalTries = [];
    var wrong_colors = [];
    var almost_colors = [];
    var good_colors = [];

    function statistiques() {
        if (localStorage.hasOwnProperty("guesses")) {

            guesses = JSON.parse(localStorage["guesses"]);
            Parties = Object.keys(JSON.parse(localStorage.guesses)).length;
            etoiles = 0;
            bons = 0;
            presques = 0;
            mauvais = 0;
            nbrCoups = { "1/6": 0, "2/6": 0, "3/6": 0, "4/6": 0, "5/6": 0, "6/6": 0, "-/6": 0 };
            for (day of Object.keys(guesses)) {
                console.log(guesses[day])
                m = guesses[day]["totalTries"].length;
                if (guesses[day].hasOwnProperty("win")) {
                    nbrCoups[String(m) + "/6"]++;
                } else {
                    nbrCoups["-/6"]++;
                }
                if (guesses[day].hasOwnProperty("star")) {
                    etoiles += guesses[day]["star"];
                }
                bons += guesses[day]["good_colors"].length;
                presques = guesses[day]["totalTries"].reduce((y, x) => y + x[1], presques);
                mauvais += guesses[day]["wrong_colors"].length;
            }

            document.getElementById("Parties").innerHTML = Parties;
            for (elt of Object.keys(nbrCoups)) {
                document.getElementById(elt).innerHTML = nbrCoups[elt];
            }
            document.getElementById("oui").innerHTML = bons;
            document.getElementById("presque").innerHTML = presques;
            document.getElementById("non").innerHTML = mauvais;
            document.getElementById("top").innerHTML = etoiles;

        } else {
            document.getElementById("Parties").innerHTML = "0";
            document.getElementById("1/6").innerHTML = "0";
            document.getElementById("2/6").innerHTML = "0";
            document.getElementById("3/6").innerHTML = "0";
            document.getElementById("4/6").innerHTML = "0";
            document.getElementById("5/6").innerHTML = "0";
            document.getElementById("6/6").innerHTML = "0";
            document.getElementById("-/6").innerHTML = "0";
            document.getElementById("oui").innerHTML = "0";
            document.getElementById("presque").innerHTML = "0";
            document.getElementById("non").innerHTML = "0";
            document.getElementById("top").innerHTML = "0";

        }

    }

    function saveToStorage(dataAux) {
        if (!localStorage.hasOwnProperty("guesses")) {
            localStorage.setItem("guesses", "{}");
        }

        guesses = localStorage.getItem("guesses");
        guesses = JSON.parse(guesses);
        date = new Date()
        date = date.toJSON().slice(0, 10)

        if (!guesses.hasOwnProperty(date)) {
            guesses[date] = {};
        }

        guessDate = guesses[date]

        if (!guessDate.hasOwnProperty("data")) {
            guessDate["data"] = [];
        }

        guessDate["data"].push(dataAux);




        str = JSON.stringify(guesses)
        localStorage.setItem("guesses", str)
    }

    function saveToStorageData(step, totTries, g_colors, a_colors, w_colors, bol) {
        if (!localStorage.hasOwnProperty("guesses")) {
            localStorage.setItem("guesses", "{}");
        }

        guesses = localStorage.getItem("guesses");
        guesses = JSON.parse(guesses);
        date = new Date()
        date = date.toJSON().slice(0, 10)

        if (!guesses.hasOwnProperty(date)) {
            guesses[date] = {};
        }

        guessDate = guesses[date]
        guessDate["V"] = step;
        guessDate["good_colors"] = g_colors;
        guessDate["almost_colors"] = a_colors;
        guessDate["wrong_colors"] = w_colors;

        if (!guessDate.hasOwnProperty("totalTries")) {
            guessDate["totalTries"] = [];
        }
        guessDate["totalTries"].push(totTries);
        console.log(bol)
        console.log(guessDate)
        console.log(guessDate.hasOwnProperty("data"))
        if (bol) {
            if (guessDate.hasOwnProperty("data")) {
                delete guessDate["data"];
            }
        }

        guesses[date] = guessDate;
        guessesString = JSON.stringify(guesses);
        localStorage.setItem("guesses", guessesString);
    }

    function valider() {
        V++
        canvas = document.getElementById("myCanvas");
        ctx = canvas.getContext("2d");
        data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        pixels = data["data"]

        canvasRep = document.getElementById("reponse")
        ctxRep = canvasRep.getContext("2d")
        dataOriginal = ctxRep.getImageData(0, 0, canvas.width, canvas.height)
        pixelsOriginal = dataOriginal["data"]
        if (V < 5) {
            petitcanva = document.getElementsByClassName("mini")[V]
            ctxP = petitcanva.getContext("2d")
            w = Math.floor(canvas.width / 5)
            h = Math.floor(canvas.height / 5)
            var dataURL = canvas.toDataURL("image/png")
            img = new Image()
            img.src = dataURL
            img.onload = () => {
                ctxP.drawImage(img, 0, 0, w, h)
                saveToStorage(ctxP.getImageData(0, 0, w, h)["data"]);
            }

        }
        pixelsColOriginal = []
        for (var i = 0; i < pixels.length; i += 4) {
            pixelsColOriginal.push(pixelsOriginal.slice(i, i + 4));
        }


        for (var key of Object.keys(usedColor)) {
            if (!trueColor.includes(usedColor[key].split(',').slice(0, 3).join())) {
                wrong_colors.push(usedColor[key])
                col = usedColor[key]
                col3 = col.split(',').slice(0, 3).reduce(function (y, x) {
                    if (parseInt(x).toString(16).length == 1) {
                        return y + "0" + parseInt(x).toString(16)
                    }
                    else {
                        return y + parseInt(x).toString(16)
                    }
                }, "#") + "."
                col3 = col3.toUpperCase()

                bout = document.getElementById(col3)
                bout.style["background-color"] = "black"

                bout.classList.add("wrong")
            } else if (usedColor[key] == key) {
                col = usedColor[key]
                col3 = col.split(',').slice(0, 3).reduce(function (y, x) {
                    if (parseInt(x).toString(16).length == 1) {
                        return y + "0" + parseInt(x).toString(16)
                    }
                    else {
                        return y + parseInt(x).toString(16)
                    }
                }, "#") + "."
                col3 = col3.toUpperCase()

                bout = document.getElementById(col3)
                bout.style["background-color"] = "#67e56d"
                bout.classList.add("good")
                if (bout.classList.length > 1) {
                    if (bout.classList[1] == "almost") {
                        bout.classList.remove("almost");
                    }
                }
                bout.classList.add("good")

                if (!good_colors.includes(usedColor[key])) {
                    good_colors.push(usedColor[key])
                }

            } else if (!good_colors.includes(usedColor[key])) {
                col = usedColor[key]
                col3 = col.split(',').slice(0, 3).reduce(function (y, x) {
                    if (parseInt(x).toString(16).length == 1) {
                        return y + "0" + parseInt(x).toString(16)
                    }
                    else {
                        return y + parseInt(x).toString(16)
                    }
                }, "#") + "."
                col3 = col3.toUpperCase()

                bout = document.getElementById(col3)
                bout.style["background-color"] = "yellow"
                bout.classList.add("almost")
                if (!almost_colors.includes(usedColor[key])) {
                    almost_colors.push(usedColor[key])
                }



            }
        }
        almost_colors = almost_colors.filter((e) => { return !good_colors.includes(e) })
        console.log(good_colors)
        console.log(almost_colors)
        console.log(wrong_colors)
        totalTries = [good_colors.length, almost_colors.length]

        divTry = document.createElement("div");
        divTry.id = "divTry" + V;

        divTry.style["display"] = "flex";
        divTry.style["justify-content"] = "center";

        document.getElementById("resultat").appendChild(divTry)

        for (var i = 0; i < 2; i++) {
            if (i == 0) {

                for (j = 0; j < totalTries[i]; j++) {

                    divCol = document.createElement("div");
                    divCol.classList.add("blockCol");
                    divCol.style["border"] = "solid 1px";
                    divCol.style["background-color"] = "#67e56d";
                    document.getElementById("divTry" + V).appendChild(divCol)
                }
            }
            else {

                for (j = 0; j < totalTries[i]; j++) {

                    divCol = document.createElement("div");
                    divCol.classList.add("blockCol");
                    divCol.style["border"] = "solid 1px;";
                    divCol.style["background-color"] = "yellow";
                    document.getElementById("divTry" + V).appendChild(divCol)
                }
            }
        }
        ent = totalTries[0] + totalTries[1]

        for (i = 0; i < trueColor.length - ent; i++) {

            divCol = document.createElement("div");
            divCol.classList.add("blockCol");
            divCol.style["border"] = "solid 1px;";
            divCol.style["background-color"] = "rgb(200,200,200)";
            document.getElementById("divTry" + V).appendChild(divCol)
        }



        for (var i = 0; i < pixelsCol.length; i++) {
            pixColOri = pixelsColOriginal[i].join()
            pixCol = pixelsCol[i].join()
            if (good_colors.includes(pixCol)) {
                if (pixCol != pixColOri) {
                    pixelsCol[i] = [200, 200, 200, 255]
                }
            }
            else if (wrong_colors.includes(pixCol)) {
                pixelsCol[i] = [200, 200, 200, 255]
            }
            else if (almost_colors.includes(pixCol)) {
                pixelsCol[i] = [200, 200, 200, 255]
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
        vic = true;
        for (key of Object.keys(usedColor)) {
            if (usedColor[key] != key) {
                vic = false
            }
        }
        console.log(trueColor)
        for (key of Object.keys(usedColor)) {
            if (!trueColor.includes(key)) {
                delete usedColor[key]
            }
        }
        console.log(totalTries)



        bolChangeLocalStorage = false;
        if (good_colors.length == trueColor.length && vic) {
            document.getElementById("search").value = "";
            document.getElementById('search').focus();
            h2 = document.querySelector("h2")
            h2.innerHTML = "Bravo ! Rendez-vous demain pour le prochain défi 🚀\nPouvez vous deviner à qui appartient ce drapeau?"
            document.getElementById("DivMain").style["display"] = "none"
            document.getElementById("DivMain2").style["display"] = "none"
            document.getElementById("chosenColor").style["display"] = "none"
            document.getElementById("button").style["display"] = "none"
            document.getElementById("guessCountry").style["display"] = "block"

            btn = document.getElementById("button2")
            btn.addEventListener('click', validerCountry);

            document.getElementById("myCanvas").style["display"] = "none"
            document.getElementById("reponse").style["display"] = "flex"
            bolChangeLocalStorage = true;
        } else if (V == 5) {

            h2 = document.querySelector("h2")
            h2.innerHTML = "Dommage ! Tu feras mieux demain ! 💪\nCe drapeau est: " + CHOSENPAY
            document.getElementById("myCanvas").style["display"] = "none"
            document.getElementById("reponse").style["display"] = "flex"
            document.getElementById("DivMain").style["display"] = "none"
            document.getElementById("DivMain2").style["display"] = "none"
            document.getElementById("chosenColor").style["display"] = "none"
            document.getElementById("resultat").style["display"] = "block"

            document.getElementById("button").removeEventListener('click', valider)
            clip = document.createElement("input");
            clip.value = "PARTAGER";
            clip.type = "button";
            clip.id = "clip";
            clip.addEventListener('click', copyToClipBoard);
            document.getElementById("resultat").appendChild(clip);
            bolChangeLocalStorage = true;

        }
        console.log(bolChangeLocalStorage)

        saveToStorageData(V, totalTries, good_colors, almost_colors, wrong_colors, bolChangeLocalStorage);

    }

    document.body.style["backgroundColor"] = "rgb( 1, 33, 105);"

    countries = {
        'Afghanistan ': 'AF', 'Afrique du Sud ': 'ZA', 'Åland, Îles ': 'AX', 'Albanie ': 'AL', 'Algérie ': 'DZ', 'Allemagne ': 'DE', 'Andorre ': 'AD', 'Angola ': 'AO', 'Anguilla ': 'AI', 'Antarctique ': 'AQ', 'Antigua et Barbuda ': 'AG', 'Arabie Saoudite ': 'SA', 'Argentine ': 'AR', 'Arménie ': 'AM', 'Aruba ': 'AW', 'Australie ': 'AU', 'Autriche ': 'AT', 'Azerbaïdjan ': 'AZ', 'Bahamas ': 'BS', 'Bahrein ': 'BH', 'Bangladesh ': 'BD', 'Barbade ': 'BB', 'Bélarus ': 'BY', 'Belgique ': 'BE', 'Bélize ': 'BZ', 'Bénin ': 'BJ', 'Bermudes ': 'BM', 'Bhoutan ': 'BT', 'Bolivie(État plurinational de) ': 'BO', 'Bonaire, Saint- Eustache et Saba ': 'BQ', 'Bosnie - Herzégovine ': 'BA', 'Botswana ': 'BW', 'Brésil ': 'BR', 'Brunéi Darussalam ': 'BN', 'Bulgarie ': 'BG', 'Burkina Faso ': 'BF', 'Burundi ': 'BI', 'Cabo Verde ': 'CV', 'Caïmans, Iles ': 'KY', 'Cambodge ': 'KH', 'Cameroun ': 'CM', 'Canada ': 'CA', 'Chili ': 'CL', 'Chine ': 'CN', 'Christmas, île ': 'CX', 'Chypre ': 'CY', 'Cocos / Keeling(Îles) ': 'CC', 'Colombie ': 'CO', 'Comores ': 'KM', 'Congo ': 'CG', 'Congo, République démocratique du ': 'CD', 'Cook, Iles ': 'CK', 'Corée, République de ': 'KR', 'Corée, République populaire démocratique de ': 'KP', 'Costa Rica ': 'CR', "Côte d'Ivoire ": 'CI', 'Croatie ': 'HR', 'Cuba ': 'CU', 'Curaçao ': 'CW', 'Danemark ': 'DK', 'Djibouti ': 'DJ', 'Dominicaine, République ': 'DO', 'Dominique ': 'DM', 'Egypte ': 'EG', 'El Salvador ': 'SV', 'Emirats arabes unis ': 'AE', 'Equateur ': 'EC', 'Erythrée ': 'ER', 'Espagne ': 'ES', 'Estonie ': 'EE', "Etats - Unis d'Amérique ": 'US', 'Ethiopie ': 'ET', 'Falkland / Malouines(Îles) ': 'FK', 'Féroé, îles ': 'FO', 'Fidji ': 'FJ', 'Finlande ': 'FI', 'France ': 'FR', 'Gabon ': 'GA', 'Gambie ': 'GM', 'Géorgie ': 'GE', 'Géorgie du sud et les îles Sandwich du sud ': 'GS', 'Ghana ': 'GH', 'Gibraltar ': 'GI', 'Grèce ': 'GR', 'Grenade ': 'GD', 'Groenland ': 'GL', 'Guadeloupe ': 'GP', 'Guam ': 'GU', 'Guatemala ': 'GT', 'Guernesey ': 'GG', 'Guinée ': 'GN', 'Guinée - Bissau ': 'GW', 'Guinée équatoriale ': 'GQ', 'Guyana ': 'GY', 'Guyane française ': 'GF', 'Haïti ': 'HT', 'Honduras ': 'HN', 'Hong Kong ': 'HK', 'Hongrie ': 'HU', 'Île de Man ': 'IM', 'Îles vierges britanniques ': 'VG', 'Îles vierges des Etats - Unis ': 'VI', 'Inde ': 'IN', "Indien (Territoire britannique de l'océan) ": 'IO', 'Indonésie ': 'ID', "Iran, République islamique d' ": 'IR', 'Iraq ': 'IQ', 'Irlande ': 'IE', 'Islande ': 'IS', 'Israël ': 'IL', 'Italie ': 'IT', 'Jamaïque ': 'JM', 'Japon ': 'JP', 'Jersey ': 'JE', 'Jordanie ': 'JO', 'Kazakhstan ': 'KZ', 'Kenya ': 'KE', 'Kirghizistan ': 'KG', 'Kiribati ': 'KI', 'Koweït ': 'KW', 'Lao, République démocratique populaire ': 'LA', 'Lesotho ': 'LS', 'Lettonie ': 'LV', 'Liban ': 'LB', 'Libéria ': 'LR', 'Libye ': 'LY', 'Liechtenstein ': 'LI', 'Lituanie ': 'LT', 'Luxembourg ': 'LU', 'Macao ': 'MO', "Macédoine, l'ex - République yougoslave de ": 'MK', 'Madagascar ': 'MG', 'Malaisie ': 'MY', 'Malawi ': 'MW', 'Maldives ': 'MV', 'Mali ': 'ML', 'Malte ': 'MT', 'Mariannes du nord, Iles ': 'MP', 'Maroc ': 'MA', 'Marshall, Iles ': 'MH', 'Martinique ': 'MQ', 'Maurice ': 'MU', 'Mauritanie ': 'MR', 'Mayotte ': 'YT', 'Mexique ': 'MX', 'Micronésie, Etats Fédérés de ': 'FM', 'Moldova, République de ': 'MD', 'Monaco ': 'MC', 'Mongolie ': 'MN', 'Monténégro ': 'ME', 'Montserrat ': 'MS', 'Mozambique ': 'MZ', 'Myanmar ': 'MM', 'Namibie ': 'NA', 'Nauru ': 'NR', 'Népal ': 'NP', 'Nicaragua ': 'NI', 'Niger ': 'NE', 'Nigéria ': 'NG', 'Niue ': 'NU', 'Norfolk, Ile ': 'NF', 'Norvège ': 'NO', 'Nouvelle - Calédonie ': 'NC', 'Nouvelle - Zélande ': 'NZ', 'Oman ': 'OM', 'Ouganda ': 'UG', 'Ouzbékistan ': 'UZ', 'Pakistan ': 'PK', 'Palaos ': 'PW', 'Palestine, Etat de ': 'PS', 'Panama ': 'PA', 'Papouasie - Nouvelle - Guinée ': 'PG', 'Paraguay ': 'PY', 'Pays - Bas ': 'NL', 'Pérou ': 'PE', 'Philippines ': 'PH', 'Pitcairn ': 'PN', 'Pologne ': 'PL', 'Polynésie française ': 'PF', 'Porto Rico ': 'PR', 'Portugal': 'PT', 'Qatar ': 'QA', 'République arabe syrienne ': 'SY', 'République centrafricaine ': 'CF', 'Réunion ': 'RE', 'Roumanie ': 'RO', "Royaume-Uni de Grande-Bretagne et d'Irlande du Nord ": 'GB', 'Russie, Fédération de ': 'RU', 'Rwanda ': 'RW', 'Sahara occidental ': 'EH', 'Saint-Barthélemy ': 'BL', 'Saint-Kitts-et-Nevis ': 'KN', 'Saint-Marin ': 'SM', 'Saint-Martin (partie française) ': 'MF', 'Saint-Pierre-et-Miquelon ': 'PM', 'Saint-Siège ': 'VA', 'Saint-Vincent-et-les-Grenadines ': 'VC', 'Sainte-Hélène, Ascension et Tristan da Cunha ': 'SH', 'Sainte-Lucie ': 'LC', 'Salomon, Iles ': 'SB', 'Samoa ': 'WS', 'Samoa américaines ': 'AS', 'Sao Tomé-et-Principe ': 'ST', 'Sénégal ': 'SN', 'Serbie ': 'RS', 'Seychelles ': 'SC', 'Sierra Leone ': 'SL', 'Singapour ': 'SG', 'Slovaquie ': 'SK', 'Slovénie ': 'SI', 'Somalie ': 'SO', 'Soudan ': 'SD', 'Soudan du Sud ': 'SS', 'Sri Lanka ': 'LK', 'Suède ': 'SE', 'Suisse ': 'CH', 'Suriname ': 'SR', 'Svalbard et île Jan Mayen ': 'SJ', 'Swaziland ': 'SZ', 'Tadjikistan ': 'TJ', 'Taïwan, Province de Chine ': 'TW', 'Tanzanie, République unie de ': 'TZ', 'Tchad ': 'TD', 'Tchèque, République ': 'CZ', 'Terres australes françaises ': 'TF', 'Thaïlande ': 'TH', 'Timor-Leste ': 'TL', 'Togo ': 'TG', 'Tokelau ': 'TK', 'Tonga ': 'TO', 'Trinité-et-Tobago ': 'TT', 'Tunisie ': 'TN', 'Turkménistan ': 'TM', 'Turks-et-Caïcos (Îles) ': 'TC', 'Turquie ': 'TR', 'Tuvalu ': 'TV', 'Ukraine ': 'UA', 'Uruguay ': 'UY', 'Vanuatu ': 'VU', 'Venezuela (République bolivarienne du) ': 'VE', 'Viet Nam ': 'VN', 'Wallis et Futuna ': 'WF', 'Yémen ': 'YE', 'Zambie ': 'ZM', 'Zimbabwe ': 'ZW'
    }

    liste = document.getElementById("pays")
    for (pay of Object.keys(countries)) {
        pays = document.createElement("option")
        pays.value = pay.trim()
        liste.appendChild(pays)
    }

    var date = new Date()
    //date.setDate(date.getDate() - 1);
    date = date.toJSON().slice(0, 10);
    jour = new Date();
    jourJSON = jour.toJSON().slice(0, 10);
    depart = "2022-03-24"
    jours = [];
    while (jourJSON != depart) {
        jour.setDate(jour.getDate() - 1);
        jourJSON = jour.toJSON().slice(0, 10);
        p = new Math.seedrandom(jourJSON)
        p = p()
        index = Math.floor(p * (Object.keys(countries).length - 1))
        if (!jours.includes(index)) {
            jours.push(index)
        }
        else {
            j = index;
            while (jours.includes(j)) {
                j = (j + 1) % Object.keys(countries).length;
            }
            index = j;
            jours.push(index)
        }
    }


    var p = new Math.seedrandom(date);
    p = p()
    index = Math.floor(p * (Object.keys(countries).length - 1))
    if (!jours.includes(index)) {
        jours.push(index)
    }
    else {
        j = index;
        while (jours.includes(j)) {
            j = (j + 1) % Object.keys(countries).length;
        }
        index = j;
        jours.push(index)
    }


    CHOSENPAYISO = countries[Object.keys(countries)[index]].toLowerCase()
    CHOSENPAY = Object.keys(countries)[index].trim()


    console.log(CHOSENPAY)

    image.src = "https://flagcdn.com/w640/" + CHOSENPAYISO + ".png";
    /*
        randomCouleurs = []
        for (i = 0; i < 6; i++) {
            p = Math.random()
    
            index = Math.floor(p * (colors.length - 1))
            col = colors[index]
            randomCouleurs.push(col)
        }
    
        document.getElementById("F").style["color"] = randomCouleurs[0]
        document.getElementById("L").style["color"] = randomCouleurs[1]
        document.getElementById("A").style["color"] = randomCouleurs[2]
        document.getElementById("G").style["color"] = randomCouleurs[3]
        document.getElementById("L2").style["color"] = randomCouleurs[4]
        document.getElementById("E").style["color"] = randomCouleurs[5]
    
    */
    p = Math.random()
    index = Math.floor(p * (colors.length - 1))
    col = colors[index]
    document.getElementById("L2").style["color"] = col;
    statistiques();
}

open = document.getElementById('open')
modal = document.getElementById('modal')
modal2 = document.getElementById('modal2')
close = document.getElementById('close')
close2 = document.getElementById('close2')
stat = document.getElementById("stat")

stat.addEventListener('click', () => {

    modal2.style['display'] = "block";
})


open.addEventListener('click', () => {

    modal.style['display'] = "block";
})

close.addEventListener('click', () => {

    modal.style['display'] = "none";

})

close2.addEventListener('click', () => {

    modal2.style['display'] = "none";

})





game();