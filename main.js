var PUNCH_COLOR = 20; //yellow card

function handleCardColor() {
    var pc = document.getElementById("punch-color");
    pc.disabled = true;

    switch (document.getElementById("card-color").selectedIndex) {
        case 0:
            PUNCH_COLOR = 20;
            pc.value = "20";
            break;
        case 1:
        case 2:
            PUNCH_COLOR = 255;
            pc.value = "255";
            break;
        case 3:
            handlePunchColor();
            pc.disabled = false;
            break;
    }
    var f = document.getElementById("image_file").files[0];
    if (f)
    {
        var reader = new FileReader();
        reader.onload = function() {
            processImage(reader.result);
        };
        reader.readAsDataURL(f);
    }
}

function handlePunchColor() {
    var pc = document.getElementById("punch-color");
    PUNCH_COLOR = parseInt(pc.value);
}

function htmlEncode(s) {
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
}

function count(arr, elem) {
    var c = 0;
    for (var i = 0; i < arr.length; i++)
        if (arr[i] == elem) c++;
    return c;
}

function getCharacter(arr) {
    var num_punches = count(arr, 1);
    var pos;

    if (num_punches == 1) {
        if (arr[0] == 1) return "&"; // &
        else if (arr[1] == 1) return "-"; // -

        pos = arr.slice(2).indexOf(1);
        return String.fromCharCode(48 + pos); // 0 - 9                
    }

    else if (num_punches == 2) {
        pos = arr.slice(0, 3).indexOf(1);
        if (pos == 0) {
            pos = arr.slice(3).indexOf(1);
            if (pos >= 0) return String.fromCharCode(65 + pos); // A - I
        }
        else if (pos == 1) {
            pos = arr.slice(3).indexOf(1);
            if (pos >= 0) return String.fromCharCode(74 + pos); // J - R
        }
        else if (pos == 2) {
            if (arr[3] == 1) return "/"; // /

            pos = arr.slice(4).indexOf(1);
            return String.fromCharCode(83 + pos); // S - Z                    
        }
        else {
            if (arr[10] == 1) {
                switch (arr.slice(4).indexOf(1)) {
                    case 0:
                        return ":";
                    case 1:
                        return "#";
                    case 2:
                        return "@";
                    case 3:
                        return "'";
                    case 4:
                        return "=";
                    case 5:
                        return '"';
                }
            }
        }
    }

    else if (num_punches == 3) {
        if (arr[0] == 1 && arr[2] == 1) {
            pos = arr.slice(3).indexOf(1);
            if (pos >= 0) return String.fromCharCode(97 + pos);
        }
        else if (arr[0] == 1 && arr[1] == 1) {
            pos = arr.slice(3).indexOf(1);
            if (pos >= 0) return String.fromCharCode(106 + pos);
        }

        else if (arr[1] == 1 && arr[2] == 1) {
            pos = arr.slice(4).indexOf(1);
            if (pos >= 0) return String.fromCharCode(115 + pos);
        }

        else {
            if (arr[0] == 1 && arr[10] == 1) {
                switch (arr.slice(4).indexOf(1)) {
                    case 0:
                        return "¢";
                    case 1:
                        return ".";
                    case 2:
                        return "<";
                    case 3:
                        return "(";
                    case 4:
                        return "+";
                    case 5:
                        return '|';
                }
            }

            else if (arr[1] == 1 && arr[10] == 1) {
                switch (arr.slice(4).indexOf(1)) {
                    case 0:
                        return "!";
                    case 1:
                        return "document.getElementById";
                    case 2:
                        return "*";
                    case 3:
                        return ")";
                    case 4:
                        return ";";
                    case 5:
                        return '^';
                }
            }

            else if (arr[2] == 1 && arr[10] == 1) {
                switch (arr.slice(5).indexOf(1)) {
                    case 0:
                        return ",";
                    case 1:
                        return "%";
                    case 2:
                        return "_";
                    case 3:
                        return ">";
                    case 4:
                        return "?";
                }
            }
        }
    }
    return " "; // space
}

function posterizeImage(imgData) {
    for (var i = 0; i < imgData.data.length; i += 4) {
        var r = imgData.data[i];
        var g = imgData.data[i + 1];
        var b = imgData.data[i + 2];
        var a = imgData.data[i + 3];

        if ((r == PUNCH_COLOR && g == PUNCH_COLOR && b == PUNCH_COLOR) || a == 0)
            r = g = b = 0;

        else
            r = g = b = 255;

        imgData.data[i] = r;
        imgData.data[i + 1] = g;
        imgData.data[i + 2] = b;
        imgData.data[i + 3] = 255;
    }
    return imgData;
}

function handleExampleCard(card_id) {
    // reset the file chooser
    document.getElementById("image_file").value = "";
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var img = document.getElementById(card_id);
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    processImage(canvas.toDataURL());
}

function handleYellowExampleCard() {
    document.getElementById("punch-color").value = "20";
    document.getElementById("punch-color").disabled = true;
    document.getElementById("card-color").selectedIndex = 0;
    handleExampleCard("yellow-card");
}

function handleRedExampleCard() {
    document.getElementById("punch-color").value = "255";
    document.getElementById("punch-color").disabled = true;
    document.getElementById("card-color").selectedIndex = 1;
    handleExampleCard("red-card");
}

function handleGreenExampleCard() {
    document.getElementById("punch-color").value = "255";
    document.getElementById("punch-color").disabled = true;
    document.getElementById("card-color").selectedIndex = 2;
    handleExampleCard("green-card");
}


function processImage(imdata) {
    document.getElementById("org_image").src = imdata;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    // Clear punch image
    var punch_image = document.getElementById("punch_image");
    punch_image.src = "";

    var img = new Image();
    img.src = imdata;
    img.onload = function(){
        var im_width = img.width;
        var im_height = img.height;
    
        if (im_width != 588 || im_height != 264) {
            $("#error-modal").modal('show');
            return;
        }
    
        canvas.width = im_width;
        canvas.height = im_height;
        ctx.drawImage(img, 0, 0);
    
        var imgData = ctx.getImageData(0, 0, im_width, im_height);
        imgData = posterizeImage(imgData);
        //ctx.putImageData(imgData, 0, 0);
    
        var step_x = 7,
            step_y = 20;
        var start_x = 14,
            start_y = 20;
    
        // 84 columns of 7 pixels each, 
        var data = []
        for (var col = 0; col < 80; col++) {
            var x = start_x + (col * step_x) + 3;
    
            for (var row = 0; row < 12; row++) {
                var y = start_y + (row * step_y) + 5;
                var px = imgData.data[(y * im_width * 4) + (x * 4)];
    
                if (px == 0) {
                    data.push(1);
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, 2 * Math.PI);
                    ctx.fillStyle = "red";
                    ctx.fill();
                }
                else {
                    data.push(0);
                }
            }
        }
        punch_image.src = canvas.toDataURL();
        var msg = "";
        for (var idx = 0; idx < data.length; idx += 12)
            msg += getCharacter(data.slice(idx, idx + 12));
    
        document.getElementById("result").innerText = htmlEncode(msg);
    }
}

function handleFileSelect(evt) {
    var f = evt.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function() {
        processImage(reader.result);
    };
    reader.readAsDataURL(f);
}
