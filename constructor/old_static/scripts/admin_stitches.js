"use strict"

function loadStitches() {
    config["LoadedMaps"] = {};
    config["RemovedMaps"] = [];
    var parametersDiv = $$("stitches");
    var isFirst = true;
    for (var stitch in config["Parameters"]["Stitch"]["Type"]) {
        var entry = document.createElement("li");
        var entryLink = document.createElement("a");
        entryLink.setAttribute("href", "#");
        entryLink.classList.add("stitch-link");
        entryLink.value = stitch;
        entryLink.id = stitch + "-stitch-link"
        entryLink.setAttribute("onclick", "changeStitchInfo(event, '" + stitch + "')");
        entryLink.appendChild(document.createTextNode(config["Parameters"]["Stitch"]["Type"][stitch]["Text"]));
        if (isFirst) {
            entryLink.click();
            isFirst = false;
        }
        entry.appendChild(entryLink);
        parametersDiv.appendChild(entry);
    }
}

function createNewStitch(type) {
    var parametersDiv = $$("stitches");
    var entry = document.createElement("li");
    var entryLink = document.createElement("a");
    entryLink.setAttribute("href", "#");
    entryLink.classList.add("stitch-link");
    entryLink.value = type;
    entryLink.id = type + "-stitch-link"
    entryLink.setAttribute("onclick", "changeStitchInfo(event, '" + type + "')");
    entryLink.appendChild(document.createTextNode(type));
    entry.appendChild(entryLink);
    parametersDiv.appendChild(entry);
    parametersDiv.scrollTop = parametersDiv.scrollHeight;
    entryLink.click();
}

