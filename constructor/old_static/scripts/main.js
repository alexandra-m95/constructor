"use strict";

var config; // объект, отражающий содержимое конфигурационного файла customization.json
var currentState; // объект, содержащий в себе выбранные пользователем варианты конфигурации
// повторяет структуру config["Defaults"]
// Может быть использовано для последующей пересылки и обработки в нетронутом виде.
var productNumber;

/** Считывание конфигурационного файла в переменную config, а также присваивание конфигураций
* по-умолчанию в переменную currentState.  Вызов методов инициализации конструктора,
* его запуска, а также динамического формирования html-документа.
* В случае ошибки(например, конфигурационный файл недоступен или не является корректным
* json'ом), скрипт прекратит работу.
*/
loadJSON("static/customization.json", function (loadedJSON) {
    try {
        config = JSON.parse(loadedJSON);
    } catch (err) {
        console.log("Error: ", err);
        stopScript();
    }

    try {
        fillCurrentState();
        Constructor.init($$("render-canvas"), config); // Создание движка и загрузка дефолтных параметров
        Constructor.run(); // Запуск движка BabylonJS и прогрузка сцены
        loadParameters();
    //    loadStitches();
    } catch (err) {
        console.log("Error: ", err);
        stopScript();
    }
}, function () {
    console.log("Error: ", xobj.statusText);
    stopScript();
});

function fillCurrentState() {
  currentState = {};
  for (var parameter in config["Parameters"]) {
      if (Object.keys(config["Parameters"][parameter]["Type"]).length != 0) {
          var firstType = Object.keys(config["Parameters"][parameter]["Type"])[0];
          if (!currentState.hasOwnProperty(parameter)) {
              currentState[parameter] = {};
          }
          currentState[parameter]["Type"] = firstType;
      }
  }
}

/** Динамическое формирование областей с заголовками параметров конфигурации.
* Вызывается метод формирования типов для каждого параметра.
*/
function loadParameters() {
    var format = $$("format");
    if(config["Parameters"].hasOwnProperty("Format") && config["Parameters"]["Format"]["Type"].length != 0) {
        var firstType = Object.keys(config["Parameters"]["Format"]["Type"])[0];
        format.childNodes[0].nodeValue = firstType;
    }


    productNumber = $$("edition-field").value;
    var price = $$("price");
    price.childNodes[0].nodeValue = parseInt(config["Base price"]) * productNumber;
    var parametersDiv = $$("parameters-case");
    for (var parameter in config["Parameters"]) {
        if (!config["Parameters"][parameter]["Disabled"]) {
            var parameterDiv = document.createElement("div");
            parameterDiv.classList.add("parameter");
            var label = document.createElement("label");
            label.appendChild(document.createTextNode(config["Parameters"][parameter]["Text"] + ":"));
            label.classList.add("parameter-header");
            parameterDiv.appendChild(label);
            loadParameterTypes(parameter, parameterDiv);
            parametersDiv.appendChild(parameterDiv);
        }
    }
}

/** Динамическое формирование вариантов конфигурации выбранного параметра.
* Вариант конфигурации представляет собой иконку с заголовком. В случае если
* для параметра может быть изменен цвет или текстура, в область параметра добавляется
* соотвествующая иконка.
*/
function loadParameterTypes(parameter, parameterDiv) {
    var parameterTypes = config["Parameters"][parameter]["Type"];
    var iconsFolder = config["Icon folder"];
    var isFirst = true;
    for (var type in parameterTypes) {
        var typeDiv = document.createElement("div");
        var label = document.createElement("label");
        if (!parameterTypes[type]["TextIsInvisibly"]) {
            label.appendChild(document.createTextNode(parameterTypes[type]["Text"]));
        }
        label.classList.add("type-label");
        typeDiv.appendChild(label);
        typeDiv.classList.add("type");
        typeDiv.classList.add(parameter + "-type");
        var iconPath = iconsFolder + config["Parameters"][parameter]["Type"][type]["Icon"];
        var activeIconPath = iconsFolder + config["Parameters"][parameter]["Type"][type]["Active icon"];
        typeDiv.style.backgroundImage = "url(" + iconPath + "), url(" + activeIconPath + ")";

        typeDiv.name = parameter;
        typeDiv.value = type;
        if(isFirst) {
            changeTypeIcons(typeDiv);
            isFirst = false;
        }
        if (config["Parameters"][parameter]["Type"][type]["ColoringType"] == "Texturing") {
            typeDiv.setAttribute("onclick", "showTexturingDialog(event)");
        } else if (config["Parameters"][parameter]["Type"][type]["ColoringType"] == "Coloring") {
            typeDiv.setAttribute("onclick", "showColoringDialog(event)");
        } else {
            typeDiv.setAttribute("onclick", "changeParameterType(this)");
        }
        parameterDiv.appendChild(typeDiv);
    }
}


