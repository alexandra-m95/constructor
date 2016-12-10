"use strict"
var scene;

function loadCommon() {
    scene = {}
    var basePrice = $$("base-price");
    basePrice.value = config["Base price"];
    $$("scene-objects").value = config["Objects"].join(", ");
}

function changeBasePrice(priceInput) {
    var basePrice = $$("base-price")
    if(basePrice.value == "") {
        basePrice.value = 0;
        config["Base price"] = 0;
    }
    else {
        config["Base price"] = basePrice.value;
    }
}

function handleSceneFile(files) {
  var reader = new FileReader();
  reader.onload = (function(file) {
       return function(event) {
           try {
              scene = JSON.parse(event.target.result);
              var loadedObjects = [];
              if(scene.hasOwnProperty("meshes")) {              // проверить еще лучше
                  for(var objectData of scene["meshes"]) {
                    loadedObjects.push(objectData["name"]);
                }
                var objectsIndsForRemove = [];
                for(var parameter in config["Parameters"]) {
                    for(var type in config["Parameters"][parameter]["Type"]) {
                        var objectsByType = config["Parameters"][parameter]["Type"][type]["Objects"];
                        objectsByType = objectsByType.filter(function(element) {
                            return loadedObjects.indexOf(element) != -1
                        });
                        config["Parameters"][parameter]["Type"][type]["Objects"] = objectsByType;
                    }
                }
                var filesByObjectsInd = [];
                for(var stitch in config["Parameters"]["Stitch"]["Type"]) {
                    var objectsStitches = config["Parameters"]["Stitch"]["Type"][stitch]["File by object"];
                    for(var object in objectsStitches) {
                        if(loadedObjects.indexOf(object) == -1) {
                           delete config["Parameters"]["Stitch"]["Type"][stitch]["File by object"][object];
                        }
                    }
                }

                config["Objects"] = loadedObjects;
                var objectsStr = "";
                for(var i = 0; i < loadedObjects.length; i++) {
                    objectsStr += loadedObjects[i];
                    if(i != loadedObjects.length - 1) {
                        objectsStr += ", ";
                    }
                }
                $$("scene-objects").value = objectsStr;
                updateParameterObjects();
                updateStitchObjects();
              }
           }
           catch(err) {
              alert("Не удалось обработать файл. ")
           }
       };
  })(files[0]);

  reader.readAsText(files[0]);
}

$(document).on('click', '#submit-button', function(e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/save_settings",
        headers: {
          'Cache-Control': 'no-cache',
          'Expires': '0'
        },
        data: JSON.stringify({ config: config, scene: scene }),
        contentType: 'application/json',
        success: function(response) {
            if (response == "error") {
                  console("Произошла ошибка во время обработки данных.");
             }
            else {
                  alert("Настройки успешно сохранены.");
            }
        }
    });
});
