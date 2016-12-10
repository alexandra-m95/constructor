"use strict"
var parameterIndex = 1; // самое большое число + 1
var typeIndex = 1;

function loadParameters() {
    var parametersDiv = $$("parameters");
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
    event.preventDefault();
    var tablinks = document.getElementsByClassName("parameter-link");
    for (var i = 0; i < tablinks.length; i++) {
         tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    event.currentTarget.className += " active";
    var parameterTypeContents = document.getElementsByClassName("parameter-types-content");
    for (var i = 0; i < parameterTypeContents.length; i++) {
         parameterTypeContents[i].style.display = "none";
    }

    var parameterTypesContent = $$(parameter + "-type-content");
    if(parameterTypesContent != undefined) {
        parameterTypesContent.style.display = "block";
    }
    else {
        loadParameterTypesContent(parameter);
    }
    var firstTypeLink = document.getElementsByClassName(parameter + "-type-link")[0];
    if(firstTypeLink != undefined) {
        firstTypeLink.click();
    }
    else {
        var nameField = $$("type-name");
        nameField.value = "";

        var typePrice = $$("type-price");
        typePrice.value = 0;

        var visibilityButton = $$("name-is-invisibly");
        visibilityButton.checked = false;

        var texturesContent = $$("textures-content");
        texturesContent.display = "none";
        var colorsContent = $$("colors-contents");
        colorsContent.style.display = "none";
        $$("Without-coloring").checked = true;

        var objectButtons = document.getElementsByClassName("object-button");
        for(var button of objectButtons) {
            button.checked = false;
        }

    }

    var nameField = $$("parameter-name");
    nameField.value = event.currentTarget.childNodes[0].nodeValue;

    var paramIsDisabledButton = $$("param-is-disabled");
    paramIsDisabledButton.checked = config["Parameters"][parameter]["Disabled"];
}

function loadTexturesCheckButtons() {
    var textures = config["Texture"];
    var texturesContent = $$("textures-content");
    for(var texture in textures) {
        var checkDiv = document.createElement("li");
        var checkButton = document.createElement("input");
        checkButton.setAttribute("type", "checkbox");
        checkButton.id = texture + "-checkbox";
        checkButton.setAttribute("onclick", "addOrRemoveTexture(event, '" + texture + "')");
        var label = document.createElement("label");
        label.appendChild(checkButton);
        label.appendChild(document.createTextNode(config["Texture"][texture]["Text"]));
        label.classList.add("texture-button-label");
        checkDiv.appendChild(label);
        texturesContent.appendChild(checkDiv);
    }
}

function createNewTexture(texture) {
    var texturesContent = $$("textures-content");
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
    var texturesContent = $$("textures-content");
    var checkButton = $$(texture + "-checkbox");
    texturesContent.removeChild(checkButton.parentNode);
}

function addTextureForTypeTab(texture) {
    var texturesContent = $$("textures-content");
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

function loadObjectsCheckButtons() {
    var objects = config["Objects"];
    var objectsContent = $$("objects-content");
    for(var object of objects) {
        var checkDiv = document.createElement("li");
        var checkButton = document.createElement("input");
        checkButton.setAttribute("type", "checkbox");
        checkButton.id = object + "-checkbox";
        checkButton.setAttribute("onclick", "addOrRemoveObject(event, '" + object + "')");
        checkButton.classList.add("object-button");
        var label = document.createElement("label");
        label.appendChild(checkButton);
        label.appendChild(document.createTextNode(object));
        label.classList.add("texture-button-label");
        checkDiv.appendChild(label);
        objectsContent.appendChild(checkDiv);
  }
}

function updateParameterObjects() {
    var objectsContent = $$("objects-content");
    while (objectsContent.firstChild) {
      objectsContent.removeChild(objectsContent.firstChild);
    }
    loadObjectsCheckButtons();
    var parametersLinks = document.getElementsByClassName("parameter-link");
    var parameterTypes;
    for (var i = 0; i < parametersLinks.length; i++) {
        if(parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while(!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }
    parameterTypes[i].click();

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
    var typesDiv = $$("types");
    typesDiv.appendChild(parameterTypesContent);
}

function addOrRemoveTexture(event, texture) {
    var checkButton = event.currentTarget;
    var coloringRadio = $$("Coloring-coloring");
    var parameter = coloringRadio.name;
    var type = coloringRadio.value;
    if(checkButton.checked) {
        config["Parameters"][parameter]["Type"][type]["Textures"].push(texture);
    }
    else {
        var textureIndex = config["Parameters"][parameter]["Type"][type]["Textures"].indexOf(texture);
        config["Parameters"][parameter]["Type"][type]["Textures"].splice(textureIndex,1);
    }
}

function addOrRemoveObject(event, object) {
    var checkButton = event.currentTarget;
    var coloringRadio = $$("Coloring-coloring");
    var parameter = coloringRadio.name;
    var type = coloringRadio.value;
    if(checkButton.checked) {
        config["Parameters"][parameter]["Type"][type]["Objects"].push(object);
    }
    else {
        var objectIndex = config["Parameters"][parameter]["Type"][type]["Objects"].indexOf(object);
        config["Parameters"][parameter]["Type"][type]["Objects"].splice(objectIndex,1);
    }
    if(parameter == "Stitch") {
        if(checkButton.checked) {
            addObjectToStitch(type, object)
        }
        else {
            removeObjectFromStitch(type, object)
        }
    }
}

function changeTypeInfo(event, parameter, type) {
    event.preventDefault();
    var tablinks = document.getElementsByClassName(parameter + "-type-link");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    var nameField = $$("type-name");
    nameField.value = config["Parameters"][parameter]["Type"][type]["Text"];

    var typePrice = $$("type-price");
    typePrice.value = config["Parameters"][parameter]["Type"][type]["Price"];

    var visibilityButton = $$("name-is-invisibly");
    visibilityButton.checked = config["Parameters"][parameter]["Type"][type]["TextIsInvisibly"];
    event.currentTarget.className += " active";
    var coloringButtons = document.getElementsByClassName("coloring-button");
    for(var coloringButton of coloringButtons) {
        coloringButton.name = parameter;
        coloringButton.value = type;
    }

    var coloringRadio = $$(config["Parameters"][parameter]["Type"][type]["ColoringType"] + "-coloring");
    coloringRadio.click();
    changeObjectsInfo();
}


function changeObjectsInfo() {
    var objectsContent = $$("objects-content");

    var coloringRadio = $$("Coloring-coloring");

    var parameter = coloringRadio.name;
    var type = coloringRadio.value;

    var allObjects = config["Objects"];
    var objectsByType = config["Parameters"][parameter]["Type"][type]["Objects"];
    for(var object of allObjects) {
        var objectsCheckButton = $$(object + "-checkbox");
        if(objectsByType.indexOf(object) != -1) {
            objectsCheckButton.checked = true;
        }
        else {
            objectsCheckButton.checked = false;
        }
    }
}


function displayTypeColors() {
    var texturesContent = $$("textures-content");
    texturesContent.style.display = "none";
    var colorsContentsDiv = $$("colors-contents");
    colorsContentsDiv.style.display = "block";

    var coloringRadio = $$("Coloring-coloring");
    var parameter = coloringRadio.name;
    var type = coloringRadio.value;
    var colorsContents = document.getElementsByClassName("colors-content");
    for (var i = 0; i < colorsContents.length; i++) {
         colorsContents[i].style.display = "none";
    }

    var colorsContent = $$(parameter + "-" + type + "-colors");
    if(colorsContent == undefined) {
        loadColorsContent(parameter, type);
    }
    else {
        colorsContent.style.display = "block";
        var colorsByType = document.getElementsByClassName(parameter + "-" + type + "-color-link");
        if(colorsByType.length != 0) {
            colorsByType[0].click();
        }
    }
    config["Parameters"][parameter]["Type"][type]["ColoringType"] = "Coloring"
}

function displayTypeTextures() {
    var texturesContent = $$("textures-content");
    texturesContent.style.display = "block";

    var colorsContentsDiv = $$("colors-contents");
    colorsContentsDiv.style.display = "none";

    var coloringRadio = $$("Coloring-coloring");

    var parameter = coloringRadio.name;
    var type = coloringRadio.value;

    config["Parameters"][parameter]["Type"][type]["ColoringType"] = "Texturing";


    var allTextures = config["Texture"];
    var texturesByType = config["Parameters"][parameter]["Type"][type]["Textures"];
    for(var texture in allTextures) {
        var textureCheckButton = $$(texture + "-checkbox");
        if(texturesByType.indexOf(texture) != -1) {
            textureCheckButton.checked = true;
        }
        else {
            textureCheckButton.checked = false;
        }
    }
}

function hideTexturing() {
    var texturesContent = $$("textures-content");
    texturesContent.style.display = "none";

    var colorsContentsDiv = $$("colors-contents");
    colorsContentsDiv.style.display = "none";

    var coloringRadio = $$("Coloring-coloring");
    var parameter = coloringRadio.name;
    var type = coloringRadio.value;
    config["Parameters"][parameter]["Type"][type]["ColoringType"] = "Without";
}


function loadColorsContent(parameter, type) {
    var colors = config["Parameters"][parameter]["Type"][type]["Colors"];
    var colorsContentsDiv = $$("colors-contents");
    colorsContentsDiv.style.display = "block";
    var colorsDivByType = document.createElement("div");
    colorsDivByType.classList.add("colors-content");
    colorsDivByType.id = parameter + "-" + type + "-colors";

    var isFirst = true;
    for (var color of colors) {
        var entry = document.createElement("li");
        var entryLink = document.createElement("a");
        entryLink.setAttribute("href", "#");
        entryLink.classList.add("color-link");
        entryLink.classList.add(parameter + "-" + type + "-color-link");
        entryLink.setAttribute("onclick", "changeActiveColor(event, '" + parameter + "','" + type + "')");
        if (isFirst) {
            entryLink.className += " active"
            isFirst = false;
        }
        entry.appendChild(entryLink);
        colorsDivByType.appendChild(entry);
        entryLink.style.backgroundColor = color;
        entryLink.value = color;
    }
    colorsContentsDiv.appendChild(colorsDivByType);
    colorsDivByType.style.display = "block";
    var texturesContent = $$("textures-content");
    texturesContent.style.display = "none";
}




function changeParameterName(event) {
    if (event.keyCode == 13) {
        var tablinks = document.getElementsByClassName("parameter-link");
        var i = 0;
        while(!tablinks[i].className.endsWith("active")) {
            i += 1;
        }
        tablinks[i].childNodes[0].nodeValue = $$("parameter-name").value;
        config["Parameters"][tablinks[i].value]["Text"] = $$("parameter-name").value;
    }
}

function changeParameterVisibly(event) {
    var tablinks = document.getElementsByClassName("parameter-link");
    var i = 0;
    while(!tablinks[i].className.endsWith("active")) {
        i += 1;
    }
    config["Parameters"][tablinks[i].value]["Disabled"] = $$("param-is-disabled").checked;
}

function changePrice(priveInput) {
    var parametersLinks = document.getElementsByClassName("parameter-link");
    var parameterTypes;
    for (var i = 0; i < parametersLinks.length; i++) {
        if(parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while(!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }
    if(priveInput.value == "") {
        priveInput.value = 0;
        config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["Price"] = 0;
    }
    else {
        config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["Price"] = priveInput.value;
    }
}

function changeTypeNameVisibly(event) {
    var parametersLinks = document.getElementsByClassName("parameter-link");
    var parameterTypes;
    for (var i = 0; i < parametersLinks.length; i++) {
        if(parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while(!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }
    config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["TextIsInvisibly"] = $$("name-is-invisibly").checked;
}

function changeTypeName(event) {
    if (event.keyCode == 13) {
        var parametersLinks = document.getElementsByClassName("parameter-link");
        var parameterTypes;
        for (var i = 0; i < parametersLinks.length; i++) {
            if(parametersLinks[i].className.endsWith("active")) {
                parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
            }
        }

        var i = 0;
        while(!parameterTypes[i].className.endsWith("active")) {
            i += 1;
        }
        parameterTypes[i].childNodes[0].nodeValue = $$("type-name").value;
        config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["Text"] = $$("type-name").value;
        if(parameterTypes[i].parameter == "Stitch") {
            changeStitchName(parameterTypes[i].value, $$("type-name").value);
        }
    }
}


function addNewParameter(event) {
    var tablinks = $$("parameters");
    var entry = document.createElement("li");
    var entryLink = document.createElement("a");
    entryLink.setAttribute("href", "#");
    entryLink.classList.add("parameter-link");
    entryLink.className += " new-link";         //  затем удалить

    var currentParameterInd = config["Current parameter index"];
    var parameterName = "Parameter(" + currentParameterInd + ")";
    config["Current parameter index"] = currentParameterInd + 1;

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
    config["Parameters"][parameterName]["Type"] = {};
    entryLink.click();
    tablinks.scrollTop = tablinks.scrollHeight;
}

function addNewType(event) {
    var tablinks = $$("types");
    var entry = document.createElement("li");
    var entryLink = document.createElement("a");
    entryLink.setAttribute("href", "#");
    entryLink.classList.add("type-link");


    var currentTypeInd = config["Current type index"];
    var typeName = "Type(" + currentTypeInd + ")";
    config["Current type index"] = currentTypeInd + 1;
    entryLink.value = typeName;

    entryLink.appendChild(document.createTextNode(typeName));
    entry.appendChild(entryLink);

    var parametersLinks = document.getElementsByClassName("parameter-link");
    for (var i = 0; i < parametersLinks.length; i++) {
        if(parametersLinks[i].className.endsWith("active")) {
            entryLink.setAttribute("onclick", "changeTypeInfo(event, '" + parametersLinks[i].value + "','" + typeName + "')");
            entryLink.classList.add(parametersLinks[i].value + "-type-link");
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
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["Icon"] = config["Default icon"];
            config["Parameters"][parametersLinks[i].value]["Type"][typeName]["Active icon"] = config["Default active icon"];
            parametersLinks[i].className = parametersLinks[i].className.replace(" new-link", "");
            var parameterTypesContent = $$(parametersLinks[i].value + "-type-content");
            entryLink.parameter = parametersLinks[i].value;
            parameterTypesContent.appendChild(entry);
            if(parametersLinks[i].value == "Stitch") {
                createNewStitch(typeName);
            }
        }
    }


    entryLink.click();
    tablinks.scrollTop = tablinks.scrollHeight;
}


function removeParameter(event) {
    var parameters = $$("parameters");
    var tablinks = document.getElementsByClassName("parameter-link");
    var i = 0;
    while(!tablinks[i].className.endsWith("active")) {
       i += 1;
    }

    delete config["Parameters"][tablinks[i].value];

    var currentParameterInd = config["Current parameter index"];
    if (tablinks[i].value == "Parameter(" + (currentParameterInd - 1) + ")") {
      config["Current parameter index"] = currentParameterInd  - 1;
    }

    parameters.removeChild(tablinks[i].parentNode);

    if(i == tablinks.length && tablinks.length != 0)
    {
        tablinks[i-1].click();
    }
    else if(i < tablinks.length && tablinks.length != 0)
    {
        tablinks[i].click();
    }
}

function removeType(event) {
    var parametersLinks = document.getElementsByClassName("parameter-link");
    var parameterTypes;
    for (var i = 0; i < parametersLinks.length; i++) {
        if(parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while(!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }

    var parameter = parameterTypes[i].parameter;
    var type = parameterTypes[i].value;

    var currentTypeInd = config["Current type index"];
    if (type == "Type(" + (currentTypeInd - 1) + ")") {
      config["Current type index"] = currentTypeInd  - 1;
    }


    var parameterContent = $$(parameter + "-type-content");
    parameterContent.removeChild(parameterTypes[i].parentNode);

    if(i == parameterTypes.length && parameterTypes.length != 0)
    {
        parameterTypes[i-1].click();
    }
    else if(i < parameterTypes.length && parameterTypes.length != 0)
    {
        parameterTypes[i].click();
    }

    if(parameter == "Stitch") {
        removeStitchType(type);
    }
    delete config["Parameters"][parameter]["Type"][type];
}

function callTypePicker(event) {
    var colorPicker = $$("type-color-picker");
    colorPicker.click();
}

function addNewColorForType(color) {
    var parametersLinks = document.getElementsByClassName("parameter-link");
    var parameterTypes;
    for (var i = 0; i < parametersLinks.length; i++) {
        if(parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while(!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }

    var colorsDivByType = $$(parameterTypes[i].parameter + "-" + parameterTypes[i].value + "-colors");
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
    entryLink.click();
}


function changeActiveColor(event, parameter, type) {
    event.preventDefault();
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
        if(parametersLinks[i].className.endsWith("active")) {
            parameterTypes = document.getElementsByClassName(parametersLinks[i].value + "-type-link");
        }
    }

    var i = 0;
    while(!parameterTypes[i].className.endsWith("active")) {
        i += 1;
    }

    var colorsByType = document.getElementsByClassName(parameterTypes[i].parameter + "-" + parameterTypes[i].value + "-color-link");
    var j = 0;
    while (!colorsByType[j].className.endsWith("active")) {
          j++;
    }

    var colorsDivByType = $$(parameterTypes[i].parameter + "-" + parameterTypes[i].value + "-colors");
    var colorsArray = config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["Colors"];
    var colorIndex = colorsArray.indexOf(colorsByType[j].value);
    delete config["Parameters"][parameterTypes[i].parameter]["Type"][parameterTypes[i].value]["Colors"].splice(colorIndex, 1);
    colorsDivByType.removeChild(colorsByType[j].parentNode);

    if(j == colorsByType.length && colorsByType.length != 0)
    {
        colorsByType[j-1].click();
    }
    else if(j < colorsByType.length && colorsByType.length != 0)
    {
        colorsByType[j].click();
    }
}


function changeTextureNameInParameters(texture, name) {
    var texturesContent = $$("textures-content");
    var checkButton = $$(texture + "-checkbox");
    checkButton.parentNode.childNodes[1].nodeValue = name;
}

function $$(id) {
    return document.getElementById(id);
}