function changeTypeIcons(typeDiv) {
  var iconsFolder = config["Icon folder"];
  var parameter = typeDiv.name;
  var type = typeDiv.value;
  var iconPath = iconsFolder + config["Parameters"][parameter]["Type"][type]["Active icon"];

  var price = $$("price");
  var newPrice = parseInt(price.childNodes[0].nodeValue);
  var parameterTypes = document.getElementsByClassName(parameter + "-type");
  for (var i = 0; i < parameterTypes.length; i++) {
      if (parameterTypes[i].className.endsWith("active")) {
          newPrice = newPrice - config["Parameters"][parameter]["Type"][parameterTypes[i].value]["Price"] * productNumber;
          parameterTypes[i].className = parameterTypes[i].className.replace(" active", "");
          var oldIconPath = iconsFolder + config["Parameters"][parameterTypes[i].name]["Type"][parameterTypes[i].value]["Icon"];
          parameterTypes[i].style.backgroundSize = "70% auto, 0%";
      }
  }

  typeDiv.className += " active";
  typeDiv.style.backgroundSize = "0% auto, 70%";
  currentState[parameter]["Type"] = type;
  newPrice = newPrice + config["Parameters"][parameter]["Type"][type]["Price"] * productNumber;
  price.childNodes[0].nodeValue = newPrice;
  if (parameter == "Format") {
      var format = $$("format");
      format.childNodes[0].nodeValue = type;
  }
}
/** Функция, срабатывающая на клик по иконке с вариантом конфигурации.
* Влечёт за собой изменения на отображаемой модели и в объекте с текущим состоянием конфигурации
*/
function changeParameterType(typeDiv) {
    var parameter = typeDiv.name;
    var type = typeDiv.value;
    Constructor.changeModelObject(parameter, type, currentState[parameter]["Type"]);
    changeTypeIcons(typeDiv);
}

/** Отображение диалогового окна для выбора текстуры. Если для данного параметра
* уже раньше открывалось диалоговое окно, то будет отображено старое содержимое.
* Если же нет, то создается новое. Первый цвет и первая текстура становятся
* автоматически выбранными в самом начале.
*/
function showTexturingDialog(event) {
    var typeDiv = event.currentTarget;
    var parameter = typeDiv.name;
    var type = typeDiv.value;

    changeParameterType(typeDiv);
    var modal = $$('modal');
    modal.style.display = "block";

    var close = $$("close");
    close.name = parameter;
    close.value = type;

    var select = $$("select");
    select.setAttribute("onclick", "selectTexture()");

    var parameter = typeDiv.name;
    var type = typeDiv.value;

    var dialogContent = $$(parameter + type + "-dialog-content");
    if (typeof dialogContent === "undefined" || dialogContent === null) {
        dialogContent = loadDialogContent(parameter, type);
    }
    dialogContent.style.display = "block";
    var colorDivs = $$(parameter + type + "-colors").childNodes;
    if (colorDivs.length != 0) {
        colorDivs[0].click();
        var color = colorDivs[0].value;
        var textureDivs = $$(parameter + type + color + "-textures").childNodes;
        if (textureDivs.length != 0) {
            textureDivs[0].click();
            Constructor.changeTexture(parameter, type, textureDivs[0].name);
        }
    }
}

/** Отображение диалогового окна для выбора цвета. Если для данного параметра
* уже раньше открывалось диалоговое окно, то будет отображено старое содержимое.
* Если же нет, то создается новое. Первый цвет становится автоматически выбранным
* в самом начале.
*/
function showColoringDialog(event) {
    var typeDiv = event.currentTarget;
    var parameter = typeDiv.name;
    var type = typeDiv.value;
    changeParameterType(typeDiv);
    var modal = $$('modal');
    modal.style.display = "block";

    var close = $$("close");
    close.name = parameter;
    close.value = type;

    var select = $$("select");
    select.setAttribute("onclick", "selectColor()");

    var parameter = typeDiv.name;
    var type = typeDiv.value;

    var dialogContent = $$(parameter + type + "-dialog-content");
    if (typeof dialogContent === "undefined" || dialogContent === null) {
        dialogContent = loadColoringContent(parameter, type);
    }
    dialogContent.style.display = "block";
    var colorDivs = $$(parameter + type + "-colors").childNodes;
    if (colorDivs.length != 0) {
        colorDivs[0].click();
        Constructor.changeColor(parameter, type, colorDivs[0].value);
    }
}

