"use strict";

var Constructor = function () {
    var publicMethods = {};

    var config; // объект, отражающий содержимое конфигурационного файла customization.json
    var canvas; // элемент html-документа, отображающий сцену.
    var engine; // ядро трехмерной обработки BABYLON
    var scene;
    var camera1;
    var camera2;
    var outputplane;
    var circle;

    /** Сокрытие старого объекта, соотвествующего предыдущему активному варианту конфигурации
    параметра, а также отображение объекта, соотвествующего новому варианту(например, сокрытие
    круглых углов ежедневника и отображение квадратных).
    */
    function changeMesh(parameter, oldParameterType, newParameterType) {
        if (oldParameterType != null) {
            var oldObjectsNames = config["Parameters"][parameter]["Type"][oldParameterType]["Objects"];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = oldObjectsNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var oldObjectName = _step.value;

                    var oldObjectMesh = scene.getMeshByName(oldObjectName);
                    if (oldObjectMesh !== null) {
                        oldObjectMesh.isVisible = false;
                    }
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

        var newObjectsNames = config["Parameters"][parameter]["Type"][newParameterType]["Objects"];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = newObjectsNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var newObjectName = _step2.value;

                var newObjectMesh = scene.getMeshByName(newObjectName);
                if (newObjectMesh !== null) {
                    newObjectMesh.isVisible = true;
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
    }

    var meshModificators = {
        "CoverMaterial": {
            "Type": function Type(oldSpiralType, spiralType) {
                // ...
            },
            "Texture": function Texture(textureType) {
                var texturePath = config["Texture folder"] + config["Texture"][textureType]["Texture filename"];
                var texture = new BABYLON.Texture(texturePath, scene);
                var objectsNames = config["Parameters"]["Stitch"]["Type"]["WithoutStitch"]["File by object"];

                for (var objectName in objectsNames) {
                    var mesh = scene.getMeshByName(objectName);
                    if (mesh.material.diffuseTexture1) {
                        mesh.material.diffuseTexture1.dispose();
                    }
                    if (mesh.material.diffuseTexture3) {
                        mesh.material.diffuseTexture3.dispose();
                    }
                    mesh.material.diffuseTexture1 = texture;
                    mesh.material.diffuseTexture3 = texture;
                }
            }
        },
        "Corners": {
            "Type": function Type(oldCornerType, cornerType) {
                changeMesh("Corners", oldCornerType, cornerType);
            }
        },
        "Spiral": {
            "Type": function Type(oldSpiralType, spiralType) {
                changeMesh("Spiral", oldSpiralType, spiralType);
            }
        },
        "Stitch": {
            "Type": function Type(_, stitchType) {
                var mapFolder = config["Stitch folder"] + config["Parameters"]["Stitch"]["Type"][stitchType]["Folder"];
                var objectNames = config["Parameters"]["Stitch"]["Type"][stitchType]["File by object"];

                for (var objectName in objectNames) {
                    var fileName = config["Parameters"]["Stitch"]["Type"][stitchType]["File by object"][objectName];
                    var map = new BABYLON.Texture(mapFolder + fileName, scene);

                    var mesh = scene.getMeshByName(objectName);
                    if (mesh.material.mixTexture) {
                        mesh.material.mixTexture.dispose();
                    }

                    mesh.material.mixTexture = map;
                }
            },
            "Texture": function Texture(textureType, colorStr) {
                var texturePath = config["Texture folder"] + config["Texture"][textureType]["Texture filename"];;
                var texture = new BABYLON.Texture(texturePath, scene);
                var objectsNames = config["Parameters"]["Stitch"]["Type"]["WithoutStitch"]["File by object"];

                for (var objectName in objectsNames) {
                    var mesh = scene.getMeshByName(objectName);
                    if (mesh.material.diffuseTexture2) {
                        mesh.material.diffuseTexture2.dispose();
                    }
                    mesh.material.diffuseTexture2 = texture;
                }
            }
        },

        /* Прошивка обычно представлена множеством сфер, а не одним объектом(в результате работы экспортера
        * из blender в babylon). В соотвествии с форматом именования(Threads1, Threads2, ....),
        * после фильтрации происходит получение нужных объетов и включение/выключение их видимости.
        */
        "Threads": {
            "Type": function Type(oldThreadsType, threadsType) {
                changeMesh("Threads", oldThreadsType, threadsType);
            },
            "Color": function Color(colorStr) {
                var material = scene.getMaterialByID("dailybook.ThreadsMaterial");
                var color = new BABYLON.Color3.FromHexString(colorStr);
                material.diffuseColor = color;
            }
        },

        "Clasp": {
            "Type": function Type(oldClaspType, claspType) {
                changeMesh("Clasp", oldClaspType, claspType);
            }
        },
        "Button": {
            "Type": function Type(oldbuttonType, buttonType) {
                changeMesh("Button", oldCornerType, cornerType);
            }
        },
        "ElasticBand": {
            "Type": function Type(oldElasticBandType, elasticBandType) {
                changeMesh("ElasticBand", oldElasticBandType, elasticBandType);
            },
            "Color": function Color(colorStr) {
                var material = scene.getMaterialByID("dailybook.BinderMaterial");
                var color = new BABYLON.Color3.FromHexString(colorStr);
                material.diffuseColor = color;
            }
        },
        "Personalization": {
            "Type": function Type(oldPersonalizationType, personalizationType) {
                changeMesh("Personalization", oldPersonalizationType, personalizationType);
            }
        },
        "Format": {
            "Type": function Type(oldFormatType, formatType) {
                // ....
            }
        },
        "CoverType": function CoverType(oldCoverType, coverType) {
            // ...
        },
        "MaterialThickness": function MaterialThickness(oldThicknessType, thicknessType) {
            // ...
        },
        "Lettering": function Lettering(oldLetteringType, letteringType) {
            // ...
        },
        "ElasticBandPrint": function ElasticBandPrint(oldPringType, printType) {
            // ...
        },
        "Schild": function Schild(oldSchildType, schildType) {
            // ...
        }
    };

    /* Создание: 1) камеры которая будет вращаться вокруг ежедневника, указание её местоположения,
    * 2) света для всей сцены,
    * 3) мульти-текстурного материала для каждого из объектов, которые будут изменять свой внешний вид
    * в процессе изменения текстур и сшивок.
    * 4) Материала черного цвета для резинки.
    * Получение значений параметров, которые должны быть установлены по умолчанию и вызов
    * методов для изменения внешнего вида ежедневника в соответствии с этими значениями.
    */
    function loadDefaults() {
        camera1 = new BABYLON.ArcRotateCamera("camera1", 10, 1, 40, BABYLON.Vector3.Zero(), scene);
        camera2 = new BABYLON.ArcRotateCamera("camera2", 10, 1, 40, BABYLON.Vector3.Zero(), scene);

        camera1.lowerRadiusLimit = 25;
        camera1.upperRadiusLimit = 50;
        camera2.lowerRadiusLimit = 25;
        camera2.upperRadiusLimit = 50;
        camera2.lowerAlphaLimit = 17.3;
        camera2.upperAlphaLimit = 17.3;
        camera2.layerMask = 0x20000000;

        scene.activeCameras.push(camera1);
        scene.activeCameras.push(camera2);

        var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
        light.groundColor = new BABYLON.Color3(1, 1, 1);
        scene.clearColor = BABYLON.Color3.FromHexString("#FFFFFF");

        //    var circle = BABYLON.Mesh.CreateCylinder("cylinder", 0.00001, 1, 1, 32, 1, scene, false);
        //      var blueWireframeMaterial = new BABYLON.StandardMaterial("blueWireframeMaterial", scene);
        //	      blueWireframeMaterial.emissiveColor = BABYLON.Color3.Blue();
        //        circle.material = blueWireframeMaterial;
        //        circle.position = new BABYLON.Vector3(0,-11,0);
        //        circle.scaling = new BABYLON.Vector3(20,20,20);
        //        blueWireframeMaterial.wireframe = true;

        var radius = 10;
        var tes = 60;
        var pi2 = Math.PI * 2;
        var step = pi2 / tes;
        var path = [];
        for (var i = 0; i < pi2; i += step) {
            var x = radius * Math.sin(i);
            var z = radius * Math.cos(i);
            var y = 0;
            path.push(new BABYLON.Vector3(x, y, z));
        }
        path.push(path[0]);

        circle = BABYLON.Mesh.CreateLines("circle", path, scene);
        circle.position = new BABYLON.Vector3(0, -11, 0);
        circle.color = new BABYLON.Color3(0.6, 0.6, 0.6);

        //    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 5, scene);
        //    sphere.position = new BABYLON.Vector3(5,-11,8);
        //    sphere.material = new BABYLON.StandardMaterial("light", scene);
        //      sphere.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
        //      sphere.layerMask = 0x20000000;

        //data reporter
        outputplane = BABYLON.Mesh.CreatePlane("outputplane", 5, scene, false);
        outputplane.material = new BABYLON.StandardMaterial("outputplane", scene);
        outputplane.position = new BABYLON.Vector3(0, -11.5, -10);
        //    outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_X;
        outputplane.scaling.y = 0.3;
        outputplane.scaling.x = 0.7;

        var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, false);

        outputplane.material.diffuseTexture = outputplaneTexture;

        outputplaneTexture.drawText("360 °", null, 150, "bold 19em sans-serif", "#999999", "white");
        outputplane.material.diffuseTexture.hasAlpha = true;
        outputplane.layerMask = 0x20000000;
        outputplane.material.backFaceCulling = false;

        var rightMainMaterial = new BABYLON.TerrainMaterial("RightMainMaterial", scene);
        var leftMainMaterial = new BABYLON.TerrainMaterial("LeftMainMaterial", scene);
        var roundCornersMaterial = new BABYLON.TerrainMaterial("RoundCornersMaterial", scene);
        var squareCornersMaterial = new BABYLON.TerrainMaterial("SquareCornersMaterial", scene);
        var defaultBinderMaterial = new BABYLON.TerrainMaterial("DefaultBinderMaterial", scene);

        var mesh = scene.getMeshByName("RightMainCover");
        mesh.material = rightMainMaterial;
        mesh = scene.getMeshByName("LeftMainCover");
        mesh.material = leftMainMaterial;
        mesh = scene.getMeshByName("DefaultBinder");
        mesh.material = defaultBinderMaterial;
        mesh = scene.getMeshByName("SquareCornersCover");
        mesh.material = squareCornersMaterial;
        mesh = scene.getMeshByName("RoundCornersCover");
        mesh.material = roundCornersMaterial;

        var material = scene.getMaterialByID("dailybook.BinderMaterial");
        material.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        var material = scene.getMaterialByID("dailybook.SpiralMaterial");
        material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);

        // !! Необходимо раскомментировать когда будут готовы недостающие элементы модели !!
        // !! Перед конвертированием необходимо в Blender скрыть все элементы, которые могут изменяться
        var defaultCorners = config["Defaults"]["Corners"]["Type"];
        var defaultSpiral = config["Defaults"]["Spiral"]["Type"];
        var defaultStitch = config["Defaults"]["Stitch"]["Type"];
        // var defaultClasp = config["Defaults"]["Clasp"]["Type"];
        // var defaultButton = config["Defaults"]["Button"]["Type"];
        var defaultElasticBand = config["Defaults"]["ElasticBand"]["Type"];
        var defaultCoverMaterial = config["Defaults"]["CoverMaterial"]["Type"];
        var defaultTexture = config["Defaults"]["CoverMaterial"]["Texture"];
        var defaultColor = config["Defaults"]["CoverMaterial"]["Color"];
        var defaultBandColor = config["Defaults"]["ElasticBand"]["Color"];
        var defaultThreadsColor = config["Defaults"]["Threads"]["Color"];
        var defaultStitchTexture = config["Defaults"]["Stitch"]["Texture"];
        var defaultStitchColor = config["Defaults"]["Stitch"]["Color"];
        var defaultThreads = config["Defaults"]["Threads"]["Type"];
        // var defaultPersonalization = config["Defaults"]["Personalization"]["Type"];

        meshModificators["Corners"]["Type"](null, defaultCorners);
        meshModificators["Spiral"]["Type"](null, defaultSpiral);
        meshModificators["Stitch"]["Type"](null, defaultStitch);
        // meshModificators["Clasp"](null, defaultClasp);
        // meshModificators["Button"](null, defaultButton);
        meshModificators["ElasticBand"]["Type"](null, defaultElasticBand);
        meshModificators["Threads"]["Type"](null, defaultThreads);
        meshModificators["CoverMaterial"]["Texture"](defaultTexture, defaultColor);
        meshModificators["ElasticBand"]["Color"](defaultBandColor);
        meshModificators["Threads"]["Color"](defaultThreadsColor);
        meshModificators["Stitch"]["Texture"](defaultStitchTexture, defaultStitchColor);
        // meshModificators["Personalization"](null, defaultPersonalization);
    }

    publicMethods.init = function (renderCanvas, jsonConfig) {
        canvas = renderCanvas;
        engine = new BABYLON.Engine(renderCanvas, true);
        config = jsonConfig;
    };

    publicMethods.run = function () {
        BABYLON.SceneLoader.Load(config["Scene folder"], config["Scene filename"], engine, function (newScene) {
            scene = newScene;
            scene.registerBeforeRender(function () {
                outputplane.lookAt(camera2.position);

                if (camera1.position.y >= -8 && camera1.position.y <= -3) {
                    circle.alpha = (8 + camera1.position.y) / 5;
                    outputplane.material.alpha = (8 + camera1.position.y) / 5;
                } else if (camera1.position.y >= 22 && camera1.position.y <= 33) {
                    circle.alpha = (33 - camera1.position.y) / 11;
                    outputplane.material.alpha = (33 - camera1.position.y) / 11;
                } else if (camera1.position.y < -8 || camera1.position.y > 27) {
                    circle.alpha = 0;
                    outputplane.material.alpha = 0;
                } else if (camera1.position.y > -3 && camera1.position.y < 22) {
                    circle.alpha = 1;
                    outputplane.material.alpha = 1;
                }
            });
            // Метод, который реагирует на событие окончания загрузки сцены
            scene.executeWhenReady(function () {
                loadDefaults();
                // Добавление камеры на холст.
                camera1.attachControl(canvas, true);
                camera2.attachControl(canvas, true);
                // Запуск цикла визуализации сцены.
                engine.runRenderLoop(function () {
                    scene.render();
                });
            });
        });
    };

    publicMethods.changeModelObject = function (parameter, type, oldType) {
        if (config && scene) {
            meshModificators[parameter]["Type"](oldType, type);
        }
    };

    publicMethods.changeTexture = function (parameter, texture) {
        if (config && scene) {
            meshModificators[parameter]["Texture"](texture);
        }
    };

    publicMethods.changeColor = function (parameter, color) {
        if (config && scene) {
            meshModificators[parameter]["Color"](color);
        }
    };

    return publicMethods;
}();