function changeStitchInfo(event, stitchType) {
    event.preventDefault();
    var tablinks = document.getElementsByClassName("stitch-link");
    for (var i = 0; i < tablinks.length; i++) {
         tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    event.currentTarget.className += " active";
    var stithObjectsContents = document.getElementsByClassName("stitch-objects-content");
    for (var i = 0; i < stithObjectsContents.length; i++) {
         stithObjectsContents[i].style.display = "none";
    }

    var stitchObjectsContent = $$(stitchType + "-objects-content");
    if(stitchObjectsContent != undefined) {
        stitchObjectsContent.style.display = "block";
    }
    else {
        loadStitchObjectsContent(stitchType);
    }
    var firstObjectLink = document.getElementsByClassName(stitchType + "-object-link")[0];
    if(firstObjectLink != undefined) {
        firstObjectLink.click();
        $$("map-file-upload").disabled = false;
    }
    else {
        $$("map-file-upload").disabled = true;
        var mapImages = $$("map-img-div").children;
        for(var i = 0; i < mapImages.length; i++) {
          mapImages[i].style.display = "none";
        }
    }
}

function loadStitchObjectsContent(stitchType) {
    var objectsContent = document.createElement("div");
    objectsContent.classList.add("stitch-objects-content");
    objectsContent.id = stitchType + "-objects-content";
    var isFirst = true;
    for (var object of config["Parameters"]["Stitch"]["Type"][stitchType]["Objects"]) {
        var entry = document.createElement("li");
        var entryLink = document.createElement("a");
        entryLink.setAttribute("href", "#");
        entryLink.classList.add("object-link");
        entryLink.classList.add(stitchType + "-object-link");
        entryLink.setAttribute("onclick", "changeObjectInfo(event, '" + stitchType + "','" + object + "')");
        entryLink.stitch = stitchType;
        entryLink.value = stitchType;
        entryLink.name = object;
        entryLink.id = stitchType + "-" + object + "-link";
        if (isFirst) {
            entryLink.click();
            isFirst = false;
        }
        entry.appendChild(entryLink);
        objectsContent.appendChild(entry);
        entryLink.appendChild(document.createTextNode(object));
    }
    var stitchObjects = $$("stitch-objects");
    stitchObjects.appendChild(objectsContent);
}

function changeObjectInfo(event, stitchType, object) {
    event.preventDefault();
    var tablinks = document.getElementsByClassName(stitchType + "-object-link");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    event.currentTarget.className += " active";
    changeStitchMap(stitchType, object);
}

function changeStitchMap(stitchType, object) {
    var images = document.getElementsByClassName("map-img");
    for(var image of images) {
        image.style.display = "none";
        image.className = image.className.replace(" active", "");
    }

    var image = $$(stitchType + "-" + object + "-img");
    if (image == undefined) {
        var divForImg = $$("map-img-div");
        image = document.createElement("img");
        image.id = stitchType + "-" + object + "-img";
        image.classList.add("map-img");
        image.name = object;
        image.value = stitchType;
        var imgPath = config["Stitch folder"] +
                      config["Parameters"]["Stitch"]["Type"][stitchType]["File by object"][object];
        if (imgPath != undefined) {
            image.setAttribute('src', imgPath);
        }
        divForImg.appendChild(image);
        image.style.display = "block";
    }
    image.style.display = "block";
    image.classList.add("active");
}

function handleMapsFiles(files) {
     var reader = new FileReader();
     reader.onload = (function(file) {
          return function(event) {
              var images = document.getElementsByClassName("map-img");
              var i = 0;
              while (!images[i].className.endsWith("active"))
              {
                  i += 1;
              }
              images[i].setAttribute('src', event.target.result);
              images[i].style.display = "block";
              var stitchType = images[i].value;
              var object = images[i].name;

              if(config["LoadedMaps"].hasOwnProperty(stitchType)) {
                  if(!config["LoadedMaps"][stitchType].hasOwnProperty(object)) {
                     config["LoadedMaps"][stitchType][object] = {};
                  }
                  config["LoadedMaps"][stitchType][object]["Base64"] = event.target.result;
              }
              else {
                config["LoadedMaps"][stitchType] = {};
                config["LoadedMaps"][stitchType][object] = {};
                config["LoadedMaps"][stitchType][object]["Base64"] = event.target.result;
              }
          };
     })(files[0]);

    var image = reader.readAsDataURL(files[0]);
}


function addObjectToStitch(type, object) {
    var objectsContent = $$(type + "-objects-content");
    $$("map-file-upload").disabled = false;
    var entry = document.createElement("li");
    var entryLink = document.createElement("a");
    entryLink.setAttribute("href", "#");
    entryLink.classList.add("object-link");
    entryLink.classList.add(type + "-object-link");
    entryLink.setAttribute("onclick", "changeObjectInfo(event, '" + type + "','" + object + "')");
    entryLink.stitch = type;
    entryLink.value = type;
    entryLink.name = object;
    entryLink.id = type + "-" + object + "-link";
    entry.appendChild(entryLink);

    if(!config["Parameters"]["Stitch"]["Type"][type]["File by object"]) {
        config["Parameters"]["Stitch"]["Type"][type]["File by object"] = {};
    }
    config["Parameters"]["Stitch"]["Type"][type]["File by object"][object] = config["Default stitch map"];

    if(objectsContent != undefined) {
      objectsContent.appendChild(entry);
      entryLink.appendChild(document.createTextNode(object));
      var objectsLinks = document.getElementsByClassName(type + "-object-link");
      if(objectsContent.style.display != "none") {
          var stitchObjects = $$("stitch-objects");
          stitchObjects.scrollTop = stitchObjects.scrollHeight;
          entryLink.click();
      }
    }
}

function removeObjectFromStitch(type, object) {
    if(config["LoadedMaps"].hasOwnProperty(type) && config["LoadedMaps"][type].hasOwnProperty(object)) {
        delete config["LoadedMaps"][type][object];
    }
    else {
        var fileName = config["Parameters"]["Stitch"]["Type"][type]["File by object"][object];
        if(fileName != "Default stitch map") {
            config["RemovedMaps"].push(fileName);
        }
    }

    var objectsContent = $$(type + "-objects-content");
    if(objectsContent != undefined) {
      var objectsLinks = document.getElementsByClassName(type + "-object-link");
      var objectForRemoved = $$(type + "-" + object + "-link");

      var i = 0;
      while(!objectsLinks[i].className.endsWith("active")) {
          i += 1;
      }

      var activeObject = objectsLinks[i].name;

      var objectsContent = $$(type + "-objects-content");
      objectsContent.removeChild(objectForRemoved.parentNode);
      if(activeObject == object) {
          if(i == objectsLinks.length && objectsLinks.length != 0)
          {
              objectsLinks[i-1].click();
          }
          else if(i < objectsLinks.length && objectsLinks.length != 0)
          {
              objectsLinks[i].click();
          }
      }
      if(objectsLinks.length == 0) {
          $$("map-file-upload").disabled = true;
      }
      var removedObjImgMap = $$(type + "-" + object + "-img");
      if(removedObjImgMap != undefined) {
          $$("map-img-div").removeChild(removedObjImgMap);
      }
    }
}

function removeStitchType(type) {
    if(config["LoadedMaps"].hasOwnProperty(type)) {
        delete config["LoadedMaps"][type];
    }

    for (var object in config["Parameters"]["Stitch"]["Type"][type]["File by object"]) {
        var fileName = config["Parameters"]["Stitch"]["Type"][type]["File by object"][object];
        if(fileName != config["Default stitch map"]) {
              config["RemovedMaps"].push(fileName);
        }
    }

    var stitches = $$("stitches");
    var stitchByType = $$(type + "-stitch-link");
    var tablinks = document.getElementsByClassName("stitch-link");
    var i = 0;
    while(!tablinks[i].className.endsWith("active")) {
       i += 1;
    }

    var removedIsActive = (tablinks[i].value == type);

    stitches.removeChild(stitchByType.parentNode);

    var stitchObjectsContent = $$(type + "-objects-content");
    var stitchesDiv = $$("stitch-objects");
    if(stitchObjectsContent != undefined) {
        stitchesDiv.removeChild(stitchObjectsContent);
    }

    if(removedIsActive) {
        if(i == tablinks.length && tablinks.length != 0)
        {
            tablinks[i-1].click();
        }
        else if(i < tablinks.length && tablinks.length != 0)
        {
            tablinks[i].click();
        }
    }
}

function updateStitchObjects() {
    var stitchObjects = $$("stitch-objects");
    while (stitchObjects.firstChild) {
        stitchObjects.removeChild(stitchObjects.firstChild);
    }
    var stitchLinks = document.getElementsByClassName("stitch-link");
    for (var i = 0; i < stitchLinks.length; i++) {
        if(stitchLinks[i].className.endsWith("active")) {
            stitchLinks[i].click();
        }
    }
}

function changeStitchName(type, name) {
    var stitchByType = $$(type + "-stitch-link");
    stitchByType.childNodes[0].nodeValue = name;
}
