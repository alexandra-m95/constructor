"use strict";

var config; // объект, отражающий содержимое конфигурационного файла
var currentState;
var textureIndex = 1; // самое большое число + 1

// В случае если конфигурационный файл недоступен или не является корректным json'ом,
// то скрипт прекратит работу
loadJSON("customization.json", function (loadedJSON) {
    try {
        config = JSON.parse(loadedJSON);
    } catch (err) {
        console.log("Error: ", err);
        stopScript();
    }

    try {
        loadTextures();
        loadStitches();
    } catch (err) {
        console.log("Error: ", err);
        stopScript();
    }
}, function () {
    console.log("Error: ", xobj.statusText);
    stopScript();
});

/** Динамическое формирование содержимого окна с текстурами. Каждый элемент окна соотвествует
текстуре, существующей в файле настроек.
*/
function loadTextures() {
    var textureLinksDiv = $("textures");
    var isFirst = true;
    var textureTypes = config["Texture"];
    for (var textureType in textureTypes) {
        var entry = document.createElement("li");
        var entryLink = document.createElement("a");
        entryLink.setAttribute("href", "#");
        entryLink.classList.add("texture-link");
        entryLink.setAttribute("onclick", "changeTextureInfo(event, '" + textureType + "')");
        if (isFirst) {
            var nameField = $("texture_name");
            nameField.value = config["Texture"][textureType]["Text"];
            entryLink.className += " active";
            entryLink.click();
            isFirst = false;
        }
        entryLink.value = textureType;
        entryLink.id = textureType + "-link";
        var textureName = config["Texture"][textureType]["Text"];
        entryLink.appendChild(document.createTextNode(textureName));
        entry.appendChild(entryLink);
        textureLinksDiv.appendChild(entry);
    }

    loadTexturesColors();

    loadParameters(config);
}