/** Формирование цветов в области диалогового окна для выбора цвета. */
function loadColoringContent(parameter, type) {
    var modalContent = $$("colors-and-textures");
    var paramDialogContent = document.createElement("div");
    paramDialogContent.id = parameter + type + "-dialog-content";
    var label = document.createElement("label");
    label.id = "modal-label";
    label.appendChild(document.createTextNode("Выберите цвет:"));
    var colorsDiv = document.createElement("div");
    colorsDiv.id = parameter + type + "-colors";
    colorsDiv.classList.add("modal-colors");
    var colors = config["Parameters"][parameter]["Type"][type]["Colors"];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = colors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var color = _step.value;

            var colorDiv = document.createElement("div");
            colorDiv.classList.add("modal-color");
            colorDiv.style.backgroundColor = color;
            colorDiv.value = color;
            colorsDiv.appendChild(colorDiv);
            colorDiv.setAttribute("onclick", "changeColor(event,'" + parameter + "','" + type + "')");
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

    paramDialogContent.appendChild(label);
    paramDialogContent.appendChild(colorsDiv);
    modalContent.appendChild(paramDialogContent);
    return paramDialogContent;
}

/** Вызывается в случае изменения цвета в диалоговом окне выбора цвета. */
function changeColor(event, parameter, type) {
    var colorsDiv = $$(parameter + type + "-colors").childNodes;
    for (var i = 0; i < colorsDiv.length; i++) {
        if (colorsDiv[i].className.endsWith("active")) {
            colorsDiv[i].className = colorsDiv[i].className.replace(" active", "");
        }
    }
    event.currentTarget.className += " active";
    var select = $$("select");
    select.name = parameter;
    select.parameterType = type;
    select.value = event.currentTarget.value;
}

