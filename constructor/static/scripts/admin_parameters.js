"use strict";

var config; // объект, отражающий содержимое конфигурационного файла
var currentState;
var parameterIndex = 1; // самое большое число + 1
var typeIndex = 1;
var changes; // объект, отражающий изменения

function loadParameters(configParam) {
    config = configParam;
    var parametersDiv = $("parameters");
    loadTexturesCheckButtons();
    loadObjectsCheckButtons();
    var isFirst = true;
    for (var parameter in config["Parameters"]) {
        var entry = document.createElement("li");
        var entryLink = document.createElement("a");
        entryLink.setAttribute("href", "#");
        entryLink.classList.add("parameter-link");
        entryLink.value = parameter;
        entryLink.setAttribute("onclick", "changeParameterInfo(event, '" + parameter + "')");
        entryLink.appendChild(document.createTextNode(config["Parameters"][parameter]["Text"]));
        if (isFirst) {
            entryLink.click();
            isFirst = false;
        }
        entry.appendChild(entryLink);
        parametersDiv.appendChild(entry);
    }
}

function changeParameterInfo(event, parameter) {
    var tablinks = document.getElementsByClassName("parameter-link");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    event.currentTarget.className += " active";
    var parameterTypeContents = document.getElementsByClassName("parameter-types-content");
    for (var i = 0; i < parameterTypeContents.length; i++) {
        parameterTypeContents[i].style.display = "none";
    }

    var parameterTypesContent = $(parameter + "-type-content");
    if (parameterTypesContent != undefined) {
        parameterTypesContent.style.display = "block";
    } else {
        loadParameterTypesContent(parameter);
    }
    var firstTypeLink = document.getElementsByClassName(parameter + "-type-link")[0];
    if (firstTypeLink != undefined) {
        firstTypeLink.click();
    } else {
        var nameField = $("type-name");
        nameField.value = "";

        var typePrice = $("type-price");
        typePrice.value = 0;

        var visibilityButton = $("name-is-invisibly");
        visibilityButton.checked = false;

        var texturesContent = $("textures-content");
        texturesContent.display = "none";
        var colorsContent = $("colors-contents");
        colorsContent.style.display = "none";
        $("Without-coloring").checked = true;

        var objectButtons = document.getElementsByClassName("object-button");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = objectButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var button = _step.value;

                button.checked = false;
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

    var nameField = $("parameter-name");
    nameField.value = event.currentTarget.childNodes[0].nodeValue;

    var paramIsDisabledButton = $("param-is-disabled");
    paramIsDisabledButton.checked = config["Parameters"][parameter]["Disabled"];
}

function loadTexturesCheckButtons() {
    var textures = config["Texture"];
    var texturesContent = $("textures-content");
    for (var texture in textures) {
        var checkButton = document.createElement("input");
        checkButton.setAttribute("type", "checkbox");
        checkButton.id = texture + "-checkbox";
        checkButton.setAttribute("onclick", "addOrRemoveTexture(event, '" + texture + "')");
        var label = document.createElement("label");
        label.appendChild(checkButton);
        label.appendChild(document.createTextNode(config["Texture"][texture]["Text"]));
        label.classList.add("texture-button-label");
        texturesContent.appendChild(label);
    }
}

function createNewTexture(texture) {
    var texturesContent = $("textures-content");
    var checkButton = document.createElement("input");
    checkButton.setAttribute("type", "checkbox");
    checkButton.id = texture + "-checkbox";
    checkButton.setAttribute("onclick", "addOrRemoveTexture(event, '" + texture + "')");
    var label = document.createElement("label");
    label.appendChild(checkButton);
    label.appendChild(document.createTextNode(texture));
    label.classList.add("texture-button-label");
    texturesContent.appendChild(label);
}

function removeTextureForTypeTab(texture) {
    var texturesContent = $("textures-content");
    var checkButton = $(texture + "-checkbox");
    texturesContent.removeChild(checkButton.parentNode);
}

function loadObjectsCheckButtons() {
    var objects = config["Objects"];
    var objectsContent = $("objects-content");
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var object = _step2.value;

            var checkButton = document.createElement("input");
            checkButton.setAttribute("type", "checkbox");
            checkButton.id = object + "-checkbox";
            checkButton.setAttribute("onclick", "addOrRemoveObject(event, '" + object + "')");
            checkButton.classList.add("object-button");
            var label = document.createElement("label");
            label.appendChild(checkButton);
            label.appendChild(document.createTextNode(object));
            label.classList.add("texture-button-label");
            objectsContent.appendChild(label);
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
}

function loadParameterTypesContent(parameter) {
    var parameterTypesContent = document.createElement("div");
    parameterTypesContent.classList.add("parameter-types-content");
    parameterTypesContent.id = parameter + "-type-content";
    var isFirst = true;
    for (var type in config["Parameters"][parameter]["Type"]) {
        var entry = document.createElement("li");
        var entryLink = document.createElement("a");
        entryLink.setAttribute("href", "#");
        entryLink.classList.add("type-link");
        entryLink.classList.add(parameter + "-type-link");
        entryLink.setAttribute("onclick", "changeTypeInfo(event, '" + parameter + "','" + type + "')");
        entryLink.parameter = parameter;
        entryLink.value = type;
        if (isFirst) {
            entryLink.click();
            isFirst = false;
        }
        entry.appendChild(entryLink);
        parameterTypesContent.appendChild(entry);
        entryLink.appendChild(document.createTextNode(config["Parameters"][parameter]["Type"][type]["Text"]));
    }
    var typesDiv = $("types");
    typesDiv.appendChild(parameterTypesContent);
}

function addOrRemoveTexture(event, texture) {
    var checkButton = event.currentTarget;
    var coloringRadio = $("Coloring-coloring");
    var parameter = coloringRadio.name;
    var type = coloringRadio.value;
    if (checkButton.checked) {
        config["Parameters"][parameter]["Type"][type]["Textures"].push(texture);
    } else {
        var textureIndex = config["Parameters"][parameter]["Type"][type]["Textures"].indexOf(texture);
        config["Parameters"][parameter]["Type"][type]["Textures"].splice(textureIndex, 1);
    }
}

function addOrRemoveObject(event, object) {
    var checkButton = event.currentTarget;
    var coloringRadio = $("Coloring-coloring");
    var parameter = coloringRadio.name;
    var type = coloringRadio.value;
    if (checkButton.checked) {
        config["Parameters"][parameter]["Type"][type]["Objects"].push(object);
    } else {
        var objectIndex = config["Parameters"][parameter]["Type"][type]["Objects"].indexOf(object);
        config["Parameters"][parameter]["Type"][type]["Objects"].splice(textureIndex, 1);
    }
}

function changeTypeInfo(event, parameter, type) {
    var tablinks = document.getElementsByClassName(parameter + "-type-link");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    var nameField = $("type-name");
    nameField.value = config["Parameters"][parameter]["Type"][type]["Text"];

    var typePrice = $("type-price");
    typePrice.value = config["Parameters"][parameter]["Type"][type]["Price"];

    var visibilityButton = $("name-is-invisibly");
    visibilityButton.checked = config["Parameters"][parameter]["Type"][type]["TextIsInvisibly"];
    event.currentTarget.className += " active";
    var coloringButtons = document.getElementsByClassName("coloring-button");
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = coloringButtons[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var coloringButton = _step3.value;

            coloringButton.name = parameter;
            coloringButton.value = type;
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

    var coloringRadio = $(config["Parameters"][parameter]["Type"][type]["ColoringType"] + "-coloring");
    coloringRadio.click();
    changeObjectsInfo();
}

function changeObjectsInfo() {
    var objectsContent = $("objects-content");

    var coloringRadio = $("Coloring-coloring");

    var parameter = coloringRadio.name;
    var type = coloringRadio.value;

    var allObjects = config["Objects"];
    var objectsByType = config["Parameters"][parameter]["Type"][type]["Objects"];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = allObjects[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var object = _step4.value;

            var objectsCheckButton = $(object + "-checkbox");
            if (objectsByType.indexOf(object) != -1) {
                objectsCheckButton.checked = true;
            } else {
                objectsCheckButton.checked = false;
            }
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }
}

function displayTypeColors() {
    var texturesContent = $("textures-content");
    texturesContent.style.display = "none";
    var colorsContentsDiv = $("colors-contents");
    colorsContentsDiv.style.display = "block";

    var coloringRadio = $("Coloring-coloring");
    var parameter = coloringRadio.name;
    var type = coloringRadio.value;
    var colorsContents = document.getElementsByClassName("colors-content");
    for (var i = 0; i < colorsContents.length; i++) {
        colorsContents[i].style.display = "none";
    }

    var colorsContent = $(parameter + "-" + type + "-colors");
    if (colorsContent == undefined) {
        loadColorsContent(parameter, type);
    } else {
        colorsContent.style.display = "block";
        var colorsByType = document.getElementsByClassName(parameter + "-" + type + "-color-link");
        if (colorsByType.length != 0) {
            colorsByType[0].click();
        }
    }
    config["Parameters"][parameter]["Type"][type]["ColoringType"] = "Coloring";
}

function displayTypeTextures() {
    var texturesContent = $("textures-content");
    texturesContent.style.display = "block";

    var colorsContentsDiv = $("colors-contents");
    colorsContentsDiv.style.display = "none";

    var coloringRadio = $("Coloring-coloring");

    var parameter = coloringRadio.name;
    var type = coloringRadio.value;

    config["Parameters"][parameter]["Type"][type]["ColoringType"] = "Texturing";

    var allTextures = config["Texture"];
    var texturesByType = config["Parameters"][parameter]["Type"][type]["Textures"];
    for (var texture in allTextures) {
        var textureCheckButton = $(texture + "-checkbox");
        if (texturesByType.indexOf(texture) != -1) {
            textureCheckButton.checked = true;
        } else {
            textureCheckButton.checked = false;
        }
    }
}

function hideTexturing() {
    var texturesContent = $("textures-content");
    texturesContent.style.display = "none";

    var colorsContentsDiv = $("colors-contents");
    colorsContentsDiv.style.display = "none";

    var coloringRadio = $("Coloring-coloring");
    var parameter = coloringRadio.name;
    var type = coloringRadio.value;
    config["Parameters"][parameter]["Type"][type]["ColoringType"] = "Without";
}

function loadColorsContent(parameter, type) {
    var colors = config["Parameters"][parameter]["Type"][type]["Colors"];
    var colorsContentsDiv = $("colors-contents");
    colorsContentsDiv.style.display = "block";
    var colorsDivByType = document.createElement("div");
    colorsDivByType.classList.add("colors-content");
    colorsDivByType.id = parameter + "-" + type + "-colors";

    var isFirst = true;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = colors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var color = _step5.value;

            var entry = document.createElement("li");
            var entryLink = document.createElement("a");
            entryLink.setAttribute("href", "#");
            entryLink.classList.add("color-link");
            entryLink.classList.add(parameter + "-" + type + "-color-link");
            entryLink.setAttribute("onclick", "changeActiveColor(event, '" + parameter + "','" + type + "')");
            if (isFirst) {
                entryLink.className += " active";
                isFirst = false;
            }
            entry.appendChild(entryLink);
            colorsDivByType.appendChild(entry);
            entryLink.style.backgroundColor = color;
            entryLink.value = color;
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    colorsContentsDiv.appendChild(colorsDivByType);
    colorsDivByType.style.display = "block";
    var texturesContent = $("textures-content");
    texturesContent.style.display = "none";
}

function changeParameterName(event) {
    if (event.keyCode == 13) {
        var tablinks = document.getElementsByClassName("parameter-link");
        var i = 0;
        while (!tablinks[i].className.endsWith("active")) {
            i += 1;
        }
        tablinks[i].childNodes[0].nodeValue = $("parameter-name").value;
        config["Parameters"][tablinks[i].value]["Text"] = $("parameter-name").value;
    }
}

function changeParameterVisibly(event) {
    var tablinks = document.getElementsByClassName("parameter-link");
    var i = 0;
    while (!tablinks[i].className.endsWith("active")) {
        i += 1;
    }
    config["Parameters"][tablinks[i].value]["Disabled"] = $("param-is-disabled").checked;
}

function changePrice(priveInput) {
    var parametersLinks = document.getElementsByClassName("parameter-link");
    var parameterTypes;
    for (var i = 0; i < parametersLinks.length; i++) {
        if (parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while (!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }
    config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["Price"] = priveInput.value;
    var k = config;
    var s;
}

function changeTypeNameVisibly(event) {
    var parametersLinks = document.getElementsByClassName("parameter-link");
    var parameterTypes;
    for (var i = 0; i < parametersLinks.length; i++) {
        if (parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while (!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }
    config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["TextIsInvisibly"] = $("name-is-invisibly").checked;
}

function changeTypeName(event) {
    if (event.keyCode == 13) {
        var parametersLinks = document.getElementsByClassName("parameter-link");
        var parameterTypes;
        for (var i = 0; i < parametersLinks.length; i++) {
            if (parametersLinks[i].className.endsWith("active")) {
                parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
            }
        }

        var i = 0;
        while (!parameterTypes[i].className.endsWith("active")) {
            i += 1;
        }
        parameterTypes[i].childNodes[0].nodeValue = $("type-name").value;
        config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["Text"] = $("type-name").value;
    }
}

function addNewParameter(event) {
    var tablinks = $("parameters");
    var entry = document.createElement("li");
    var entryLink = document.createElement("a");
    entryLink.setAttribute("href", "#");
    entryLink.classList.add("parameter-link");
    entryLink.className += " new-link"; //  затем удалить

    var parameterName = "Parameter(" + parameterIndex + ")";
    parameterIndex += 1;
    entryLink.value = parameterName;

    entryLink.id = parameterName + "-link";
    entryLink.setAttribute("onclick", "changeParameterInfo(event, '" + parameterName + "')");
    entryLink.appendChild(document.createTextNode(parameterName));
    entryLink.value = parameterName;
    entry.appendChild(entryLink);
    tablinks.appendChild(entry);
    config["Parameters"][parameterName] = {};
    config["Parameters"][parameterName]["Text"] = parameterName;
    config["Parameters"][parameterName]["Disabled"] = false;
    entryLink.click();
    tablinks.scrollTop = tablinks.scrollHeight;
}

function addNewType(event) {
    var tablinks = $("types");
    var entry = document.createElement("li");
    var entryLink = document.createElement("a");
    entryLink.setAttribute("href", "#");
    entryLink.classList.add("type-link");

    var typeName = "Type(" + typeIndex + ")";
    typeIndex += 1;
    entryLink.value = typeName;

    entryLink.appendChild(document.createTextNode(typeName));
    entry.appendChild(entryLink);

    var parametersLinks = document.getElementsByClassName("parameter-link");
    for (var i = 0; i < parametersLinks.length; i++) {
        if (parametersLinks[i].className.endsWith("active")) {
            entryLink.setAttribute("onclick", "changeTypeInfo(event, '" + parametersLinks[i].value + "','" + typeName + "')");
            entryLink.classList.add(parametersLinks[i].value + "-type-link");
            if (config["Parameters"][parametersLinks[i].value]["Type"] == undefined) {
                config["Parameters"][parametersLinks[i].value]["Type"] = {};
            }
            config["Parameters"][parametersLinks[i].value]["Type"][typeName] = {};
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["Text"] = typeName;
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["TextIsInvisibly"] = false;
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["Icon"] = "";
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["Active icon"] = "";
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["Price"] = 0;
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["Objects"] = [];
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["ColoringType"] = "Without";
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["Colors"] = [];
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["Textures"] = [];
            parametersLinks[i].className = parametersLinks[i].className.replace(" new-link", "");
            var parameterTypesContent = $(parametersLinks[i].value + "-type-content");
            entryLink.parameter = parametersLinks[i].value;
            parameterTypesContent.appendChild(entry);
        }
    }

    entryLink.click();
    tablinks.scrollTop = tablinks.scrollHeight;
}

function removeParameter(event) {
    var parameters = $("parameters");
    var tablinks = document.getElementsByClassName("parameter-link");
    var i = 0;
    while (!tablinks[i].className.endsWith("active")) {
        i += 1;
    }

    delete config["Parameters"][tablinks[i].value];

    parameters.removeChild(tablinks[i].parentNode);

    if (i == tablinks.length && tablinks.length != 0) {
        tablinks[i - 1].click();
    } else if (i < tablinks.length && tablinks.length != 0) {
        tablinks[i].click();
    }
}

function removeType(event) {
    var parametersLinks = document.getElementsByClassName("parameter-link");
    var parameterTypes;
    for (var i = 0; i < parametersLinks.length; i++) {
        if (parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while (!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }

    delete config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value];

    var parameterContent = $(parameterTypes[i].parameter + "-type-content");
    parameterContent.removeChild(parameterTypes[i].parentNode);

    if (i == parameterTypes.length && parameterTypes.length != 0) {
        parameterTypes[i - 1].click();
    } else if (i < parameterTypes.length && parameterTypes.length != 0) {
        parameterTypes[i].click();
    }
}

function callTypePicker(event) {
    var colorPicker = $("type-color-picker");
    colorPicker.click();
}

function addNewColorForType(color) {
    var parametersLinks = document.getElementsByClassName("parameter-link");
    var parameterTypes;
    for (var i = 0; i < parametersLinks.length; i++) {
        if (parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while (!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }

    var colorsDivByType = $(parameterTypes[i].parameter + "-" + parameterTypes[i].value + "-colors");
    var entry = document.createElement("li");
    var entryLink = document.createElement("a");
    entryLink.setAttribute("href", "#");
    entryLink.classList.add("color-link");
    entryLink.value = color;
    entryLink.classList.add(parameterTypes[i].parameter + "-" + parameterTypes[i].value + "-color-link");
    entryLink.setAttribute("onclick", "changeActiveColor(event, '" + parameterTypes[i].parameter + "','" + parameterTypes[i].value + "')");

    entry.appendChild(entryLink);
    colorsDivByType.appendChild(entry);
    entryLink.style.backgroundColor = color;
    config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["Colors"].push(color);
    var k = config;
    var s;
}

function changeActiveColor(event, parameter, type) {
    var colorsByType = document.getElementsByClassName(parameter + "-" + type + "-color-link");
    for (var i = 0; i < colorsByType.length; i++) {
        colorsByType[i].className = colorsByType[i].className.replace(" active", "");
    }
    event.currentTarget.className += " active";
}

function removeColorForType() {
    var parametersLinks = document.getElementsByClassName("parameter-link");
    var parameterTypes;
    for (var i = 0; i < parametersLinks.length; i++) {
        if (parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while (!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }

    var colorsByType = document.getElementsByClassName(parameterTypes[i].parameter + "-" + parameterTypes[i].value + "-color-link");
    var j = 0;
    while (!colorsByType[j].className.endsWith("active")) {
        j++;
    }

    var colorsDivByType = $(parameterTypes[i].parameter + "-" + parameterTypes[i].value + "-colors");
    var colorsArray = config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["Colors"];
    var colorIndex = colorsArray.indexOf(colorsByType[j].value);
    delete config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["Colors"].splice(colorIndex, 1);
    colorsDivByType.removeChild(colorsByType[j].parentNode);

    if (j == colorsByType.length && colorsByType.length != 0) {
        colorsByType[j - 1].click();
    } else if (j < colorsByType.length && colorsByType.length != 0) {
        colorsByType[j].click();
    }

    var k = config;
    var s;
}