/** Формирование содержимого выпадающего списка с цветами текстур, а также
    выбор в нем цвета, соотвествущего текущей активной текстуре(первой).
*/
function loadTexturesColors() {
    var firstTextureLink = document.getElementsByClassName("texture-link")[0];
    for (var color in config["TexturesByColor"]) {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(color));
        option.value = color;
        option.setAttribute("onmouseenter", "changeSelectedBoxValue(this.value)");
        option.setAttribute("onclick", "changeSelectedBoxValue(this.value)");
        if (config["TexturesByColor"][color].indexOf(firstTextureLink.value) != -1) {
            $("colors-select").value = color;
            var colorDiv = $("color-div");
            colorDiv.style.backgroundColor = color;
        }

        $("colors-select").appendChild(option);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = config["TexturesByColor"][color][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var texture = _step.value;

                var textureLink = $(texture + "-link");
                textureLink.setAttribute("color", color);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
}

/** Вызывается при выборе одной из текстур. Изменяются текстурные данные (
    имя текстуры, изображние, цвет) на соответствующих им виджетах.
*/
function changeTextureInfo(event, textureType) {
    changeTextureImage(textureType);
    var currentTextureLink = event.currentTarget;
    var nameField = $("texture_name");
    var textureName = currentTextureLink.childNodes[0].nodeValue;
    nameField.value = textureName;
    currentTextureLink.className += " active";

    var colorName = currentTextureLink.attributes.color.value;
    var colorsSelect = $("colors-select");
    colorsSelect.value = colorName;
    var colorDiv = $("color-div");
    colorDiv.style.backgroundColor = colorName;
    var textureLinks = document.getElementsByClassName("texture-link");
}

/** Изменение изображения при выборе новой текстуры. */
function changeTextureImage(textureType) {
    var textureLinks = document.getElementsByClassName("texture-link");
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = textureLinks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var textureLink = _step2.value;

            textureLink.className = textureLink.className.replace(" active", "");
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    var images = document.getElementsByClassName("texture-img");
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = images[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var image = _step3.value;

            image.style.display = "none";
            image.className = image.className.replace(" active", "");
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    var image = $(textureType + "-img");
    if (image == undefined) {
        var divForImg = $("texture-img-div");
        image = document.createElement("img");
        image.id = textureType + "-img";
        image.classList.add("texture-img");
        var imgPath = config["Texture"][textureType]["Texture filename"];
        if (imgPath != undefined) {
            image.setAttribute('src', config["Texture folder"] + imgPath);
        }
        divForImg.appendChild(image);
        image.style.display = "block";
    }
    image.style.display = "block";
    image.classList.add("active");
}

/** Обработка изменения имени текстуры. Изменяются данные в config*/
function changeTextureNameHandler(event) {
    if (event.keyCode == 13) {
        var textureLinks = document.getElementsByClassName("texture-link");
        var i = 0;
        while (!textureLinks[i].className.endsWith("active")) {
            i += 1;
        }
        textureLinks[i].childNodes[0].nodeValue = $("texture_name").value;

        config["Texture"][textureLinks[i].value]["Text"] = $("texture_name").value;
    }
}

/** Обработка добавления новой текстуры.  Изменяются данные в config*/
function addNewTextureHandler(event) {
    var textureLinks = $("textures");
    var entry = document.createElement("li");
    var entryLink = document.createElement("a");
    entryLink.setAttribute("href", "#");
    entryLink.classList.add("texture-link");
    entryLink.classList.add("new-link");

    var textureType = "Texture(" + textureIndex + ")";
    textureIndex += 1;
    entryLink.value = textureType;

    var colorsSelect = $("colors-select");
    var defaultColor = colorsSelect.childNodes[0].value;
    config["Texture"][textureType] = {};
    config["Texture"][textureType]["Text"] = textureType;
    config["TexturesByColor"][defaultColor].push(textureType);

    entryLink.id = textureType + "-link";
    entryLink.setAttribute("onclick", "changeTextureInfo(event, '" + textureType + "')");
    entryLink.appendChild(document.createTextNode(textureType));
    var colorsSelect = $("colors-select");
    var defaultColor = colorsSelect.childNodes[0].value;
    entryLink.setAttribute("color", defaultColor);
    entry.appendChild(entryLink);
    textureLinks.appendChild(entry);
    entryLink.click();
    textureLinks.scrollTop = textureLinks.scrollHeight;
}

function removeTextureHandler(event) {
    var textures = $("textures");
    var tablinks = document.getElementsByClassName("texture-link");
    var i = 0;
    while (!tablinks[i].className.endsWith("active")) {
        i += 1;
    }

    delete config["Texture"][tablinks[i].value];
    removeTextureForTypeTab(tablinks[i].value);

    var texturesByColors = config["TexturesByColor"];
    for (var textureColor in texturesByColors) {
        var textureInd = config["TexturesByColor"][textureColor].indexOf(tablinks[i].value);
        if (textureInd != -1) {
            config["TexturesByColor"][textureColor].splice(textureInd, 1);
        }
    }

    textures.removeChild(tablinks[i].parentNode);

    if (i == tablinks.length && tablinks.length != 0) {
        tablinks[i - 1].click();
    } else if (i < tablinks.length && tablinks.length != 0) {
        tablinks[i].click();
    }
}

function handleFiles(files) {
    var reader = new FileReader();
    reader.onload = function (file) {
        return function (event) {
            var images = document.getElementsByClassName("texture-img");
            var i = 0;
            while (!images[i].className.endsWith("active")) {
                i += 1;
            }
            images[i].setAttribute('src', event.target.result);
            images[i].style.display = "block";
            var textureType = images[i].name;
            var entryLink = $(textureType + "-link");
            entryLink.className = entryLink.className.replace(" new-link", "");

            config["Texture"][textureType]["Base64"] = event.target.result;
            //    file.Copy("tmp/" + file.name, true);
        };
    }(files[0]);

    var image = reader.readAsDataURL(files[0]);
}

function callPicker() {
    var colorPicker = $("color-picker");
    var colorsSelect = $("colors-select");
    colorPicker.value = colorsSelect.value;
    colorPicker.click();
}

function changeSelectedBoxValue(color) {
    var colorsSelect = $("colors-select");
    colorsSelect.value = color;
    var colorDiv = $("color-div");
    colorDiv.style.backgroundColor = color;
    var tablinks = document.getElementsByClassName("texture-link");
    for (var i = 0; i < tablinks.length; i++) {
        if (tablinks[i].className.endsWith("active")) {
            tablinks[i].setAttribute("color", color);

            var texturesByColors = config["TexturesByColor"];
            for (var textureColor in texturesByColors) {
                var textureInd = config["TexturesByColor"][textureColor].indexOf(tablinks[i].value);
                if (textureInd != -1) {
                    config["TexturesByColor"][textureColor].splice(textureInd, 1);
                }
            }
            if (!config["TexturesByColor"].hasOwnProperty(color)) {
                config["TexturesByColor"][color] = [];
            }
            config["TexturesByColor"][color].push(tablinks[i].value);
        }
    }
}

function addNewColor(color) {
    var colorsSelect = $("colors-select");
    if (!config["TexturesByColor"].hasOwnProperty(color)) {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(color));
        option.id = color;
        option.value = color;
        option.setAttribute("onmouseenter", "changeSelectedBoxValue(this.value)");
        option.setAttribute("onclick", "changeSelectedBoxValue(this.value)");
        colorsSelect.appendChild(option);
    }
    changeSelectedBoxValue(color);
}

String.prototype.endsWith = function (suffix) {
    return this.match(suffix + "$") == suffix;
};