/** Формирование цветов в области диалогового окна для выбора текстуры. */
function loadDialogContent(parameter, type) {
    var modalContent = $$("colors-and-textures");
    var paramDialogContent = document.createElement("div");
    paramDialogContent.id = parameter + type + "-dialog-content";
    var label = document.createElement("label");
    label.id = "modal-label";
    label.appendChild(document.createTextNode("Выберите цвет и текстуру материала:"));
    var colorsDiv = document.createElement("div");
    colorsDiv.id = parameter + type + "-colors";
    colorsDiv.classList.add("modal-colors");
    var colors = config["TexturesByColor"];
    var paramTextures = config["Parameters"][parameter]["Type"][type]["Textures"];
    for (var color in colors) {
        var texturesByColor = config["TexturesByColor"][color];
        var hasTextureByColor = false;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = texturesByColor[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var textureByColor = _step2.value;

                if (paramTextures.indexOf(textureByColor) != -1) {
                    hasTextureByColor = true;
                }
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

        if (hasTextureByColor) {
            var colorDiv = document.createElement("div");
            colorDiv.classList.add("modal-color");
            colorDiv.style.backgroundColor = color;
            colorDiv.value = color;
            colorsDiv.appendChild(colorDiv);
            colorDiv.setAttribute("onclick", "showTextures(event,'" + parameter + "','" + type + "')");
        }
    }

    paramDialogContent.appendChild(label);
    paramDialogContent.appendChild(colorsDiv);
    modalContent.appendChild(paramDialogContent);
    return paramDialogContent;
}

/** Формирование цветов в области диалогового окна. */
function showTextures(event, parameter, type) {
    var colorsDiv = $$(parameter + type + "-colors").childNodes;
    for (var i = 0; i < colorsDiv.length; i++) {
        if (colorsDiv[i].className.endsWith("active")) {
            colorsDiv[i].className = colorsDiv[i].className.replace(" active", "");
        }
    }
    event.currentTarget.className += " active";

    var color = event.currentTarget.value;
    var textureDivs = document.getElementsByClassName("textures-div");

    for (var i = 0; i < textureDivs.length; i++) {
        textureDivs[i].style.display = "none";
    }

    var texturesDiv = $$(parameter + type + color + "-textures");
    if (typeof texturesDiv === "undefined" || texturesDiv === null) {
        texturesDiv = loadTextures(parameter, type, color);
    }
    texturesDiv.style.display = "block";
    if (texturesDiv.childNodes.length != 0) {
        texturesDiv.childNodes[0].click();
    }
}

/** Вызывается в случае изменения цвета в диалоговом окне выбора текустуры.
Происходит изменение набора текстур, которые доступны для выбора(в соотвествии
с цветом).*/
function loadTextures(parameter, type, color) {
    var dialogContent = $$(parameter + type + "-dialog-content");
    var texturesDiv = document.createElement("div");
    texturesDiv.id = parameter + type + color + "-textures";
    texturesDiv.classList.add("textures-div");
    var parameterTextures = config["Parameters"][parameter]["Type"][type]["Textures"];
    var texturesByColor = config["TexturesByColor"][color];

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = parameterTextures[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var texture = _step3.value;

            if (texturesByColor.indexOf(texture) != -1) {
                var textureDiv = document.createElement("div");
                textureDiv.classList.add("texture-div");
                textureDiv.name = texture;
                textureDiv.setAttribute("onclick", "changeTexture(event, '" + parameter + "','" + type + "','" + color + "')");
                var texturePath = config["Texture folder"] + config["Texture"][texture]["Texture filename"];
                textureDiv.style.backgroundImage = "url('" + texturePath + "')";
                textureDiv.setAttribute("title", texture);
                texturesDiv.appendChild(textureDiv);
            }
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

    dialogContent.appendChild(texturesDiv);
    return texturesDiv;
}

/** Вызывается в случае изменения текстуры в диалоговом окне выбора текустуры. */
function changeTexture(event, parameter, type, color) {
    var textureDivs = $$(parameter + type + color + "-textures").childNodes;
    for (var i = 0; i < textureDivs.length; i++) {
        if (textureDivs[i].className.endsWith("active")) {
            textureDivs[i].className = textureDivs[i].className.replace(" active", "");
        }
    }
    event.currentTarget.className += " active";
    var selectButton = $$("select");
    select.name = parameter;
    select.parameterType = type;
    select.value = event.currentTarget.name;
}

/** Обработчик нажатия на кнопку "Выбрать" в диалоговом окне изменения текустуры. Вызовается метод для изменении
текстуры на модели. */
function selectTexture(selectButton) {
    closeDialog();
    var selectButton = $$("select");
    var parameter = selectButton.name;
    var type = selectButton.parameterType;
    var texture = selectButton.value;
    Constructor.changeTexture(parameter, type, texture);
    currentState[parameter]["Texture"] = texture;
}

/** Обработчик нажатия на кнопку "Выбрать" в диалоговом окне изменения цвета. Вызовается метод для изменении
цвета какой-либо части модели. */
function selectColor(selectButton) {
    closeDialog();
    var selectButton = $$("select");
    var parameter = selectButton.name;
    var type = selectButton.parameterType;
    var color = selectButton.value;
    Constructor.changeColor(parameter, type, color);
    currentState[parameter]["Color"] = color;
}

/** Обработчик нажатия на кнопку  "Х" в диалоговом окне.*/
function closeDialog() {
    var close = $$("close");
    var parameter = close.name;
    var type = close.value;
    var dialogContent = $$(parameter + type + "-dialog-content");
    dialogContent.style.display = "none";
    var modal = $$('modal');
    modal.style.display = "none";
}

/** Обработчик переключений шагов.*/
function changeStep(stepDiv) {
    var stepDivs = document.getElementsByClassName("step");
    for (var i = 0; i < stepDivs.length; i++) {
        if (stepDivs[i].className.endsWith("active")) {
            stepDivs[i].className = stepDivs[i].className.replace(" active", "");
        }
    }
    stepDiv.className += " active";
}

function changePrice() {
    var price = $$("price");
    var priceValue = parseInt(price.childNodes[0].nodeValue);
    priceValue = priceValue / productNumber;
    priceValue = priceValue * parseInt($$("edition-field").value);
    productNumber = parseInt($$("edition-field").value);
    price.childNodes[0].nodeValue = priceValue;
}

/** Событие, срабатываемое при нажатии на области, которая находится вне диалогового окна.
Влечет за собой его закрытие.*/
window.onclick = function (event) {
    var modal = $$('modal');
    if (event.target == modal) {
        closeDialog();
    }
};

/** Добавление классу String метода endWith(проверка, входит ли в конец строки
подстрока-параметр). */
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function $$(id) {
    return document.getElementById(id);
};
