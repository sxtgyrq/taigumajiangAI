var nyrqUrl =
{
    set: function (addr) {
        const url = new URL(window.location.href);
        url.searchParams.set('addr', addr);
        window.history.replaceState(null, null, url);
    },
    get: function () {
        const url = new URL(window.location.href);
        var parameter = url.searchParams.get('addr');
        if (parameter == null || parameter == undefined) {
            return '';
        }
        else return parameter;
    }
}

function TaskClass(s, c) {
    this._state = s;
    this._carSelect = c;
    this._oldState = s;
    this._newState = s;
}
TaskClass.prototype.__defineGetter__("state", function () {
    //ShowGetInfo("Age"); 
    return this._state;
});

TaskClass.prototype.__defineSetter__("state", function (val) {
    //if (this._state == 'getTax' && val != 'getTax') {
    //    Tax.trunOffAnimate();
    //}
    //else if (this._state != 'getTax' && val == 'getTax') {
    //    Tax.trunOnAnimate();
    //}
    this._state = val;
    if (this._oldState != this._state) {
        operatePanel.refresh();
        this._oldState = val;
    }
    //ShowSetInfo("Age");
});

TaskClass.prototype.__defineGetter__("carSelect", function () {
    //ShowGetInfo("Age"); 
    return this._carSelect;
});

TaskClass.prototype.__defineSetter__("carSelect", function (val) {
    this._carSelect = val;
    //ShowSetInfo("Age");
});
var objMain =
{
    debug: (function () {
        if (window.location.hostname == 'www.nyrq123.com') return 2;
        else if (window.location.hostname == '192.168.0.112') return 1;
        else return 0;
    })(),
    indexKey: '',
    displayName: '',
    positionInStation: 0,
    MoneyForSave: 0,
    Money: 0,
    state: '',
    receivedState: '',
    scene: null,
    renderer: null,
    labelRenderer: null,
    centerPosition: { lon: 112.573463, lat: 37.891474 },
    roadGroup: null,
    basePoint: null,
    fpIndex: -1,
    othersBasePoint: {},
    playerGroup: null,
    collectGroup: null,
    getOutGroup: null,
    robotModel: null,
    mahjongsModel:
    {
        dice: null,
        m0: null,//未知牌
        m1: null,//
        m2: null,
        m3: null,
        m4: null,
        m5: null,
        m6: null,
        m7: null,
        m8: null,
        m9: null,
        m11: null,
        m12: null,
        m13: null,
        m14: null,
        m15: null,
        m16: null,
        m17: null,
        m18: null,
        m19: null,
        m21: null,
        m22: null,
        m23: null,
        m24: null,
        m25: null,
        m26: null,
        m27: null,
        m28: null,
        m29: null,
        m40: null,
        m47: null,
        m54: null,
        m61: null,
        m68: null,
        m75: null,
        m82: null,
    },
    mahjongsGroup: null,
    diceGroup: null,
    mahjongsOnHandGroup: null,
    fightSituationGroup: null,
    cars: {},
    rmbModel: {},
    ModelInput: {
        speed: null,
        attack: null,
        shield: null,
        confusePrepare: null,
        lostPrepare: null,
        ambushPrepare: null,
        water: null,
        direction: null,
        directionArrow: null,
        directionArrowA: null,
        directionArrowB: null,
        directionArrowC: null,
        Opponent: null,
        Teammate: null,
        NitrogenEffect: null,
        CollectCoinIcon: null,
        GoldIngotIcon: null
    },
    shieldGroup: null,
    confusePrepareGroup: null,
    lostPrepareGroup: null,
    ambushPrepareGroup: null,
    waterGroup: null,
    waterMarkGroup: null,
    fireGroup: null,
    fireMarkGroup: null,
    lightningGroup: null,
    lightningMarkGroup: null,
    absorbGroup: null,
    directionGroup: null,
    crossSelectionsOperator: null,
    targetGroup: null,
    marketGroup: null,
    clock: null,
    leaveGameModel: null,
    profileModel: null,
    light1: null,
    light2: null,
    light3: null,
    light4: null,
    controls: null,
    raycaster: null,
    mouse: null,
    raycasterOfSelector: null,
    selectorPosition: { x: 0, y: 0.5 },
    selectObj: { obj: null, type: '' },
    canSelect: false,
    carsNames: null,
    carsAnimateData: {},
    PromoteState: -1,
    PromotePositions:
    {
        mile: null,
        business: null,
        volume: null,
        speed: null
    },
    PromoteList: ['mile', 'business', 'volume', 'speed'],
    PromoteDiamondCount:
    {
        mile: 0,
        business: 0,
        volume: 0,
        speed: 0
    },
    CollectPosition: {},
    diamondGeometry: null,
    mirrorCubeCamera: null,
    promoteDiamond: null,
    columnGroup: null,
    mainF:
    {
        lookAtPosition: function (fp) {

            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.Latitde));
            var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad));

            var cc = new Complex(end.x - start.x, end.z - start.z);
            cc.toOne();
            var minDistance = objMain.controls.minDistance * 5;
            var maxPolarAngle = objMain.controls.maxPolarAngle - Math.PI / 30;
            {
                var planePosition = new THREE.Vector3(start.x + cc.r * minDistance * Math.sin(maxPolarAngle), start.y + minDistance * Math.abs(Math.cos(maxPolarAngle)), start.z + cc.i * minDistance * Math.sin(maxPolarAngle));
                objMain.camera.position.set(planePosition.x, planePosition.y, planePosition.z);

                objMain.controls.target.set(MercatorGetXbyLongitude(fp.Longitude), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.Latitde));
                objMain.camera.lookAt(MercatorGetXbyLongitude(fp.Longitude), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.Latitde));
                objMain.renderer.render(objMain.scene, objMain.camera);
                objMain.labelRenderer.render(objMain.scene, objMain.camera);
            }
        },
        lookAtPosition2: function () {

            //var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));
            //var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), 0, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad));

            var cc = new Complex(1, 0);
            cc.toOne();
            var minDistance = objMain.controls.minDistance * 1.1;
            var maxPolarAngle = objMain.controls.maxPolarAngle - Math.PI / 30;
            {
                var start = objMain.transtractionData;
                var planePosition = new THREE.Vector3(start.x + cc.r * minDistance * Math.sin(maxPolarAngle), start.y + minDistance * Math.cos(maxPolarAngle), start.z + cc.i * minDistance * Math.sin(maxPolarAngle));
                objMain.camera.position.set(planePosition.x, planePosition.y, planePosition.z);

                objMain.controls.target.set(start.x, 0, start.z);
                objMain.camera.lookAt(start.x, 0, start.z);
            }
        },
        lookTwoPositionCenter: function (p1, p2) {

            var start = p1;
            var end = p2;
            var lengthTwoPoint = objMain.mainF.getLength(start, end);
            if (lengthTwoPoint > 0.2) {
                var cc = new Complex(end.x - start.x, end.z - start.z);
                cc.toOne();
                var x1 = lengthTwoPoint / (1 / Math.tan(Math.PI / 6) - 1 / Math.tan(Math.PI * 42 / 180));
                var x2 = x1 / Math.tan(Math.PI * 42 / 180);
                var x3 = x2 + lengthTwoPoint / 2;
                var minDistance = x3 / Math.cos(Math.PI * 36 / 180);
            }
            //var minDistance = objMain.controls.minDistance * 1.1;
            var maxPolarAngle = Math.PI * 54 / 180;
            {
                var planePosition = new THREE.Vector3(start.x + cc.r * minDistance * Math.sin(maxPolarAngle), start.y + minDistance * Math.cos(maxPolarAngle), start.z + cc.i * minDistance * Math.sin(maxPolarAngle));
                objMain.camera.position.set(planePosition.x, planePosition.y, planePosition.z);

                objMain.controls.target.set((start.x + end.x) / 2, 0, (start.z + end.z) / 2);
                objMain.camera.lookAt((start.x + end.x) / 2, 0, (start.z + end.z) / 2);
            }
        },
        getLength: function (p1, p2) {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y) + (p1.z - p2.z) * (p1.z - p2.z));
        },
        removeF:
        {
            removePanle: function (id) {
                //carsSelectionPanel
                while (document.getElementById(id) != null) {
                    document.getElementById(id).remove();
                }
            },
            clearGroup: function (group) {
                var startIndex = group.children.length - 1;
                for (var i = startIndex; i >= 0; i--) {
                    group.remove(group.children[i]);
                }
            }
        },
        refreshPromotionDiamondAndPanle: function (received_obj) {
            //if (received_obj.resultType == objMain.Task.state)
            {
                /*
                 * 这里进行了Task的状态验证，确保3D资源没有加载前，不会调用此方法
                 */
                if (objMain.state == "OnLine" || 'LookForBuildings' == objMain.state) {
                    var diamondName = "diamond_" + received_obj.resultType;
                    if (objMain.promoteDiamond.getObjectByName(diamondName) != undefined) {
                        objMain.promoteDiamond.remove(objMain.promoteDiamond.getObjectByName(diamondName));
                    }
                    var lineName = "approach_diamond_" + received_obj.resultType;
                    if (objMain.promoteDiamond.getObjectByName(lineName) != undefined) {
                        objMain.promoteDiamond.remove(objMain.promoteDiamond.getObjectByName(lineName));
                    }
                    // var lineName=
                    var color = 0x000000;

                    var objShow = null;
                    switch (received_obj.resultType) {
                        case 'mile':
                            {
                                objShow = DiamondModel.red;
                                color = 0xff0000;
                            }; break;
                        case 'business':
                            {
                                objShow = DiamondModel.green;
                                color = 0x00ff00;
                            }; break;
                        case 'volume':
                            {
                                objShow = DiamondModel.blue;
                                color = 0x0000ff;
                            }; break;
                        case 'speed':
                            {
                                objShow = DiamondModel.black;
                                color = 0x000000;
                            }; break;
                    }
                    if (objShow == null) {
                        return;
                    }

                    var diamond = objShow.children[0].clone();// new THREE.Mesh(geometry, material);
                    diamond.userData.Fp = objMain.PromotePositions[received_obj.resultType].Fp;
                    diamond.name = 'diamond' + '_' + received_obj.resultType;
                    diamond.scale.set(0.2, 0.22, 0.2);
                    diamond.position.set(
                        MercatorGetXbyLongitude(objMain.PromotePositions[received_obj.resultType].Fp.Longitude),
                        MercatorGetZbyHeight(objMain.PromotePositions[received_obj.resultType].Fp.Height) * objMain.heightAmplify,
                        -MercatorGetYbyLatitude(objMain.PromotePositions[received_obj.resultType].Fp.Latitde));

                    objMain.promoteDiamond.add(diamond);
                    objMain.mainF.drawLineOfFpToRoad(objMain.PromotePositions[received_obj.resultType].Fp, objMain.promoteDiamond, color, "diamond_" + received_obj.resultType);
                }
            }
        },
        refreshCollectAndPanle: function (collectIndex) {
            //if (objMain.state == "OnLine")
            if (objMain.collectGroup != null) {
                var objName = 'moneymodel' + collectIndex;
                var obj = objMain.collectGroup.getObjectByName(objName);
                if (obj == undefined) { }
                else {
                    objMain.collectGroup.remove(obj);
                }
                //'approach_' + lineName;
                var lineName = 'approach_' + 'money' + collectIndex;
                var line = objMain.collectGroup.getObjectByName(lineName);
                if (line == undefined) { }
                else {
                    objMain.collectGroup.remove(line);
                }

                var changeIndexToMoney = function (inputIndex) {
                    switch (inputIndex) {
                        case 0:
                            {
                                return 1;
                            };
                        case 1:
                        case 2:
                            {
                                return 1;
                            };
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            {
                                return 1;
                            };
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16:
                        case 17:
                            {
                                return 1;
                            };
                        case 18:
                        case 19:
                        case 20:
                        case 21:
                        case 22:
                        case 23:
                        case 24:
                        case 25:
                        case 26:
                        case 27:
                        case 28:
                        case 29:
                        case 30:
                        case 31:
                        case 32:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 37:
                            {
                                return 1;
                            };
                        default: return 0;
                    }
                };
                var model;

                switch (changeIndexToMoney(collectIndex)) {
                    case 1:
                        {
                            model = objMain.ModelInput.GoldIngotIcon.obj.clone();//objMain.rmbModel['rmb1'].clone();
                        }; break;
                    case 5:
                        {
                            model = objMain.rmbModel['rmb5'].clone();
                        }; break;
                    case 10:
                        {
                            model = objMain.rmbModel['rmb10'].clone();
                        }; break;
                    case 20:
                        {
                            model = objMain.rmbModel['rmb20'].clone();
                        }; break;
                    case 50:
                        {
                            model = objMain.rmbModel['rmb50'].clone();
                        }; break;
                    case 100:
                        {
                            model = objMain.rmbModel['rmb100'].clone();
                        }; break;
                    default: return;
                }

                if (objMain.CollectPosition[collectIndex] == undefined) {
                    return;
                }

                model.position.set(MercatorGetXbyLongitude(objMain.CollectPosition[collectIndex].Fp.Longitude), MercatorGetZbyHeight(objMain.CollectPosition[collectIndex].Fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(objMain.CollectPosition[collectIndex].Fp.Latitde));
                model.name = objName;
                model.userData.collectPosition = objMain.CollectPosition[collectIndex];
                objMain.collectGroup.add(model);

                var color = 0xFFD700;

                objMain.mainF.drawLineOfFpToRoad(objMain.CollectPosition[collectIndex].Fp, objMain.collectGroup, color, 'money' + collectIndex);

                //if (objMain.Task.state == 'collect') {
                //    objMain.mainF.drawPanelOfCollect(endF);
                //}
            }
        },
        drawPanelOfCollect: function (endF) {

            var lengthOfObjs = objMain.groupOfOperatePanle.children.length;
            for (var i = lengthOfObjs - 1; i >= 0; i--) {
                objMain.groupOfOperatePanle.remove(objMain.groupOfOperatePanle.children[i]);
            }
            for (var i = 0; i < 38; i++) {
                if (objMain.CollectPosition[i] == undefined) {
                    continue;
                }
                var element = document.createElement('div');
                element.style.width = '10em';
                element.style.marginTop = '3em';
                var color = '#ff0000';
                element.style.border = '2px solid ' + color;
                element.style.borderTopLeftRadius = '0.5em';
                element.style.backgroundColor = 'rgba(155, 55, 255, 0.3)';
                element.style.color = '#1504f6';

                var div2 = document.createElement('div');
                div2.style.fontSize = '0.5em';

                var b = document.createElement('b');
                b.innerHTML = '到[<span style="color:#f5ffba">' + objMain.CollectPosition[i].Fp.FastenPositionName + '</span>]回收<span style="color:#f5ffba">' + (objMain.CollectPosition[i].collectMoney).toFixed(2) + '元</span>现金。';
                div2.appendChild(b);

                element.appendChild(div2);

                var object = new THREE.CSS2DObject(element);
                var fp = objMain.CollectPosition[i].Fp;
                object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0, -MercatorGetYbyLatitude(fp.Latitde));

                objMain.groupOfOperatePanle.add(object);
            }



        },
        removeRole: function (roleID) {
            var carRoad_ID = 'carRoad_' + roleID;

            objMain.carGroup.remove(objMain.carGroup.getObjectByName(carRoad_ID));

            var car_ID = 'car_' + roleID;
            stateSet.speed.clear(car_ID);
            stateSet.attck.clear(car_ID);
            stateSet.confuse.clear(car_ID);
            stateSet.lost.clear(car_ID);

            objMain.carGroup.remove(objMain.carGroup.getObjectByName(car_ID));


            var approachId = 'approach_' + roleID;//;216596b5fddf7bc24f05bfebb2b1f10d
            objMain.playerGroup.remove(objMain.playerGroup.getObjectByName(approachId));

            var flagId = 'flag_' + roleID;//;216596b5fddf7bc24f05bfebb2b1f10d
            objMain.playerGroup.remove(objMain.playerGroup.getObjectByName(flagId));

            stateSet.lightning.clear(roleID);
            stateSet.water.clear(roleID);
            stateSet.fire.clear(roleID);

            stateSet.defend.clear(roleID);

            delete objMain.othersBasePoint[roleID];
        },
        drawDiamondCollected: function () {
            var fp = objMain.basePoint;
            var key = objMain.indexKey;//objMain.basePoint
            var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.Latitde))
            var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad))
            var cc = new Complex(end.x - start.x, end.z - start.z);
            cc.toOne();

            var positon1 = cc.multiply(new Complex(0, 1));
            var positon2 = positon1.multiply(new Complex(0.5, 0.86602));
            var positon3 = positon2.multiply(new Complex(0.5, 0.86602));
            var positon4 = positon3.multiply(new Complex(0.5, 0.86602));

            var positons = [positon1, positon2, positon3, positon4];

            var names = ['BatteryMile', 'BatteryBusiness', 'BatteryVolume', 'BatterySpeed'];
            var index = ['mile', 'business', 'volume', 'speed'];
            var colors = [0xff0000, 0x00ff00, 0x0000ff, 0x000000];
            //   console.log('positons', positons);
            var percentOfPosition = 0.5;
            for (var i = 0; i < positons.length; i++) {
                var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.Latitde));
                var end = new THREE.Vector3(start.x + positons[i].r * percentOfPosition, MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, start.z + positons[i].i * percentOfPosition);
                //var lineGeometry = new THREE.Geometry();
                //lineGeometry.vertices.push(start);
                //lineGeometry.vertices.push(end);
                //var lineMaterial = new THREE.LineBasicMaterial({ color: color });
                //var line = new THREE.Line(lineGeometry, lineMaterial);
                //line.name = 'carRoad11' + 'ABCDE'[i] + '_' + key;
                //line.userData = { objectType: 'carRoad', parent: key, index: (i + 0) };
                //objMain.carGroup.add(line);
                var mesh;
                if (objMain.columnGroup.getObjectByName(names[i]) == undefined) {
                    var geometryCylinder = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16);
                    var color = colors[i];
                    var materialCylinder = new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: 0.6 });
                    mesh = new THREE.Mesh(geometryCylinder, materialCylinder);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    mesh.name = names[i];
                    mesh.scale.setY(0.01);
                    mesh.position.set(end.x, end.y, end.z);
                    mesh.userData.index = index[i];
                    objMain.columnGroup.add(mesh);
                }
                else {
                    mesh = objMain.columnGroup.getObjectByName(names[i]);
                }

                if (objMain.PromoteDiamondCount[index[i]] != undefined) {
                    var scale = objMain.PromoteDiamondCount[index[i]];
                    scale = Math.max(0.01, scale);
                    mesh.scale.setY(scale);
                }
                //var model = objMain.cars[names[i]].clone();
                //model.name = names[i] + '_' + key;
                //model.position.set(end.x, 0, end.z);
                //model.scale.set(0.002, 0.002, 0.002);
                //model.rotateY(-positons[i].toAngle());
                //model.userData = { objectType: 'car', parent: key, index: names[i] };
                //objMain.carGroup.add(model);
            }
        },
        updateCollectGroup: function () {
            /*
             * 后台已停用
             */
            // theLagestHoderKey.updateCollectGroup();
        },
        refreshBuyPanel: function () {
            objMain.mainF.removeF.clearGroup(objMain.groupOfOperatePanle);
            {
                {
                    var element = document.createElement('div');

                    element.style.width = '10em';
                    element.style.marginTop = '3em';
                    var color = '#ff0000';
                    //var colorName = '红';
                    //switch (type) {
                    //    case 'mile':
                    //        {
                    //            color = '#ff0000';
                    //            colorName = '红';
                    //        }; break;
                    //    case 'business': {
                    //        color = '#00ff00';
                    //        colorName = '绿';
                    //    }; break;
                    //    case 'volume': { 
                    //        color = '#0000ff';
                    //        colorName = '蓝';
                    //    }; break;
                    //    case 'speed': { 
                    //        color = '#000000';
                    //        colorName = '黑';
                    //    }; break; 
                    //}
                    element.style.border = '2px solid ' + color;
                    element.style.borderTopLeftRadius = '0.5em';
                    element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                    element.style.color = '#1504f6';

                    var div2 = document.createElement('div');

                    var b = document.createElement('b');
                    b.innerHTML = '现在售价如下红宝石10.00，蓝宝石10.00，蓝宝石10.00，黑宝石10.00！点击柱状仓库，进行购买！';
                    div2.appendChild(b);



                    element.appendChild(div2);

                    var object = new THREE.CSS2DObject(element);
                    var fp = objMain.basePoint;
                    object.position.set(MercatorGetXbyLongitude(fp.Longitude), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.Latitde));

                    objMain.groupOfOperatePanle.add(object);
                }


            }
        }
    },
    Task: new TaskClass('', ''),
    animation:
    {
        animateCameraByCarAndTask: function () {
            if (objMain.Task.state == 'mile') {
                if (objMain.Task.carSelect != '') {
                    var p1 = objMain.promoteDiamond.children[0].position;
                    var p2 = objMain.carGroup.getObjectByName(objMain.Task.carSelect).position;

                }
            }
        }
    },
    groupOfOperatePanle: null,
    groupOfTaskCopy: null,
    GetPositionNotify: {
        data: null, F: function (data) {
            console.log(data);
            var objInput = JSON.parse(data);
            objMain.basePoint = objInput.fp;
            //objMain.carsNames = objInput.carsNames;
            objMain.indexKey = objInput.key;
            objMain.displayName = objInput.PlayerName;
            objMain.fpIndex = objInput.fPIndex;
            objMain.groupNumber = objInput.groupNumber;
            objMain.positionInStation = objInput.positionInStation;
            //if (objMain.receivedState == 'WaitingToGetTeam') {
            //    objMain.ws.send(received_msg);
            //}
            //小车用 https://threejs.org/examples/#webgl_animation_skinning_morph
            //小车用 基地用 https://threejs.org/examples/#webgl_animation_cloth
            // drawFlag(); 
            drawPoint('green', objMain.basePoint, objMain.indexKey);
            /*画引线*/
            objMain.mainF.drawLineOfFpToRoad(objMain.basePoint, objMain.playerGroup, 'green', objMain.indexKey);
            objMain.mainF.drawDiamondCollected();
            objMain.mainF.lookAtPosition(objMain.basePoint);
            objMain.mainF.initilizeCars(objMain.basePoint, 'green', objMain.indexKey, true, objMain.positionInStation);



            objMain.GetPositionNotify.data = null;
            SysOperatePanel.draw();
            currentSelectionPreparationShow.show();
            operateStateShow.show();


            var startBase = new THREE.Vector3(MercatorGetXbyLongitude(objMain.basePoint.Longitude), MercatorGetZbyHeight(objMain.basePoint.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(objMain.basePoint.Latitde));
            var animationData =
            {
                old: {
                    x: objMain.controls.target.x,
                    y: objMain.controls.target.y,
                    z: objMain.controls.target.z,
                    t: Date.now()
                },
                newT:
                {
                    x: startBase.x,
                    y: startBase.y,
                    z: startBase.z,
                    t: Date.now() + 3000
                }
            };
            objMain.camaraAnimateData = animationData;

        }, otherData: []
    },
    Tax: {},
    taxGroup: null,
    buildingSelectionGroup: null,
    msg:
    {

    },
    panOrRotate: 'rotate',
    carState: { 'stamp': -1 },
    carStateTimestamp: {},
    music:
    {
        theme: '',
        change: function () {
            //if(dou)
            if (whetherGo.obj != null && whetherGo.obj.Live) {
                var bgm = document.getElementById('backGroudMusick');
                //   var paused = bgm.paused;
                if (bgm.currentTime === 0 || bgm.ended) {

                    var itemCount = bgm.children.length - 1;
                    for (var i = itemCount; i >= 0; i--) {
                        bgm.children[i].remove();
                    }
                    var source1 = document.createElement('source');
                    source1.src = 'bgm/windyhillbgm.ogg';
                    source1.type = 'audio/ogg';

                    var source2 = document.createElement('source');
                    source2.src = 'bgm/windyhillbgm.mp3';
                    source2.type = 'audio/mpeg';

                    bgm.appendChild(source1);
                    bgm.appendChild(source2);

                    bgm.oncanplaythrough = function () {
                        if (objMain.music.on)
                            this.play();
                    };

                    bgm.load();
                    bgm.addEventListener('ended', function () {
                        // 当音频播放完成时，将当前播放时间重置为0，实现单曲循环
                        this.currentTime = 0;
                        this.play();
                    });
                }
            }
            else {
                var bgm = document.getElementById('backGroudMusick');
                //   var paused = bgm.paused;
                if (bgm.currentTime === 0 || bgm.ended) {
                    switch (this.theme) {
                        case '':
                            {
                                var itemCount = bgm.children.length - 1;
                                for (var i = itemCount; i >= 0; i--) {
                                    bgm.children[i].remove();
                                }
                                var source1 = document.createElement('source');
                                source1.src = 'bgm/GameofThrones.ogg';
                                source1.type = 'audio/ogg';

                                var source2 = document.createElement('source');
                                source2.src = 'bgm/GameofThrones.mp3';
                                source2.type = 'audio/mpeg';

                                bgm.appendChild(source1);
                                bgm.appendChild(source2);

                                bgm.oncanplaythrough = function () {
                                    if (objMain.music.on)
                                        this.play();
                                };

                                bgm.load();
                                //if (this.on)
                                //    bgm.play();
                            }; break;
                        default:
                            {
                                var itemCount = bgm.children.length - 1;
                                for (var i = itemCount; i >= 0; i--) {
                                    bgm.children[i].remove();
                                }
                                var source1 = document.createElement('source');
                                source1.src = 'bgm/' + this.theme + '.ogg';
                                source1.type = 'audio/ogg';

                                var source2 = document.createElement('source');
                                source2.src = 'bgm/' + this.theme + '.mp3';
                                source2.type = 'audio/mpeg';

                                bgm.appendChild(source1);
                                bgm.appendChild(source2);

                                bgm.oncanplaythrough = function () {
                                    if (objMain.music.on)
                                        this.play();
                                };
                                bgm.load();
                                //if (this.on)
                                //    bgm.play();
                            }; break;
                    }

                }
            }
        },
        on: true,
        MarketRepeat: function () {
        },
        isSetByWeb: false
    },
    targetMusic:
    {
        theme: [],
        change: function (themeItem) {
            try {
                if (themeItem == '' || themeItem == null) {
                    return;
                }
                else if (/^[A-Z]{10}$/.test(themeItem)) {
                    objMain.targetMusic.theme.push(themeItem);
                    if (objMain.targetMusic.theme.length > 3) {
                        objMain.targetMusic.theme.shift();
                    }
                }
                else if (themeItem == 'pass') {

                }
                else {
                    return;
                }
                if (objMain.targetMusic.theme.length > 0) {
                    var bgm = document.getElementById('fpBgSoundMusick');
                    if (objMain.debug == 2) {
                        if (bgm.currentTime === 0 || bgm.ended) {
                            var fpID = objMain.targetMusic.theme[Math.floor(Math.random() * objMain.targetMusic.theme.length)]
                            var itemCount = bgm.children.length - 1;
                            for (var i = itemCount; i >= 0; i--) {
                                bgm.children[i].remove();
                            }
                            var source1 = document.createElement('source');
                            source1.src = 'https://yrqmodeldata.oss-cn-beijing.aliyuncs.com/fpbgmuic/' + fpID + '.ogg';
                            source1.type = 'audio/ogg';

                            var source2 = document.createElement('source');
                            source2.src = 'https://yrqmodeldata.oss-cn-beijing.aliyuncs.com/fpbgmuic/' + fpID + '.mp3';;
                            source2.type = 'audio/mpeg';

                            bgm.appendChild(source1);
                            bgm.appendChild(source2);

                            bgm.oncanplaythrough = function () {
                                if (objMain.music.on) {
                                    this.play();
                                    var anotherBGM = document.getElementById('backGroudMusick');
                                    anotherBGM.volume = 0.07;
                                }
                            };
                            bgm.load();
                            bgm.onended = function () {
                                setTimeout(() => {
                                    var anotherBGM = document.getElementById('backGroudMusick');
                                    anotherBGM.volume = 1;
                                }, 1000);
                                // bgm.volume = 0.07;
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.info('targetMusic音乐报错', e);
                // console.log('targetMusic音乐报错', e);
            }
        },
        on: true,
        MarketRepeat: function () {
        },
        isSetByWeb: false
    },
    background:
    {
        path: '',
        change: function () {
            if (/^[A-Z]{10}$/.test(this.path)) {
                //if (objMain.background.backgroundData[this.path] == undefined)
                {
                    var cubeTextureLoader = new THREE.CubeTextureLoader();
                    //http://yrqmodeldata.oss-cn-beijing.aliyuncs.com/fpbgimg/IJZJBCUKEK/nx.jpg
                    if (objMain.debug != 2)
                        cubeTextureLoader.setPath('http://127.0.0.1:11001/bgimg/' + this.path + '/');
                    else
                        cubeTextureLoader.setPath('https://yrqmodeldata.oss-cn-beijing.aliyuncs.com/fpbgimg/' + this.path + '/');
                    // window.location.hostname + '/bgimg?key=1&y=2&p=px'
                    cubeTextureLoader.load(
                        [
                            "px.jpg", "nx.jpg",
                            "py.jpg", "ny.jpg",
                            "pz.jpg", "nz.jpg"], function (newTexture) {
                                objMain.scene.background.images[0] = newTexture.images[0]; // px
                                objMain.scene.background.images[1] = newTexture.images[1]; // nx
                                objMain.scene.background.images[2] = newTexture.images[2]; // py
                                objMain.scene.background.images[3] = newTexture.images[3]; // ny
                                objMain.scene.background.images[4] = newTexture.images[4]; // pz
                                objMain.scene.background.images[5] = newTexture.images[5]; // nz
                                objMain.scene.background.needsUpdate = true;
                                cubeTextureLoader = null;
                            });
                    // objMain.background.backgroundData[this.path] = cubeTexture;
                }
                //objMain.scene.background = objMain.background.backgroundData[this.path];
                //delete objMain.background.backgroundData[this.path];
            }
            else {
                switch (this.path) {
                    case '':
                        {
                            //if (objMain.background.backgroundData['main'] == undefined)
                            {
                                var cubeTextureLoader = new THREE.CubeTextureLoader();
                                cubeTextureLoader.setPath('Pic/');
                                cubeTextureLoader.load([
                                    "px.jpg", "nx.jpg",
                                    "py.jpg", "ny.jpg",
                                    "pz.jpg", "nz.jpg"
                                ], function (newTexture) {
                                    objMain.scene.background.images[0] = newTexture.images[0]; // px
                                    objMain.scene.background.images[1] = newTexture.images[1]; // nx
                                    objMain.scene.background.images[2] = newTexture.images[2]; // py
                                    objMain.scene.background.images[3] = newTexture.images[3]; // ny
                                    objMain.scene.background.images[4] = newTexture.images[4]; // pz
                                    objMain.scene.background.images[5] = newTexture.images[5]; // nz
                                    objMain.scene.background.needsUpdate = true;
                                    cubeTextureLoader = null;
                                });
                                //objMain.background.backgroundData['main'] = cubeTexture;
                                //objMain.scene.background = objMain.background.backgroundData['main'];
                            }
                            /* objMain.scene.background = objMain.background.backgroundData['main'];*/
                            //delete objMain.background.backgroundData['main']; 
                        }; break;
                    default:
                        {
                            //if (objMain.background.backgroundData[this.path] == undefined)
                            {
                                var cubeTextureLoader = new THREE.CubeTextureLoader();
                                cubeTextureLoader.setPath('Pic/' + this.path + '/');
                                cubeTextureLoader.load([
                                    "px.jpg", "nx.jpg",
                                    "py.jpg", "ny.jpg",
                                    "pz.jpg", "nz.jpg"
                                ], function (newTexture) {
                                    objMain.scene.background.images[0] = newTexture.images[0]; // px
                                    objMain.scene.background.images[1] = newTexture.images[1]; // nx
                                    objMain.scene.background.images[2] = newTexture.images[2]; // py
                                    objMain.scene.background.images[3] = newTexture.images[3]; // ny
                                    objMain.scene.background.images[4] = newTexture.images[4]; // pz
                                    objMain.scene.background.images[5] = newTexture.images[5]; // nz
                                    objMain.scene.background.needsUpdate = true;
                                    cubeTextureLoader = null;
                                });
                                //  objMain.background.backgroundData[this.path] = cubeTexture;
                            }
                            //objMain.scene.background = objMain.background.backgroundData[this.path];
                            //delete objMain.background.backgroundData[this.path];

                        }; break;
                }
            }
        },
        backgroundData: {},
        changeWhenIsCross: function (r) {
            if (r.IsDetalt) {
                var cubeTextureLoader = new THREE.CubeTextureLoader();
                cubeTextureLoader.setPath('Pic/');
                //var cubeTexture = cubeTextureLoader.load([
                //    "xi_r.jpg", "dong_r.jpg",
                //    "ding_r.jpg", "di_r.jpg",
                //    "nan_r.jpg", "bei_r.jpg"
                //]);
                cubeTextureLoader.load([
                    "px.jpg", "nx.jpg",
                    "py.jpg", "ny.jpg",
                    "pz.jpg", "nz.jpg"
                ],
                    function (newTexture) {
                        objMain.scene.background.images[0] = newTexture.images[0]; // px
                        objMain.scene.background.images[1] = newTexture.images[1]; // nx
                        objMain.scene.background.images[2] = newTexture.images[2]; // py
                        objMain.scene.background.images[3] = newTexture.images[3]; // ny
                        objMain.scene.background.images[4] = newTexture.images[4]; // pz
                        objMain.scene.background.images[5] = newTexture.images[5]; // nz
                        objMain.scene.background.needsUpdate = true;
                        cubeTextureLoader = null;
                    }
                );
                //  objMain.scene.background = objMain.background.backgroundData['main'];
            }
            else {
                //if (objMain.background.backgroundData[r.Md5Key] == undefined)
                {
                    var cubeTextureLoader = new THREE.CubeTextureLoader();
                    if (objMain.debug != 2) {
                        cubeTextureLoader.setPath('http://127.0.0.1:11001/bgimg/' + r.Md5Key + '/');
                    }
                    else {
                        cubeTextureLoader.setPath('https://yrqmodeldata.oss-cn-beijing.aliyuncs.com/bgimg/' + r.Md5Key + '/'); //http://yrqmodeldata.oss-cn-beijing.aliyuncs.com/bgimg/b46fc059ea0a9d7aac06b539d469dfe5/ny.jpg
                        // cubeTextureLoader.setPath('https://www.nyrq123.com/imgtaiyuan/' + r.Md5Key + '/');
                    }
                    cubeTextureLoader.load(
                        [
                            "px.jpg", "nx.jpg",
                            "py.jpg", "ny.jpg",
                            "pz.jpg", "nz.jpg"],
                        function (newTexture) {
                            objMain.scene.background.images[0] = newTexture.images[0]; // px
                            objMain.scene.background.images[1] = newTexture.images[1]; // nx
                            objMain.scene.background.images[2] = newTexture.images[2]; // py
                            objMain.scene.background.images[3] = newTexture.images[3]; // ny
                            objMain.scene.background.images[4] = newTexture.images[4]; // pz
                            objMain.scene.background.images[5] = newTexture.images[5]; // nz
                            objMain.scene.background.needsUpdate = true;
                            cubeTextureLoader = null;
                        });
                    //  objMain.background.backgroundData[r.Md5Key] = cubeTexture;
                }
                // objMain.scene.background = objMain.background.backgroundData[r.Md5Key];
            }
        }
    },
    rightAndDuty:
    {
        data: {},
        update: function () { }
    },
    dealWithReceivedObj: function (received_obj, evt, received_msg) {
        switch (received_obj.c) {
            case 'setState':
                {
                    objMain.receivedState = received_obj.state;
                    switch (objMain.receivedState) {
                        case 'selectSingleTeamJoin':
                            {
                                selectSingleTeamJoinHtml();
                            }; break;
                        case 'OnLine':
                            {
                                switch (objMain.state) {
                                    default: {
                                        set3DHtml();
                                        //  objMain.state = objMain.receivedState;
                                        objMain.ws.send('SetOnLine');
                                        UpdateOtherBasePoint();
                                        objMain.state = objMain.receivedState;
                                    }; break;
                                }
                                objMain.state = objMain.receivedState;

                                {
                                    var confirmFirst = function () {
                                        if (confirm("确认离开www.nyrq123.com?")) {
                                        } else {
                                            return false;
                                        }
                                    }
                                    window.onbeforeunload = confirmFirst;


                                }
                            }; break;
                        case 'WaitingToStart':
                            {
                                setWaitingToStart();
                            }; break;
                        case 'WaitingToGetTeam':
                            {
                                setWaitingToGetTeam();
                            }; break;
                        case 'LookForBuildings':
                            {
                                if (objMain.state == 'OnLine') {
                                    objMain.state = objMain.receivedState;
                                    setTransactionHtml.change();
                                    operatePanel.refresh();
                                    UpdateOtherBasePoint();
                                }
                            }; break;
                        case 'QueryReward':
                            {
                                objMain.state = objMain.receivedState;
                                objMain.ws.send(JSON.stringify({ 'c': 'RewardInfomation', 'Page': 0 }));
                            }; break;
                        case 'Guid':
                            {
                                objMain.state = objMain.receivedState;
                                GuidObj.gameIntroShow();
                            }; break;
                        case 'empty':
                            {
                                if (objMain.state == 'OnLine') {
                                    location.reload();
                                }
                            }; break;
                    }
                }; break;
            case 'setSession':
                {
                    sessionStorage['session'] = received_obj.session;

                    if (window.localStorage.getItem('notSaveSession') == null) {
                        window.localStorage.setItem('session', sessionStorage['session'])
                    }
                }; break;
            case 'TeamCreateFinish':
                {
                    //  alert();
                    console.log('提示', '队伍创建成功');
                    if (objMain.receivedState == 'WaitingToStart') {
                        //{"CommandStart":"182be0c5cdcd5072bb1864cdee4d3d6e","WebSocketID":3,"TeamNum":0,"c":"TeamCreateFinish"}
                        token.CommandStart = received_obj.CommandStart;
                        createTeam(received_obj);
                    }
                    //  sessionStorage['session'] = received_obj.session;
                }; break;
            case 'TeamJoinFinish':
                {
                    console.log('提示', '加入队伍成功');
                    if (objMain.receivedState == 'WaitingToGetTeam') {
                        joinTeamDetail(received_obj);
                    }
                }; break;
            case 'Alert':
                {
                    alert(received_obj.msg);
                }; break;
            case 'TeamJoinBroadInfo':
                {
                    if (objMain.receivedState == 'WaitingToGetTeam' || objMain.receivedState == 'WaitingToStart') {
                        broadTeamJoin(received_obj);
                    }
                }; break;
            case 'TeamJoinRemoveInfo':
                {
                    if (objMain.receivedState == 'WaitingToGetTeam' || objMain.receivedState == 'WaitingToStart') {
                        broadTeamMemberRemove(received_obj);
                    }
                }; break;
            case 'TeamNumWithSecret':
                {
                    if (objMain.receivedState == 'WaitingToGetTeam') {
                        console.log('secret', received_msg);
                        // var obj = JSON.parse(
                        var objPass = { 'Secret': received_obj.Secret, 'WebSocketID': received_obj.WebSocketID, 'c': 'TeamNumWithSecret', 'RefererAddr': nyrqUrl.get() }
                        objMain.ws.send(JSON.stringify(objPass));

                    }
                }; break;
            case 'GetOthersPositionNotify_v2':
                {
                    /*
                     * 其他玩家的状态刷新
                     */
                    //  console.log(evt.data);
                    var objInput = received_obj;

                    if (objInput.key == objMain.indexKey) { }
                    else {
                        var basePoint = objInput.fp;
                        //var carsNames = objInput.carsNames;
                        var indexKey = objInput.key;
                        var PlayerName = objInput.PlayerName;
                        var fPIndex = objInput.fPIndex;
                        var positionInStation = objInput.positionInStation;
                        var isNPC = objInput.isNPC;
                        var isPlayer = objInput.isPlayer;
                        var Level = objInput.Level;
                        objMain.othersBasePoint[indexKey] =
                        {
                            'basePoint': basePoint,
                            'indexKey': indexKey,
                            'playerName': PlayerName,
                            'fPIndex': fPIndex,
                            'isNPC': isNPC,
                            'isPlayer': isPlayer,
                            'Level': Level,
                            'positionInStation': positionInStation
                        };
                        UpdateOtherBasePoint();
                        //小车用 https://threejs.org/examples/#webgl_animation_skinning_morph
                        //小车用 基地用 https://threejs.org/examples/#webgl_animation_cloth 
                    }
                }; break;
            case 'GetPositionNotify_v2':
                {
                    /*
                     * 命令GetPositionNotify 与setState objMain.state="OnLine"发生顺序不定。但是画数据，需要在3D初始化之后。
                     */
                    if (objMain.state == "OnLine") {
                        var msg = '先执行了 OnLine命令';
                        console.log('提示', msg);
                        console.log('提示', received_obj);
                        //objMain.GetPositionNotify.F(evt.data);
                        switch (received_obj.MahjongState) {
                            case 'NeedToSelectDirction':
                                {
                                    selectPosition.refresh();
                                }; break;
                            case 'NeedToGetStartPosition':
                                {
                                    //NeedToGetStartPosition
                                    //  mahjongDisplay.ShowStart();
                                    mahjongDisplay.sortedShow();
                                    switch (received_obj.Position) {
                                        case 'East': {
                                            // objMain.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 30);
                                            objMain.camera.position.set(0.6 + 0.3, 1.1, 0);

                                            objMain.controls.minPolarAngle = Math.PI / 600;
                                            objMain.controls.maxPolarAngle = Math.PI / 2 - Math.PI / 36;
                                            objMain.controls.minDistance = 1;
                                            objMain.controls.maxDistance = 1;
                                            objMain.controls.enableZoom = false;
                                            selectPosition.refresh2();
                                        }; break;
                                    }
                                }; break;
                            case 'NeedToWait':
                                {
                                    if (received_obj.diceRotating) {
                                        objMain.diceRotating = true;
                                    }
                                    else {
                                        objMain.diceRotating = false;
                                        diceDisplay.showValue(received_obj.dicePoint[0], received_obj.dicePoint[1], received_obj.dicePoint[2], received_obj.dicePoint[3]);
                                    }
                                }; break;
                            case 'NeedToPlayAHand':
                                {
                                    if (received_obj.CurrentPositon > received_obj.StartPosition) {
                                        for (var i = 0; i < 136; i++) {
                                            var mahjongName = 'mahjong' + i;
                                            if (i >= received_obj.StartPosition && i < received_obj.CurrentPositon) {
                                                objMain.mahjongsGroup.getObjectByName(mahjongName).visible = false;
                                            }
                                            else objMain.mahjongsGroup.getObjectByName(mahjongName).visible = true;
                                        }
                                    }
                                    else {
                                        for (var i = 0; i < 136; i++) {
                                            var mahjongName = 'mahjong' + i;
                                            if (i < received_obj.CurrentPositon) objMain.mahjongsGroup.getObjectByName(mahjongName).visible = false;
                                            else if (i >= received_obj.StartPosition) objMain.mahjongsGroup.getObjectByName(mahjongName).visible = false;
                                            else { objMain.mahjongsGroup.getObjectByName(mahjongName).visible = true; }
                                        }

                                    }
                                    mahjongDisplay.showMahjongsOnHand(received_obj.Mahjongs);
                                    //received_obj.mahjongDisplay.showMahjongOnHand()
                                }; break;
                        }
                    }
                    else {
                        /*
                         * 
                         */
                        var msg = 'GetPositionNotify出入时，状态为' + objMain.state;
                        console.log('提示', msg);
                        throw (msg);
                        //  objMain.GetPositionNotify.data = evt.data;
                        return;
                    }

                    //var model = objMain.robotModel.clone();
                    //model.position.set(objMain.basePoint.MacatuoX, 0, -objMain.basePoint.MacatuoY);
                    //objMain.roadGroup.add(model);
                }; break;




            case 'MoneyNotify':
                {
                    objMain.Money = received_obj.Money;
                    moneyShow.show();
                }; break;
            case 'BradCastSocialResponsibility':
                {
                    SocialResponsibility.data[received_obj.otherKey] = received_obj.socialResponsibility;
                    //SocialResponsibility.data.add
                    if (objMain.indexKey == received_obj.otherKey) {
                        SocialResponsibility.show();
                    }
                }; break;
            case 'GetName':
                {
                    if (document.getElementById('playerNameTextArea') != undefined) {
                        document.getElementById('playerNameTextArea').value = received_obj.name;
                    }
                    localStorage.playerName = received_obj.name;
                }; break;
            case 'GetCarsName':
                {
                    for (var i = 0; i < 5; i++) {
                        var iName = 'car' + (i + 1) + 'NameTextArea';
                        if (document.getElementById(iName) != undefined) {
                            document.getElementById(iName).value = received_obj.names[i];
                        }
                    }

                }; break;
            case 'BradCarState':
                {
                    if (received_obj.countStamp > objMain.carState.stamp) {
                        objMain.carState.stamp = received_obj.countStamp;
                        objMain.carState[received_obj.carID] = received_obj.State;
                        //if()
                        // var oldLength = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target);
                        //objMain.carStateTimestamp[received_obj.carID] = { 't': Date.now(), 'l': oldLength };
                        objNotify.notifyCar(received_obj.carID, received_obj.State);
                        operatePanel.refresh();
                        //setInterval(function () {
                        //    objMain.music.MarketRepeat();
                        //}, 1000);//这里要用setTimeOut主要是考虑加速时，carState 与speed 传输不一致，加个时间，做缓冲。

                    }
                }; break;
            case 'BradCastCollectInfoDetail_v2':
                {

                    console.log('显示', received_obj);
                    objMain.CollectPosition[received_obj.collectIndex] = received_obj;
                    ////  switch (received_obj.
                    //objMain.CollectPosition = received_obj;
                    for (var i = 0; i < 38; i++) {
                        objMain.mainF.refreshCollectAndPanle(i + 0, undefined);
                    }
                }; break;
            case 'BradCarPurpose':
                {
                    console.log('显示', 'BradCarPurpose');
                }; break;
            case 'BradCastRightAndDuty':
                {
                    objMain.rightAndDuty.data[received_obj.playerKey] =
                    {
                        right: received_obj.right,
                        duty: received_obj.duty,
                        rightPercent: received_obj.rightPercent,
                        dutyPercent: received_obj.dutyPercent
                    }
                }; break;
            case 'BradCastMusicTheme':
                {
                    if (objMain.music.isSetByWeb) { }
                    else
                        objMain.music.theme = received_obj.theme;
                }; break;
            case 'BradCastBackground':
                {
                    objMain.background.path = received_obj.path;
                    objMain.background.change();
                }; break;
            case 'WMsg':
                {
                    $.notify(received_obj.Msg, { style: "happyblue", autoHideDelay: 15000 });
                }; break;
            case 'WMsg_WithShowTime':
                {
                    // $.notify('你好', { style: "happyblue" });
                    $.notify(received_obj.Msg, { style: "happyblue", autoHideDelay: received_obj.ShowTime });
                }; break;
            case 'BradDiamondPrice':
                {
                    objMain.diamondPrice[received_obj.priceType] = received_obj.price;
                }; break;
            case 'DriverNotify':
                {
                    objMain.driver.driverIndex = received_obj.index;
                    objMain.driver.name = received_obj.name;
                    objMain.driver.skill1.name = received_obj.skill1Name;
                    objMain.driver.skill1.skillIndex = received_obj.skill1Index;
                    objMain.driver.skill2.name = received_obj.skill2Name;
                    objMain.driver.skill2.skillIndex = received_obj.skill2Index;
                    objMain.driver.sex = received_obj.sex;
                    objMain.driver.race = received_obj.race;
                    driverSys.drawIcon(objMain.driver);
                    operatePanel.refresh();
                }; break;
            case 'SpeedNotify':
                {
                    if (received_obj.On) { stateSet.speed.add(received_obj.Key); }
                    else { stateSet.speed.clear(received_obj.Key); }
                }; break;
            case 'AttackNotify':
                {
                    if (received_obj.On) { stateSet.attck.add(received_obj.Key); }
                    else { stateSet.attck.clear(received_obj.Key); }
                }; break;
            case 'DefenceNotify':
                {
                    if (received_obj.On) { stateSet.defend.add(received_obj.Key); }
                    else { stateSet.defend.clear(received_obj.Key); }
                }; break;
            case 'ViewSearch':
                {
                    var animationData =
                    {
                        old: {
                            x: objMain.controls.target.x,
                            y: objMain.controls.target.y,
                            z: objMain.controls.target.z,
                            t: Date.now()
                        },
                        newT:
                        {
                            x: received_obj.mctX,
                            y: objMain.controls.target.y,
                            z: 0 - received_obj.mctY,
                            t: Date.now() + 3000
                        }
                    };
                    objMain.camaraAnimateData = animationData;
                }; break;
            case 'ConfusePrepareNotify':
                {
                    if (received_obj.On) {
                        stateSet.control.clear(received_obj.Key);
                        var animateData = { startX: received_obj.StartX / 256, startY: objMain.controls.target.y, startZ: received_obj.StartY / -256, start: Date.now(), endX: received_obj.EndX / 256, endY: objMain.controls.target.y, endZ: received_obj.EndY / -256 };
                        stateSet.confusePrepare.add(received_obj.Key, animateData);
                    }
                }; break;
            case 'LostPrepareNotify':
                {
                    if (received_obj.On) {
                        stateSet.control.clear(received_obj.Key);
                        var animateData = { startX: received_obj.StartX / 256, startY: objMain.controls.target.y, startZ: received_obj.StartY / -256, start: Date.now(), endX: received_obj.EndX / 256, endY: objMain.controls.target.y, endZ: received_obj.EndY / -256 };
                        stateSet.lostPrepare.add(received_obj.Key, animateData);
                    }
                }; break;
            case 'AmbushPrepareNotify':
                {
                    if (received_obj.On) {
                        stateSet.control.clear(received_obj.Key);
                        var animateData = { startX: received_obj.StartX / 256, startY: objMain.controls.target.y, startZ: received_obj.StartY / -256, start: Date.now(), endX: received_obj.EndX / 256, endY: objMain.controls.target.y, endZ: received_obj.EndY / -256 };
                        stateSet.ambusePrepare.add(received_obj.Key, animateData);
                    }
                }; break;
            case 'ControlPrepareNotify':
                {
                    if (received_obj.On) {
                    }
                    else {
                        // stateSet.confusePrepare.clear(received_obj.Key);
                        stateSet.control.clear(received_obj.Key);
                    }
                }; break;
            case 'LoseNotify':
                {
                    if (received_obj.On) { stateSet.lost.add(received_obj.Key); }
                    else { stateSet.lost.clear(received_obj.Key); }
                }; break;
            case 'ConfuseNotify':
                {
                    if (received_obj.On) { stateSet.confuse.add(received_obj.Key); }
                    else { stateSet.confuse.clear(received_obj.Key); }
                }; break;
            case 'FireNotify':
                {
                    stateSet.fire.add(received_obj.targetRoleID, received_obj.actionRoleID);
                }; break;
            case 'WaterNotify':
                {
                    stateSet.water.add(received_obj.targetRoleID, received_obj.actionRoleID);
                }; break;
            case 'ElectricNotify':
                {
                    stateSet.lightning.add(received_obj.targetRoleID, received_obj.actionRoleID);
                }; break;
            case 'ShowDirectionOperator':
                {
                    DirectionOperator.show(received_obj);
                }; break;
            case 'ModelDataShow':
                {
                    var modelDataShow = received_obj;
                    objMain.buildingData.dModel[modelDataShow.modelID] = modelDataShow;
                    BuildingModelObj.Refresh();
                    //BuildingModelObj.f(modelDataShow);

                }; break;
            case 'ModelDataShow_Whether_Existed':
                {
                    var modelDataShow = received_obj;
                    BuildingModelObj.respon(modelDataShow)

                }; break;
            case 'ReceiveResult':
                {
                    console.log('ReceiveResult', received_obj);
                    var modelDataShow = received_obj;
                    objMain.transtractionData = { x: received_obj.x, y: received_obj.y, z: received_obj.z };
                    //BuildingModelObj.f(modelDataShow);
                    setTransactionHtml.editRootContainer();
                    setTransactionHtml.drawAddr(received_obj.bussinessAddress);
                    setTransactionHtml.drawAgreementEditor();
                    setTransactionHtml.drawStockTable();
                    setTransactionHtml.drawTradeTable();
                    setTransactionHtml.originalTable();
                    transactionBussiness().showAuthor(received_obj.author);
                    operatePanel.refresh();
                }; break;
            case 'TradeDetail':
                {
                    var addrStr = received_obj.addr;
                    var valueStr = received_obj.value;
                    var indexStr = received_obj.index;
                    transactionBussiness().addOriginItem(addrStr, valueStr);
                    // objMain.ws.send(indexStr);
                }; break;
            case 'TradeDetail2':
                {
                    var mainAddr = received_obj.mainAddr;
                    var agreeMent = received_obj.agreeMent;
                    var sign = received_obj.sign;
                    //  var indexStr = received_obj.index;
                    transactionBussiness().addTradeItem(mainAddr, agreeMent, sign);
                    // objMain.ws.send(indexStr);
                }; break;
            case 'TradeDetail3':
                {
                    var detail = received_obj.detail;
                    //  detail = [];

                    var addrStr = received_obj.addrStr;
                    var valueStr = received_obj.valueStr;
                    // var indexStr = received_obj.indexStr;
                    var percentValue = received_obj.percentValue;
                    transactionBussiness().addStockItem(addrStr, valueStr, percentValue);
                    // objMain.ws.send(indexStr);
                }; break;
            case 'ShowAgreement':
                {
                    transactionBussiness().showAgreement(received_obj.agreement);
                }; break;
            case 'ShowAgreementMsg':
                {
                    $.notify(received_obj.msg, 'error');
                    GuidObj.charging.showNotifyMsg(received_obj.msg);
                    reward.notifyMsg(received_obj.msg);
                    transactionBussiness().showErrMsg(received_obj.msg);
                }; break;
            case 'ShowAllPts':
                {
                    //   transactionBussiness().ShowAllPts(received_obj.list);
                }; break;
            case 'ClearTradeInfomation':
                {
                    transactionBussiness().ClearItem();
                    objMain.ws.send('ClearTradeInfomation');
                }; break;
            case 'SetCrossBG':
                {
                    objMain.background.changeWhenIsCross(received_obj);
                }; break;
            case 'BustStateNotify':
                {
                    if (objMain.indexKey == received_obj.KeyBust) {
                        SetBustPage();
                    }
                }; break;
            case 'GoodsSelectionNotify':
                {
                    /*
                     * 建筑物的画线
                     */
                    drawGoodsSelection.f(received_obj);
                }; break;
            case 'ResistanceDisplay':
                {
                    resistance.display(received_obj);
                }; break;
            case 'ResistanceDisplay2':
                {
                    resistance.display2(received_obj);
                }; break;
            case 'SelectionIsWrong':
                {
                    moneyAbsorb.copyModel(received_obj.reduceValue);
                    DirectionOperator.showWhenIsWrong(received_obj.postionCrossKey);
                    operatePanel.refresh();
                    //objMain.se
                }; break;
            case 'DrawTarget':
                {
                    //绘制目标黄色圆圈。
                    targetShow.draw(received_obj.x, received_obj.y, received_obj.h * objMain.heightAmplify);
                }; break;
            case 'addOption':
                {
                    var id = received_obj.id;
                    var op = document.createElement('option');
                    op.value = received_obj.value;
                    op.innerText = received_obj.value;
                    document.getElementById(id).add(op);
                    //addOption
                    //document.getElementById('buidingAddrForAddReward').add();
                }; break;
            case 'ShowRewardAgreement':
                {
                    reward.showAgreement(received_obj.agreement);
                }; break;
            case 'GetRewardInfomationHasNotResult':
                {
                    reward.hasNoData(received_obj.title);
                }; break;
            case 'GetRewardInfomationHasResult':
                {
                    //reward.hasData(received_obj.title, received_obj.data, received_obj.list, received_obj.indexNumber);
                    // alert('有数据');
                    reward.hasData(received_obj.title, received_obj.data, received_obj.array, received_obj.forwardArray, received_obj.indexNumber);
                }; break;
            case 'VerifyCodePic':
                {
                    localStorage['nyrqVerifyImg'] = received_obj.base64String;
                    GuidObj.charging.SetImage(received_obj.base64String);
                }; break;
            case 'ElectricMarkNotify':
                {
                    stateSet.lightning.mark.add(received_obj.lineParameter);
                }; break;
            case 'WaterMarkNotify':
                {
                    stateSet.water.mark.add(received_obj.lineParameter);
                }; break;
            case 'FireMarkNotify':
                {
                    stateSet.fire.mark.add(received_obj.lineParameter);
                }; break;
            case 'GetFightSituationResult':
                {
                    dialogSys.ShowFightSituation(received_obj);
                }; break;
            case 'GetTaskCopyResult':
                {
                    dialogSys.drawPanelOfTaskCoyp(received_obj.Detail);
                }; break;
            case 'BradCastPromoteDiamondOnCar':
                {
                    stateSet.diamond.add(received_obj.roleID, received_obj.pType);
                }; break;
            case 'SetParameterIsLogin':
                {
                    objMain.stateNeedToChange.isLogin = true;
                    subsidizeSys.removeBtnsGuid();
                }; break;
            case 'SetParameterHasNewTask':
                {
                    objMain.stateNeedToChange.HasNewTask = true;
                    dialogSys.AlertNewTask();
                }; break;
            case 'ClearSession':
                {
                    objMain.ws.send('ClearSession');
                    if (sessionStorage['session'] == undefined) {

                    }
                    else {
                        delete sessionStorage.session;
                        //objMain.ws.send('ClearSession');

                        //location.reload();
                    }
                    window.localStorage.removeItem('session');
                    //stateNeedToChange:
                    //{
                    //    'isLogin': false,
                    //        'HasNewTask': false
                    //}
                }; break;
            case 'SetOnLineState':
                {
                    dialogSys.dealWithOnLine(received_obj);
                }; break;
            case 'SetMaterial':
                {
                    var carName = 'car_' + received_obj.Key;
                    var car = objMain.carGroup.getObjectByName(carName);
                    if (car != null && car != undefined) {
                        var material = car.children[0].material;
                        var newM = material.clone();
                        var textureData = 'data:image/png;base64,' + received_obj.Base64;
                        var texture = new THREE.TextureLoader().load(textureData);
                        newM.map = texture;
                        for (var i = 0; i < 5; i++) {
                            car.children[i].material = newM;

                        }
                        newM.needsUpdate = true;
                    }
                }; break;
            case 'BradCastWhetherGoTo':
                {
                    whetherGo.obj = received_obj;
                    whetherGo.show(received_obj.msg);
                    objMain.targetMusic.change(received_obj.musicID);
                }; break;
            case 'BradCastWhereToGoInSmallMap':
                {
                    /*received_obj.base64 =*/
                    if (received_obj.isFineshed) {
                        if (received_obj.base64 == "") {
                            whetherGo.obj = JSON.parse(JSON.stringify(received_obj));
                            received_obj.data = [];
                            objMain.ws.send(JSON.stringify(received_obj));
                        }
                        else {
                            whetherGo.obj.base64 = received_obj.base64;
                            whetherGo.show2();
                            smallMapClass.draw2(whetherGo.obj);

                        }
                    }
                    else {
                        smallMapClass.draw(received_obj);
                        whetherGo.obj = received_obj;
                        whetherGo.show2();

                        if (received_obj.Live) {

                        }
                        //if (document.getElementById(douyinPanleShow.operateAddress) != null) {
                        //    whetherGo.minus();
                        //}
                    }
                }; break;
            case 'TeamStartFailed':
                {
                    creatTeamObj.teamStartFailed();
                }; break;
            case 'BradCastDouyinReward1':
                {
                    douyinPanleShow.add(received_obj.DetailInfo);
                }; break;
            case 'BradCastAllDouyinPlayerIsWaiting':
                {
                    douyinPanleShow.add2(received_obj.DetailInfo);
                }; break;
            case 'BradCastDouyinPlayerIsWaiting':
                {
                    douyinPanleShow.add3(received_obj);
                }; break;
            case 'DouyinAdviseSelect':
                {
                    DirectionOperator.AdviseSelect(received_obj);
                }; break;
            case 'DouyinZoomIn':
                {
                    objMain.controls.dollyOut(0.8);
                    objMain.controls.update();
                }; break;
            case 'DouyinZoomOut':
                {
                    objMain.controls.dollyOut(1.2);
                    objMain.controls.update();
                }; break;
            case 'DouyinRotateLeft':
                {
                    objMain.controls.rotateLeft(Math.PI / 12);
                    objMain.controls.update();
                }; break;
            case 'DouyinRotateRight': {
                objMain.controls.rotateLeft(-Math.PI / 12);
                objMain.controls.update();
            }; break;
            case 'DouyinRotateHigh': {
                objMain.controls.rotateUp(Math.PI / 30)
                objMain.controls.update();
            }; break;
            case 'DouyinRotateLow': {
                objMain.controls.rotateUp(-Math.PI / 30)
                objMain.controls.update();
            }; break;
            case 'MarketFlag':
                {
                    douyinPanleShow.drawFlag(received_obj);
                }; break;
            case 'MarketFlags':
                {
                    douyinPanleShow.drawFlags(received_obj);
                }; break;
            case 'ResistanceDisplay_V3':
                {
                    resistance.display_V3(received_obj);
                }; break;
            case 'ChargingLookFor.Result':
                {
                    GuidObj.chargingLookingfor.addTabel(received_obj);
                }; break;
            case 'ScoreTransferLookFor.OutputScoreResult':
                {
                    GuidObj.scoreTransferLookingfor.addTabelOutput(received_obj);
                }; break;
            case 'ScoreTransferLookFor.InputScoreResult':
                {
                    GuidObj.scoreTransferLookingfor.addTabelInput(received_obj);
                }; break;
            case 'NitrogenValueNotify':
                {
                    stateSet.nitrogeneffect.showVisible(received_obj.NitrogenValue);
                }; break;
            case 'ShowRoadCrossSelectionsOperator':
                {
                    ShowRoadCrossSelectionsOperator.show(received_obj);
                }; break;
            case 'CollectCountNotify':
                {
                    stateSet.coinIcon.addWithKey(received_obj.Key, received_obj.Count);
                }; break;
            case 'SetPlayerNameSuccess':
                {
                    localStorage.playerName = received_obj.playerName;
                }; break;
            case 'StockScoreNotify':
                {
                    setTransactionHtml.editAgreementPanelWhenTransactionWithScore(received_obj);
                }; break;
            default:
                {
                    console.log('命令未注册', received_obj.c + "__没有注册。");
                }; break;
        }
        moneyOperator.updateSaveMoneyNotify();
    },
    diamondPrice:
    {
        'mile': 0,
        'business': 0,
        'volume': 0,
        'speed': 0
    },
    driver:
    {
        driverIndex: -1,
        sex: null,
        name: '',
        skill1: { name: '', skillIndex: -1 },
        skill2: { name: '', skillIndex: -1 },
        race: ''
    },
    camaraAnimateData: null,
    transtractionData: null,
    trade:
    {
        'countPerOperate': 1
    },
    animateObj: null,
    pingTime: 0,
    heightAmplify: 5,
    heightLevel: 0,
    stateNeedToChange:
    {
        'isLogin': false,
        'HasNewTask': false
    },
    buildingData: {
        aModel: {},
        dModel: {}
    },
    selection: {
        first: -1, isZooming: false, initialize: function (msg2) {
            objMain.selection.first = -1;
            objMain.selection.isZooming = false;
            currentSelectionPreparationShow.updateFrequency('');
            if (msg2 == undefined)
                operateStateShow.update('');
            else
                operateStateShow.update(msg2);
        }
    },
    animateParameter:
    {
        loopCount: 0
    },
    groupNumber: -1,
    jscwObj: null,
    diceRotating: false
};
var startA = function () {
    var connected = false;
    var wsConnect = '';
    switch (objMain.debug) {
        case 0:
            {
                var r = prompt('输入选项', 'A');
                switch (r) {
                    case 'A':
                        {
                            wsConnect = 'ws://127.0.0.1:17001/mahjong';
                        }; break;
                    case 'B':
                        {
                            wsConnect = 'ws://127.0.0.1:11002/mahjong';
                        }; break;
                    default:
                        {
                            wsConnect = 'ws://127.0.0.1:11001/mahjong';
                        }
                }

            }; break;
        case 1:
            {
                wsConnect = 'ws://192.168.0.112:11001/mahjong';
            }; break;
        default:
            {
                wsConnect = 'wss://www.nyrq123.com/websocket' + window.location.pathname.split('/')[1] + '/';
            }; break;
    }


    var ws = new WebSocket(wsConnect);
    ws.onopen = function () {
        {
            var session = '';
            if (sessionStorage['session'] == undefined) {
                if (window.localStorage.getItem('notSaveSession') == null) {
                    session = window.localStorage.getItem('session');
                    if (session == null || session == undefined) {
                        session = '';
                    }
                    else {
                        sessionStorage['session'] = session;
                    }
                }
            }
            else {
                session = sessionStorage['session'];
            }
            ws.send(JSON.stringify({ c: 'CheckSession', session: session, RefererAddr: nyrqUrl.get() }));
            objMain.clicktrail = clicktrail.initialize();
            objMain.jscwObj = new jscw({ "wpm": 17 });
        }
        //   alert("数据发送中...");
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        //console.log(evt.data);
        var received_obj = JSON.parse(evt.data);
        objMain.dealWithReceivedObj(received_obj, evt, received_msg);
    };
    ws.onclose = function () {
        // 关闭 websocket
        alert("连接已关闭...不要慌，千万不要退出。点击确认后，刷新网页，重新连接");
        connectionBroken();

    };
    objMain.ws = ws;
    $.notify.addStyle('happyblue', {
        html: "<div><span data-notify-text/></div>",
        classes: {
            base: {
                "opacity": "0.85",
                "width": "90%",
                "max-width": "90%",
                "background": "#F5F5F5",
                "padding": "5px",
                "border- radius": "10px"
            },
            superblue: {
                "opacity": "0.85",
                "width": "90%",
                "max-width": "90%",
                "background": "#F5F5F5",
                "padding": "5px",
                "border- radius": "10px"
            }
        }
    });
}
startA();
window.requestAnimationFrame =
    window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;

var lastTime = 0;
var deltaTime = 0;
var targetFPS = 60; // 目标帧率
function animate() {
    {
        var currentTime = Date.now()
        deltaTime = currentTime - lastTime;

        objMain.animateObj = requestAnimationFrame(animate);
        if (deltaTime > 1000 / targetFPS) {
            lastTime = currentTime;
        }
        else { return; }

        if (objMain.state != objMain.receivedState) {
            objMain.state = objMain.receivedState;
        }
        switch (objMain.state) {
            case 'OnLine':
                {
                    objMain.animateParameter.loopCount++;
                    const lengthOfCC = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target);
                    var deltaYOfSelectObj = 0;
                    deltaYOfSelectObj = animateDetailF.moveCamara(lengthOfCC);
                    for (var i = 0; i < objMain.collectGroup.children.length; i++) {
                        /*
                         * 初始化人民币的大小
                         */

                        if (objMain.collectGroup.children[i].isGroup) {
                            //if (objMain.Task.state == 'collect') {
                            //    var scale = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) / 1226;
                            //    objMain.collectGroup.children[i].scale.set(scale, scale, scale);
                            //}
                            //else
                            {
                                var scale = 0.020;//; objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) / 1840;
                                objMain.collectGroup.children[i].scale.set(scale, scale, scale);
                            }
                            objMain.collectGroup.children[i].rotation.set(-Math.PI / 2, 0, Date.now() % 30000 / 30000 * Math.PI * 2);
                            //  objMain.collectGroup.children[i].position.y = 0;
                        }
                    }

                    for (var i = 0; i < objMain.fightSituationGroup.children.length; i++) {
                        /*
                         * 初始化态势标志大小
                         */
                        if (objMain.fightSituationGroup.children[i].isGroup) {
                            var scale = lengthOfCC / 8;//; objMain.mainF.getLength(objMain.camera.position, objMain.controls.target) / 1840;
                            objMain.fightSituationGroup.children[i].scale.set(scale, scale, scale);
                            objMain.fightSituationGroup.children[i].rotation.y = Date.now() % 5000 / 5000 * Math.PI * 2;
                        }
                    }

                    for (var i = 0; i < objMain.playerGroup.children.length; i++) {
                        /*
                         * 初始化 旗帜的大小
                         */

                        if (objMain.playerGroup.children[i].isMesh) {
                            {
                                objMain.playerGroup.children[i].scale.set(0.0015, 0.0015, 0.0015);
                                // objMain.playerGroup.children[i].position.y = 0.1;
                                stateSet.defend.Animate(objMain.playerGroup.children[i].name.split('_')[1]);
                                stateSet.confusePrepare.Animate(objMain.playerGroup.children[i].name.split('_')[1]);
                                stateSet.lostPrepare.Animate(objMain.playerGroup.children[i].name.split('_')[1]);
                                stateSet.ambusePrepare.Animate(objMain.playerGroup.children[i].name.split('_')[1]);
                                stateSet.water.Animate(objMain.playerGroup.children[i].name.split('_')[1]);

                                //  stateSet.lightning.Animate(objMain.playerGroup.children[i].name.split('_')[1]);
                            }
                        }
                    }

                    if (objMain.diceRotating) {
                        //  objMain
                        objMain.diceGroup.getObjectByName('dice1').rotation.set((Date.now() % 200 / 100) * Math.PI, (Date.now() % 300 / 150) * Math.PI, (Date.now() % 160 / 80) * Math.PI, 'YZX');
                        objMain.diceGroup.getObjectByName('dice2').rotation.set((Date.now() % 400 / 200) * Math.PI, (Date.now() % 600 / 350) * Math.PI, (Date.now() % 250 / 125) * Math.PI, 'YZX');
                        // objMain.diceGroup.getObjectByName('dice2').rotation.set((Date.now() % 400 / 200) * Math.PI, (Date.now() % 600 / 350) * Math.PI, (Date.now() % 250 / 125) * Math.PI, 'YZX');
                        objMain.diceGroup.getObjectByName('dice2').position.x = 0.03 + 0.01 + Math.sin((Date.now() % 400 / 200) * Math.PI) * 0.01;
                        //  objMain.diceGroup.rotation.set(0.8, 0, 0)
                    }
                    {
                        var lengthOfObjs = objMain.groupOfOperatePanle.children.length;
                        for (var i = lengthOfObjs - 1; i >= 0; i--) {
                            objMain.groupOfOperatePanle.remove(objMain.groupOfOperatePanle.children[i]);
                        }
                    }
                    if (objMain.canSelect) {

                        var objMainTaskstate = '';
                        var scale = 0.01;
                        objMain.raycasterOfSelector.setFromCamera(objMain.selectorPosition, objMain.camera);
                        var selectObj = null;
                        var maxCosA = -1;
                        {
                            for (var i = 0; i < objMain.collectGroup.children.length; i++) {
                                if (objMain.collectGroup.children[i].isGroup) {
                                    var position = objMain.collectGroup.children[i].position;
                                    var d = new THREE.Vector3(position.x - objMain.camera.position.x, position.y - objMain.camera.position.y, position.z - objMain.camera.position.z);
                                    var cosA = objMain.raycasterOfSelector.ray.direction.dot(d) / d.length() / objMain.raycasterOfSelector.ray.direction.length();
                                    if (cosA > 0.984807753)
                                        if (cosA > maxCosA) {
                                            maxCosA = cosA;
                                            objMainTaskstate = 'collect';
                                            selectObj = objMain.collectGroup.children[i];
                                            scale = 0.01 * objMain.mainF.getLength(objMain.camera.position, position) / 10;
                                            scale = Math.max(scale, 0.03);
                                        }
                                }
                            }

                            for (var i = 0; i < objMain.playerGroup.children.length; i++) {
                                if (objMain.playerGroup.children[i].isMesh) {
                                    //flag_d59195aa49213765a72fdff81b1e18c6
                                    if (objMain.playerGroup.children[i].name.split('_')[1] == objMain.indexKey) {
                                        var position = objMain.playerGroup.children[i].position;
                                        var d = new THREE.Vector3(position.x - objMain.camera.position.x, position.y - objMain.camera.position.y, position.z - objMain.camera.position.z);
                                        var cosA = objMain.raycasterOfSelector.ray.direction.dot(d) / d.length() / objMain.raycasterOfSelector.ray.direction.length();
                                        if (cosA > 0.984807753)
                                            if (cosA > maxCosA) {
                                                maxCosA = cosA;
                                                objMainTaskstate = 'setReturn';
                                                selectObj = objMain.playerGroup.children[i];
                                                scale = 0.0025 * objMain.mainF.getLength(objMain.camera.position, position) / 10;
                                                scale = Math.max(scale, 0.0015);
                                            }
                                    }
                                    else {
                                        var position = objMain.playerGroup.children[i].position;
                                        var d = new THREE.Vector3(position.x - objMain.camera.position.x, position.y - objMain.camera.position.y, position.z - objMain.camera.position.z);
                                        var cosA = objMain.raycasterOfSelector.ray.direction.dot(d) / d.length() / objMain.raycasterOfSelector.ray.direction.length();
                                        if (cosA > 0.984807753)
                                            if (cosA > maxCosA) {
                                                maxCosA = cosA;
                                                objMainTaskstate = 'attack';
                                                selectObj = objMain.playerGroup.children[i];
                                                scale = 0.0025 * objMain.mainF.getLength(objMain.camera.position, position) / 10;
                                                scale = Math.max(scale, 0.0015);
                                            }
                                    }
                                }
                            }

                            for (var i = 0; i < objMain.promoteDiamond.children.length; i++) {
                                if (objMain.promoteDiamond.children[i].isMesh) {
                                    {
                                        var position = objMain.promoteDiamond.children[i].position;
                                        var d = new THREE.Vector3(position.x - objMain.camera.position.x, position.y - objMain.camera.position.y, position.z - objMain.camera.position.z);
                                        var cosA = objMain.raycasterOfSelector.ray.direction.dot(d) / d.length() / objMain.raycasterOfSelector.ray.direction.length();
                                        if (cosA > 0.984807753)
                                            if (cosA > maxCosA) {
                                                maxCosA = cosA;
                                                selectObj = objMain.promoteDiamond.children[i];
                                                scale = objMain.mainF.getLength(objMain.camera.position, position) / 20;
                                                scale = Math.max(scale, 0.2);
                                                //  scale = Math.min(scale, 2);
                                                switch (selectObj.name) {
                                                    case 'diamond_mile':
                                                        {
                                                            objMainTaskstate = 'mile';
                                                        }; break;
                                                    case 'diamond_business':
                                                        {
                                                            objMainTaskstate = 'business';
                                                        }; break;
                                                    case 'diamond_volume':
                                                        {
                                                            objMainTaskstate = 'volume';
                                                        }; break;
                                                    case 'diamond_speed':
                                                        {
                                                            objMainTaskstate = 'speed';
                                                        }; break;
                                                    default: { }; break;
                                                }
                                            }
                                    }
                                }
                            }

                            for (var i = 0; i < objMain.buildingGroup.children.length; i++) {
                                if (objMain.buildingGroup.visible) {
                                    var position = objMain.buildingGroup.children[i].position;
                                    var d = new THREE.Vector3(position.x - objMain.camera.position.x, position.y - objMain.camera.position.y, position.z - objMain.camera.position.z);
                                    var cosA = objMain.raycasterOfSelector.ray.direction.dot(d) / d.length() / objMain.raycasterOfSelector.ray.direction.length();
                                    if (cosA > 0.984807753)
                                        if (cosA > maxCosA) {
                                            maxCosA = cosA;
                                            objMainTaskstate = 'building';
                                            selectObj = objMain.buildingGroup.children[i];
                                        }
                                }
                            }

                            // if (objMain.carState.car == 'waitAtBaseStation')
                            // if (lengthOfCC < 3)
                            for (var i = 0; i < objMain.columnGroup.children.length; i++) {
                                if (objMain.columnGroup.children[i].isMesh) {
                                    {
                                        var position = objMain.columnGroup.children[i].position;
                                        var d = new THREE.Vector3(position.x - objMain.camera.position.x, position.y - objMain.camera.position.y, position.z - objMain.camera.position.z);
                                        var cosA = objMain.raycasterOfSelector.ray.direction.dot(d) / d.length() / objMain.raycasterOfSelector.ray.direction.length();
                                        if (cosA > 0.984807753)
                                            if (cosA > maxCosA) {
                                                maxCosA = cosA;
                                                if (objMain.carState.car == 'waitAtBaseStation')
                                                    if (lengthOfCC < 4) {
                                                        selectObj = objMain.columnGroup.children[i];
                                                        switch (selectObj.name) {
                                                            case 'BatteryMile':
                                                                {
                                                                    objMainTaskstate = 'ability';
                                                                }; break;
                                                            case 'BatteryBusiness':
                                                                {
                                                                    objMainTaskstate = 'ability';
                                                                }; break;
                                                            case 'BatteryVolume':
                                                                {
                                                                    objMainTaskstate = 'ability';
                                                                }; break;
                                                            case 'BatterySpeed':
                                                                {
                                                                    objMainTaskstate = 'ability';
                                                                }; break;
                                                            default: { }; break;
                                                        }
                                                    }
                                                    else {
                                                        selectObj = objMain.playerGroup.getObjectByName('flag_' + objMain.indexKey);
                                                        objMainTaskstate = 'setReturn';
                                                        scale = 0.0025 * objMain.mainF.getLength(objMain.camera.position, position) / 10;
                                                        scale = Math.max(scale, 0.0015);
                                                    }
                                                else {
                                                    selectObj = objMain.playerGroup.getObjectByName('flag_' + objMain.indexKey);
                                                    objMainTaskstate = 'setReturn';
                                                    scale = 0.0025 * objMain.mainF.getLength(objMain.camera.position, position) / 10;
                                                    scale = Math.max(scale, 0.0015);
                                                }
                                            }
                                    }
                                }
                            }
                            objMain.Task.state = objMainTaskstate;
                            switch (objMain.Task.state) {
                                case 'collect':
                                    {
                                        selectObj.scale.set(scale, scale, scale);
                                        objMain.selectObj.obj = selectObj;
                                        objMain.selectObj.type = objMain.Task.state;
                                        selectObj.rotation.set(-Math.PI / 2, 0, Date.now() % 6000 / 6000 * Math.PI * 2);
                                        {
                                            var collectPosition = selectObj.userData.collectPosition;
                                            var element = document.createElement('div');
                                            element.style.width = '10em';
                                            element.style.marginTop = '3em';
                                            var color = '#ff0000';
                                            element.style.border = '2px solid ' + color;
                                            element.style.borderTopLeftRadius = '0.5em';
                                            element.style.backgroundColor = 'rgba(245, 255, 179, 0.9)';
                                            element.style.color = '#1504f6';

                                            var div2 = document.createElement('div');
                                            div2.style.fontSize = '0.5em';

                                            var b = document.createElement('b');
                                            b.innerHTML = '到' + collectPosition.Fp.region + '[<span style="color:#02020f">' + collectPosition.Fp.FastenPositionName + '</span>]回收<span style="color:#02020f">' + (collectPosition.collectMoney).toFixed(2) + '元</span>现金。';
                                            div2.appendChild(b);

                                            element.appendChild(div2);

                                            var object = new THREE.CSS2DObject(element);
                                            var fp = collectPosition.Fp;
                                            object.position.set(MercatorGetXbyLongitude(fp.Longitude), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.Latitde));

                                            objMain.groupOfOperatePanle.add(object);
                                        }
                                    }; break;
                                case 'ability':
                                    {
                                        objMain.selectObj.obj = selectObj;
                                        objMain.selectObj.type = objMain.Task.state;
                                        selectObj.scale.setX((Date.now() % 2000 / 2000) + 1);
                                        selectObj.scale.setZ((Date.now() % 2000 / 2000) + 1);
                                        {
                                            var element = document.createElement('div');
                                            element.style.width = '10em';
                                            element.style.marginTop = '3em';
                                            var color = '#ff0000';
                                            element.style.border = '2px solid ' + color;
                                            element.style.borderTopLeftRadius = '0.5em';
                                            element.style.backgroundColor = 'rgba(245, 255, 179, 0.9)';
                                            element.style.color = '#1504f6';

                                            var div2 = document.createElement('div');
                                            div2.style.fontSize = '0.5em';

                                            var b = document.createElement('b');
                                            switch (selectObj.name) {
                                                case 'BatteryMile':
                                                    {
                                                        b.innerHTML = '红宝石市价:' + (objMain.diamondPrice.mile / 100.0).toFixed(2) + "银两。用其提升最大里程。你有"
                                                            + objMain.PromoteDiamondCount.mile + '块';

                                                    }; break;
                                                case 'BatteryBusiness':
                                                    {
                                                        b.innerHTML = '绿宝石市价:' + (objMain.diamondPrice.business / 100.0).toFixed(2) + "银两。用其提升最大业务能力。你有"
                                                            + objMain.PromoteDiamondCount.business + '块';
                                                    }; break;
                                                case 'BatteryVolume':
                                                    {
                                                        b.innerHTML = '蓝宝石市价:' + (objMain.diamondPrice.volume / 100.0).toFixed(2) + "银两。用其提升最大收集能力。你有"
                                                            + objMain.PromoteDiamondCount.volume + '块';
                                                    }; break;
                                                case 'BatterySpeed':
                                                    {
                                                        b.innerHTML = '黑宝石市价:' + (objMain.diamondPrice.speed / 100.0).toFixed(2) + "银两。用其提升速度。你有"
                                                            + objMain.PromoteDiamondCount.speed + '块';
                                                    }; break;
                                            }

                                            div2.appendChild(b);

                                            element.appendChild(div2);

                                            var object = new THREE.CSS2DObject(element);
                                            //  var fp = collectPosition.Fp;
                                            object.position.set(selectObj.position.x, selectObj.position.y, selectObj.position.z);

                                            objMain.groupOfOperatePanle.add(object);
                                        }
                                    }; break;
                                case 'setReturn':
                                    {
                                        selectObj.scale.set(scale, scale, scale);
                                        objMain.selectObj.obj = selectObj;
                                        objMain.selectObj.type = objMain.Task.state;
                                        selectObj.rotation.set(-Math.PI / 2, 0, Date.now() % 300 / 300 * Math.PI * 2);
                                        {
                                            var element = document.createElement('div');
                                            element.style.width = '10em';
                                            element.style.marginTop = '3em';
                                            var color = '#ff0000';
                                            element.style.border = '2px solid ' + color;
                                            element.style.borderTopLeftRadius = '0.5em';
                                            element.style.backgroundColor = 'rgba(245, 255, 179, 0.9)';
                                            element.style.color = '#1504f6';

                                            var div2 = document.createElement('div');
                                            div2.style.fontSize = '0.5em';

                                            var b = document.createElement('b');
                                            b.innerHTML = '回到基地->' + objMain.basePoint.FastenPositionName + '(' + objMain.basePoint.Longitude.toFixed(2) + ',' + objMain.basePoint.Latitde.toFixed(2) + ')';
                                            div2.appendChild(b);

                                            element.appendChild(div2);

                                            var object = new THREE.CSS2DObject(element);
                                            //  var fp = collectPosition.Fp;
                                            object.position.set(selectObj.position.x, selectObj.position.y, selectObj.position.z);

                                            objMain.groupOfOperatePanle.add(object);
                                        }
                                    }; break;
                                case 'attack':
                                    {
                                        selectObj.scale.set(scale, scale, scale);
                                        objMain.selectObj.obj = selectObj;
                                        objMain.selectObj.type = objMain.Task.state;
                                        selectObj.rotation.set(-Math.PI / 2, 0, Date.now() % 300 / 300 * Math.PI * 2);
                                        {
                                            var element = document.createElement('div');
                                            element.style.width = '10em';
                                            element.style.marginTop = '3em';
                                            var color = '#ff0000';
                                            element.style.border = '2px solid ' + color;
                                            element.style.borderTopLeftRadius = '0.5em';
                                            element.style.backgroundColor = 'rgba(245, 255, 179, 0.9)';
                                            element.style.color = '#1504f6';

                                            var div2 = document.createElement('div');
                                            div2.style.fontSize = '0.5em';

                                            var b = document.createElement('b');

                                            var customTagIndexKey = selectObj.name.substring(5);
                                            if (objMain.othersBasePoint[customTagIndexKey] == undefined)
                                                b.innerHTML = '攻击';
                                            else {
                                                if (objMain.othersBasePoint[customTagIndexKey].isNPC) {
                                                    //b.innerHTML = '[NPC]->到';
                                                    b.innerHTML = b.innerHTML = '到(' + objMain.othersBasePoint[customTagIndexKey].basePoint.region + ')'
                                                        + objMain.othersBasePoint[customTagIndexKey].basePoint.FastenPositionName
                                                        + '(' + objMain.othersBasePoint[customTagIndexKey].basePoint.Longitude.toFixed(2) + ','
                                                        + objMain.othersBasePoint[customTagIndexKey].basePoint.Latitde.toFixed(2) + ')攻击NPC'
                                                        + '【' + objMain.othersBasePoint[customTagIndexKey].playerName + '】'
                                                        + '(' + objMain.othersBasePoint[customTagIndexKey].Level + '级)';

                                                }
                                                else if (objMain.othersBasePoint[customTagIndexKey].isPlayer) {
                                                    b.innerHTML = '到(' + objMain.othersBasePoint[customTagIndexKey].basePoint.region + ')'
                                                        + objMain.othersBasePoint[customTagIndexKey].basePoint.FastenPositionName
                                                        + '(' + objMain.othersBasePoint[customTagIndexKey].basePoint.Longitude.toFixed(2) + ','
                                                        + objMain.othersBasePoint[customTagIndexKey].basePoint.Latitde.toFixed(2) + ')攻击玩家'
                                                        + '【' + objMain.othersBasePoint[customTagIndexKey].playerName + '】'
                                                        + '(' + objMain.othersBasePoint[customTagIndexKey].Level + '级)';
                                                }
                                                else {
                                                    b.innerHTML = '攻击';
                                                }
                                            }
                                            div2.appendChild(b);

                                            element.appendChild(div2);

                                            var object = new THREE.CSS2DObject(element);
                                            //  var fp = collectPosition.Fp;
                                            object.position.set(selectObj.position.x, selectObj.position.y, selectObj.position.z);

                                            objMain.groupOfOperatePanle.add(object);
                                        }
                                    }; break;
                                case 'mile':
                                case 'business':
                                case 'volume':
                                case 'speed':
                                    {
                                        objMain.selectObj.obj = selectObj;
                                        objMain.selectObj.type = objMain.Task.state;

                                        selectObj.scale.set(scale, scale * 1.1, scale);

                                        var fp = selectObj.userData.Fp;//
                                        var baseY = MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify;
                                        selectObj.position.y = baseY + Math.sin(Date.now() % 3000 / 3000 * Math.PI) * scale / 4;
                                        selectObj.rotation.y = (Date.now() % 8000 / 8000) * Math.PI * 2;
                                        //objMain.ws.send(JSON.stringify({ 'c': 'Promote', 'pType': objMain.Task.state }));
                                    }; break;

                                case 'building':
                                    {
                                        objMain.selectObj.obj = selectObj;
                                        objMain.selectObj.type = objMain.Task.state;
                                        if (objMain.selectObj.obj.userData.modelType == 'building') {
                                            var inteview = Date.now() % 4000;
                                            if (inteview > 2000) {
                                                selectObj.scale.setX(Math.sin(inteview % 2000 / 2000 * Math.PI * 2) * -0.05 + 1);
                                                selectObj.scale.setZ(Math.sin(inteview % 2000 / 2000 * Math.PI * 2) * -0.05 + 1);
                                            }
                                            else {
                                                selectObj.scale.setX(Math.sin(inteview % 2000 / 2000 * Math.PI * 2) * -0.1 + 1);
                                                selectObj.scale.setZ(Math.sin(inteview % 2000 / 2000 * Math.PI * 2) * -0.1 + 1);
                                            }
                                        }
                                    }; break;
                            }
                        }
                    }
                    else {
                        objMain.Task.state = '';
                    }
                    for (var i = 0; i < objMain.playerGroup.children.length; i++) {
                        if (objMain.playerGroup.children[i].isMesh) {
                            objMain.playerGroup.children[i].userData.animateDataYrq.simulate(Date.now());
                            objMain.playerGroup.children[i].userData.animateDataYrq.refresh(Date.now());
                        }
                    }
                    for (var i = 0; i < objMain.carGroup.children.length; i++) {
                        /*
                         * 初始化汽车的大小
                         */
                        if (objMain.carGroup.children[i].isGroup) {
                            var scale = lengthOfCC * 0.001;
                            if (scale < 0.002) {
                                scale = 0.002;
                            }
                            objMain.carGroup.children[i].scale.set(scale, scale, scale);
                            objMain.carGroup.children[1].name.split('_')[1]
                            stateSet.speed.Animate(objMain.carGroup.children[i].name.split('_')[1]);
                            stateSet.attck.Animate(objMain.carGroup.children[i].name.split('_')[1]);
                            stateSet.confuse.Animate(objMain.carGroup.children[i].name.split('_')[1]);
                            stateSet.lost.Animate(objMain.carGroup.children[i].name.split('_')[1]);

                            stateSet.lightning.Animate(objMain.carGroup.children[i].name.split('_')[1]);
                            stateSet.fire.Animate(objMain.carGroup.children[i].name.split('_')[1]);
                        }
                    }
                    {
                        /*放大选中的汽车*/
                        var scale = lengthOfCC * 0.001;
                        if (scale < 0.002) {
                            scale = 0.002;
                        }
                        if (objMain.Task.carSelect != '') {
                            if (objMain.carGroup.getObjectByName(objMain.Task.carSelect) != undefined) {
                                objMain.carGroup.getObjectByName(objMain.Task.carSelect).scale.set(scale, scale, scale);
                            }
                        }

                    }

                    if (objMain.carState.car == 'selecting') {
                        if (objMain.directionGroup.children.length > 0) {
                            var newDirectionModle = objMain.directionGroup.children[0];
                            var roleKey = 'car_' + objMain.indexKey;
                            var car_self = objMain.carGroup.getObjectByName(roleKey);
                            if (car_self) {
                                var x = newDirectionModle.position.x;
                                var y = newDirectionModle.position.y + 0.1;
                                var z = newDirectionModle.position.z;
                                car_self.position.set(x, y, z);
                            }
                        }
                    }
                    var selfsCarIsMoving = false;
                    {
                        var keys = Object.keys(objMain.carsAnimateData);//获取素有的Key
                        for (var i = 0; i < keys.length; i++) {
                            var carKey = keys[i];
                            var animateDataOfSingleCar = objMain.carsAnimateData[carKey];
                            var previous = animateDataOfSingleCar.previous;
                            var current = animateDataOfSingleCar.current;
                            var isSelf = (carKey == 'car_' + objMain.indexKey);
                            var now = Date.now();
                            var moving = false;
                            if (previous != null) {
                                moving = animationF(carKey, previous, now, isSelf, lengthOfCC);
                            }
                            if (current != null && !moving) {
                                moving = animationF(carKey, current, now, isSelf, lengthOfCC);
                            }
                            if (moving && isSelf) {
                                selfsCarIsMoving = true;
                            }
                        }
                    }
                    if (objMain.carState.car == 'selecting') {
                        objMain.directionGroup.visible = true;
                        if (objMain.directionGroup.children.length > 0) {
                        }

                        objMain.controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;
                    }
                    else {
                        objMain.directionGroup.visible = false;
                        objMain.controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;//Math.PI / 2 - Math.PI / 36;
                    }

                    // var carPosition = 
                    if (selfsCarIsMoving) {
                        var deltaYOfCar = 0;
                        if (objMain.carGroup.getObjectByName('car_' + objMain.indexKey)) {
                            deltaYOfCar = objMain.carGroup.getObjectByName('car_' + objMain.indexKey).position.y;
                        }
                        sceneYUpdate(deltaYOfCar);
                        objMain.heightLevel = deltaYOfCar;
                    }
                    else if (objMain.camaraAnimateData != null) {
                        sceneYUpdate(deltaYOfSelectObj);
                        objMain.heightLevel = deltaYOfSelectObj;
                    }
                    else {
                        sceneYUpdate(objMain.heightLevel);
                    }
                    moneyAbsorb.animate();
                    targetShow.animate();
                    objMain.animation.animateCameraByCarAndTask();

                    theLagestHoderKey.animate();
                    objMain.renderer.render(objMain.scene, objMain.camera);
                    objMain.labelRenderer.render(objMain.scene, objMain.camera);
                    // objMain.light1.position.set(objMain.camera.position.x + lengthOfCC / 3, objMain.camera.position.y, objMain.camera.position.z + lengthOfCC / 3);
                    if (objMain.directionGroup.visible) {
                        var minAngle = Math.PI / 20;
                        var selectIndex = -1;
                        for (var i = 1; i < objMain.directionGroup.children.length; i++) {
                            if (i == 1)
                                objMain.directionGroup.children[i].children[0].material = objMain.ModelInput.directionArrowA.oldM;
                            else if (i == 2)
                                objMain.directionGroup.children[i].children[0].material = objMain.ModelInput.directionArrowB.oldM;
                            else if (i == 3)
                                objMain.directionGroup.children[i].children[0].material = objMain.ModelInput.directionArrowC.oldM;
                            var delta = (objMain.directionGroup.children[i].rotation.y - (objMain.controls.getAzimuthalAngle() + Math.PI / 2) + Math.PI * 2) % (Math.PI * 2);
                            if (delta < minAngle) {
                                minAngle = delta;
                                selectIndex = i;
                            }
                            else {
                                continue;
                            }
                        }
                        if (selectIndex == 1) {
                            objMain.directionGroup.children[selectIndex].children[0].material = objMain.ModelInput.directionArrowA.newM;
                        }
                        else if (selectIndex == 2) {
                            objMain.directionGroup.children[selectIndex].children[0].material = objMain.ModelInput.directionArrowB.newM;
                        }
                        else if (selectIndex == 3) {
                            objMain.directionGroup.children[selectIndex].children[0].material = objMain.ModelInput.directionArrowC.newM;
                        }
                        else {
                            objMain.selection.initialize();
                        }
                    }

                    //for (var i = 0; i < objMain.marketGroup.children.length; i++) {
                    //    var itemLength = objMain.mainF.getLength(objMain.marketGroup.children[i].position, objMain.controls.target);
                    //    if (itemLength > 40) {
                    //        objMain.marketGroup.children[i].visible = false;
                    //    }
                    //    else {
                    //        objMain.marketGroup.children[i].visible = true;
                    //    }
                    //}
                    // douyinPanleShow.animate();

                    if (objMain.animateParameter.loopCount % 5000 == 0) {
                        onWindowResize();
                    }
                }; break;
            case 'LookForBuildings':
                {
                    if (objMain.transtractionData != null) {
                        objMain.camera.lookAt(objMain.transtractionData.x, objMain.transtractionData.y, objMain.transtractionData.z);
                        objMain.controls.target.set(objMain.transtractionData.x, objMain.transtractionData.y, objMain.transtractionData.z);
                    }
                    objMain.renderer.render(objMain.scene, objMain.camera);
                    objMain.labelRenderer.render(objMain.scene, objMain.camera);
                    //    objMain.light1.position.set(objMain.camera.position.x, objMain.camera.position.y, objMain.camera.position.z);

                }; break;
            case 'QueryReward':
                {
                    if (objMain.renderer != null)
                        objMain.renderer.render(objMain.scene, objMain.camera);
                    if (objMain.labelRenderer != null)
                        objMain.labelRenderer.render(objMain.scene, objMain.camera);
                    if (objMain.renderer != null) {
                        var lengthOfCC = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target);
                        // var deltaYOfSelectObj = 0;
                        animateDetailF.moveCamara(lengthOfCC);
                        // objMain.light1.position.set(objMain.camera.position.x + lengthOfCC / 3, objMain.camera.position.y, objMain.camera.position.z + lengthOfCC / 3);
                    }

                }; break;
        }
        //if (objMain.state == 'OnLine') {


        //}
        //else if ('LookForBuildings' == objMain.state) {
        //    //if (objMain.transtractionData != null)

        //}

        if (Date.now() - objMain.pingTime > 100) {
            objMain.pingTime = Date.now();
            // objMain.ws.send('{"c":"c"}');
        }
    }
}
animate();

var animateDetailF =
{
    moveCamara: function (lengthOfCC) {
        if (objMain.camaraAnimateData != null) {
            if (objMain.camaraAnimateData.newT.t < Date.now()) {
                objMain.camaraAnimateData = null;
                return 0;
            }
            else {
                var percent1 = (Date.now() - objMain.camaraAnimateData.old.t) / 3000 * Math.PI;
                var percent2 = (Math.sin(percent1 - Math.PI / 2) + 1) / 2;
                var x = objMain.camaraAnimateData.old.x + (objMain.camaraAnimateData.newT.x - objMain.camaraAnimateData.old.x) * percent2;
                var y = objMain.camaraAnimateData.old.y + (objMain.camaraAnimateData.newT.y - objMain.camaraAnimateData.old.y) * percent2;
                var z = objMain.camaraAnimateData.old.z + (objMain.camaraAnimateData.newT.z - objMain.camaraAnimateData.old.z) * percent2;
                objMain.controls.target.set(x, y, z);
                var angle = objMain.controls.getPolarAngle();
                //if(
                //var dCal = objMain.mainF.getLength(objMain.camera.position, objMain.controls.target);
                var distance = lengthOfCC;
                var unitY = Math.abs(distance * Math.cos(angle));
                var unitZX = distance * Math.sin(angle);

                var angleOfCamara = objMain.controls.getAzimuthalAngle();
                var unitX = unitZX * Math.sin(angleOfCamara);
                var unitZ = unitZX * Math.cos(angleOfCamara);

                objMain.camera.position.set(x + unitX, y + unitY, z + unitZ);
                objMain.camera.lookAt(x, y, z);
                return y;
            }
        }
        else return 0;
    }
};


var setNameFuncton = function () {
    if (localStorage.playerName != undefined) {
        // localStorage.playerName==
        {
            var name = localStorage.playerName;
            var reg = /^[\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5]{1,8}$/;
            if (reg.test(name)) {
                objMain.ws.send(JSON.stringify({ c: 'SetPlayerName', 'Name': name }));
                objMain.ws.send(JSON.stringify({ c: 'GetName' }));
                setNameFuncton = null;
            }
        }
    }
}
var selectSingleTeamJoinHtml = function () {

    document.getElementById('rootContainer').innerHTML = selectSingleTeamJoinHtmlF.drawHtml();
    selectSingleTeamJoinHtmlF.canBtnClick = true;

    if (setNameFuncton != null) {
        setNameFuncton();
    }
}
var buttonClick = function (v) {
    if (objMain.receivedState == 'selectSingleTeamJoin') {
        if (selectSingleTeamJoinHtmlF.canBtnClick) {
            switch (v) {
                case 'single':
                    {
                        objMain.ws.send(JSON.stringify({ c: 'JoinGameSingle', RefererAddr: nyrqUrl.get() }));
                        objMain.receivedState = '';
                    }; break;
                case 'team':
                    {
                        objMain.ws.send(JSON.stringify({ c: 'CreateTeam', RefererAddr: nyrqUrl.get() }));
                        objMain.receivedState = '';
                    }; break;
                case 'join':
                    {
                        objMain.ws.send(JSON.stringify({ c: 'JoinTeam' }));
                        objMain.receivedState = '';
                    }; break;
                case 'setName':
                    {
                        // objMain.ws.send(JSON.stringify({ c: 'JoinTeam' }));
                        objMain.receivedState = 'setName';
                        selectSingleTeamJoinHtmlF.setNameHtmlShow();
                        objMain.ws.send(JSON.stringify({ c: 'GetName' }));
                    }; break;
                case 'setCarsName':
                    {
                        // objMain.ws.send(JSON.stringify({ c: 'JoinTeam' }));
                        objMain.receivedState = 'setCarsName';
                        selectSingleTeamJoinHtmlF.setCarsNameHtmlShow();
                        objMain.ws.send(JSON.stringify({ c: 'GetCarsName' }));
                    }; break;
                case 'QueryReward':
                    {
                        //selectSingleTeamJoinHtmlF.setNameHtmlShow();
                        objMain.ws.send(JSON.stringify({ c: 'QueryReward' }));
                    }; break;
                case 'HelpAndGuide':
                    {
                        objMain.ws.send(JSON.stringify({ c: 'Guid' }));
                    }; break;

                //case 'lookForBuildings':
                //    {
                //        objMain.ws.send(JSON.stringify({ c: 'LookForBuildings' }));
                //        objMain.receivedState = '';
                //    }; break;
            }
            // objMain.receivedState = '';
        }
    }
    selectSingleTeamJoinHtmlF.canBtnClick = false;
}







var set3DHtml = function () {
    mahjongDisplay.load();
    //var text = "";
    //text += "  <div>";
    //text += "            3D界面";
    //text += "        </div>";
    //document.getElementById('rootContainer').innerHTML = text;
    document.getElementById('rootContainer').innerHTML = '';

    //<div id="mainC" class="container" onclick="testTop();">
    //    <!--<img />-->
    //    <!--<a href="DAL/MapImage.ashx">DAL/MapImage.ashx</a>-->
    //    <img src="Pic/11.png" />
    //</div>
    var mainC = document.createElement('div');
    mainC.id = 'mainC';

    mainC.className = 'container';
    document.getElementById('rootContainer').appendChild(mainC);

    objMain.scene = new THREE.Scene();
    //objMain.scene.background = new THREE.Color(0x7c9dd4);
    //objMain.scene.fog = new THREE.FogExp2(0x7c9dd4, 0.2);

    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('Pic/');
    //var cubeTexture = cubeTextureLoader.load([
    //    "xi_r.jpg", "dong_r.jpg",
    //    "ding_r.jpg", "di_r.jpg",
    //    "nan_r.jpg", "bei_r.jpg"
    //]);
    var cubeTexture = cubeTextureLoader.load([
        "px.jpg", "nx.jpg",
        "py.jpg", "ny.jpg",
        "pz.jpg", "nz.jpg"
    ], function (newt) {
        objMain.scene.background = newt;
        objMain.scene.background.needsUpdate = true;
        cubeTextureLoader = null;
    }
    );
    // objMain.background.backgroundData['main'] = cubeTexture;
    //objMain.background.backgroundData['main'];

    objMain.renderer = new THREE.WebGLRenderer({ alpha: true });
    objMain.renderer.setClearColor(0x000000, 0); // the default
    objMain.renderer.setPixelRatio(window.devicePixelRatio);
    objMain.renderer.setSize(window.innerWidth, window.innerHeight);
    objMain.renderer.domElement.className = 'renderDom';
    objMain.renderer.shadowMap.enabled = true;
    document.getElementById('mainC').appendChild(objMain.renderer.domElement);
    //  document.body

    objMain.labelRenderer = new THREE.CSS2DRenderer();
    objMain.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    objMain.labelRenderer.domElement.className = 'labelRenderer';
    //objMain.labelRenderer.domElement.style.curs
    document.getElementById('mainC').appendChild(objMain.labelRenderer.domElement);

    objMain.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 30);
    objMain.camera.position.set(0.7 + 0.3, 1.25 + 0.3, 0);
    // objMain.camera.position.set(MercatorGetXbyLongitude(objMain.centerPosition.lon), 20, -MercatorGetYbyLatitude(objMain.centerPosition.lat));

    objMain.controls = new THREE.OrbitControls(objMain.camera, objMain.labelRenderer.domElement);
    objMain.controls.center.set(0, 0.8, 0);

    {
        var registGroup = function (g) {
            g = new THREE.Group();
            objMain.scene.add(g);
            return g;
        }
        objMain.roadGroup = registGroup(objMain.roadGroup);
        objMain.playerGroup = registGroup(objMain.playerGroup);
        objMain.promoteDiamond = registGroup(objMain.promoteDiamond);
        objMain.columnGroup = registGroup(objMain.columnGroup);
        objMain.carGroup = registGroup(objMain.carGroup);
        objMain.groupOfOperatePanle = registGroup(objMain.groupOfOperatePanle);
        objMain.collectGroup = registGroup(objMain.collectGroup);
        objMain.getOutGroup = registGroup(objMain.getOutGroup);
        objMain.taxGroup = registGroup(objMain.taxGroup);
        objMain.shieldGroup = registGroup(objMain.shieldGroup);
        objMain.confusePrepareGroup = registGroup(objMain.confusePrepareGroup);
        objMain.lostPrepareGroup = registGroup(objMain.lostPrepareGroup);
        objMain.ambushPrepareGroup = registGroup(objMain.ambushPrepareGroup);
        objMain.waterGroup = registGroup(objMain.waterGroup);
        objMain.waterMarkGroup = registGroup(objMain.waterMarkGroup);
        objMain.fireGroup = registGroup(objMain.fireGroup);
        objMain.fireMarkGroup = registGroup(objMain.fireGroup);
        objMain.lightningGroup = registGroup(objMain.lightningGroup);
        objMain.lightningMarkGroup = registGroup(objMain.lightningMarkGroup);
        objMain.absorbGroup = registGroup(objMain.absorbGroup);
        objMain.directionGroup = registGroup(objMain.directionGroup);
        objMain.buildingGroup = registGroup(objMain.buildingGroup);
        objMain.targetGroup = registGroup(objMain.targetGroup);
        objMain.buildingSelectionGroup = registGroup(objMain.buildingSelectionGroup);
        objMain.fightSituationGroup = registGroup(objMain.fightSituationGroup);
        objMain.groupOfTaskCopy = registGroup(objMain.groupOfTaskCopy);
        objMain.marketGroup = registGroup(objMain.marketGroup);
        objMain.crossSelectionsOperator = registGroup(objMain.crossSelectionsOperator);
        objMain.mahjongsGroup = registGroup(objMain.mahjongsGroup);
        objMain.diceGroup = registGroup(objMain.diceGroup);
        objMain.mahjongsOnHandGroup = registGroup(objMain.mahjongsOnHandGroup);
    }
    if (false) {

    }
    objMain.clock = new THREE.Clock();
    const lightIntensity = 0.7;
    {
        objMain.light1 = new THREE.PointLight(0xeeeeee);
        objMain.light1.position.set(4, 4, 4);
        objMain.light1.intensity = lightIntensity;
        objMain.light1.castShadow = true;
        objMain.scene.add(objMain.light1);
    }

    {
        objMain.light2 = new THREE.PointLight(0xeeeeee);
        objMain.light2.position.set(4, 4, -4);
        objMain.light2.intensity = lightIntensity;
        objMain.light2.castShadow = true;
        objMain.scene.add(objMain.light2);
    }

    {
        objMain.light3 = new THREE.PointLight(0xeeeeee);
        objMain.light3.position.set(-4, 4, -4);
        objMain.light3.intensity = lightIntensity;
        objMain.light3.castShadow = true;
        objMain.scene.add(objMain.light3);
    }

    {
        objMain.light4 = new THREE.PointLight(0xeeeeee);
        objMain.light4.position.set(-4, 4, 4);
        objMain.light4.intensity = lightIntensity;
        objMain.light4.castShadow = true;
        objMain.scene.add(objMain.light4);
    }

    {
        //objMain.controls.minDistance = 3;
        // objMain.controls.maxPolarAngle = Math.PI;
        objMain.controls.minPolarAngle = Math.PI / 600;
        objMain.controls.maxPolarAngle = Math.PI / 2 - Math.PI / 36;
        objMain.controls.minDistance = 0.2;
        objMain.controls.maxDistance = 2;
        objMain.controls.enableZoom = true;
    }

    objMain.raycaster = new THREE.Raycaster();
    objMain.raycaster.linePrecision = 0.2;

    objMain.raycasterOfSelector = new THREE.Raycaster();
    //objMain.raycasterOfSelector.linePrecision = 100;

    objMain.mouse = new THREE.Vector2();

    //objMain.labelRenderer.domElement.addEventListener

    var operateEnd = function (event) {
        //  objMain.camera.lookAt(0, 0.8, 0);
        return;
    }
    var operateStart = function (event) {
        objMain.canSelect = true;
        objMain.music.change();
        objMain.music.MarketRepeat();
    }
    objMain.labelRenderer.domElement.addEventListener('mouseup', operateEnd, false);
    objMain.labelRenderer.domElement.addEventListener('mousedown', operateStart, false);


    objMain.labelRenderer.domElement.addEventListener('touchstart', operateStart, false);
    objMain.labelRenderer.domElement.addEventListener('touchend', operateEnd, false);

    //scope.domElement.removeEventListener('touchstart', onTouchStart, false);
    //scope.domElement.removeEventListener('touchend', onTouchEnd, false);
    //drawCarBtnsFrame();
    //objNotify.carNotifyShow();
    window.addEventListener('resize', onWindowResize, false);
    //douyinPanleShow.drawFlagThemeDetail('Ukraine');
    //douyinPanleShow.drawFlagThemeDetail('Russia');
    showDesk();
    objMain.camera.lookAt(0, 0.8, 0);
}
function onWindowResize() {
    switch (objMain.state) {
        case 'OnLine':
            {
                objMain.camera.aspect = window.innerWidth / window.innerHeight;
                objMain.camera.updateProjectionMatrix();

                objMain.labelRenderer.setSize(window.innerWidth, window.innerHeight);
                objMain.renderer.setSize(window.innerWidth, window.innerHeight);
                carAbility.refreshPosition();
            }; break;
        case 'LookForBuildings':
            {
                objMain.camera.aspect = 1;
                objMain.camera.updateProjectionMatrix();

                objMain.labelRenderer.setSize(300, 300);
                objMain.renderer.setSize(300, 300);
            }; break;
        case 'QueryReward': {
            objMain.camera.aspect = window.innerWidth / window.innerHeight;
            objMain.camera.updateProjectionMatrix();

            objMain.labelRenderer.setSize(window.innerWidth, window.innerHeight);
            objMain.renderer.setSize(window.innerWidth, window.innerHeight);
        }; break;
    }


    var touchTrail = document.getElementById('touch-trail');
    touchTrail.width = window.innerWidth;
    touchTrail.height = window.innerHeight;
}


var MapData =
{
    roadAndCrossJson: '',
    roadAndCross: null,
    meshPoints: [],
    initialize: function () {
        this.roadAndCross = '';
        this.roadAndCross = null;
        this.meshPoints = [];
    }
};
var drawPoint = function (color, fp, indexKey) {
    var flagName = 'flag_' + indexKey;
    if (objMain.playerGroup == null || objMain.playerGroup == undefined) {
        return;
    }
    else if (objMain.playerGroup.getObjectByName(flagName) == null || objMain.playerGroup.getObjectByName(flagName) == undefined) {
        var createFlag = function (color) {
            var that = this;
            this.windStrengthDelta = 0;
            this.DAMPING = 0.03;
            this.DRAG = 1 - this.DAMPING;
            this.MASS = 0.1;
            this.restDistance = 25;
            this.xSegs = 10;
            this.ySegs = 10;
            function plane(width, height) {

                return function (u, v, target) {

                    var x = (u - 0.5) * width;
                    var y = (v + 0.5) * height;
                    var z = 0;

                    target.set(x, y, z);

                };

            }
            var clothFunction = plane(this.restDistance * this.xSegs, this.restDistance * this.ySegs);
            function Cloth(w, h) {

                w = w || 10;
                h = h || 10;
                this.w = w;
                this.h = h;

                var particles = [];
                var constraints = [];

                // Create particles
                for (let v = 0; v <= h; v++) {

                    for (let u = 0; u <= w; u++) {

                        particles.push(
                            new Particle(u / w, v / h, 0, that.MASS)
                        );

                    }

                }

                // Structural

                for (let v = 0; v < h; v++) {

                    for (let u = 0; u < w; u++) {

                        constraints.push([
                            particles[index(u, v)],
                            particles[index(u, v + 1)],
                            that.restDistance
                        ]);

                        constraints.push([
                            particles[index(u, v)],
                            particles[index(u + 1, v)],
                            that.restDistance
                        ]);

                    }

                }

                for (let u = w, v = 0; v < h; v++) {

                    constraints.push([
                        particles[index(u, v)],
                        particles[index(u, v + 1)],
                        that.restDistance

                    ]);

                }

                for (let v = h, u = 0; u < w; u++) {

                    constraints.push([
                        particles[index(u, v)],
                        particles[index(u + 1, v)],
                        that.restDistance
                    ]);

                }
                this.particles = particles;
                this.constraints = constraints;

                function index(u, v) {

                    return u + v * (w + 1);

                }

                this.index = index;

            }
            var cloth = new Cloth(this.xSegs, this.ySegs);
            this.cloth = cloth;

            this.GRAVITY = 981 * 1.4;
            this.gravity = new THREE.Vector3(0, -  this.GRAVITY, 0).multiplyScalar(this.MASS);

            this.TIMESTEP = 18 / 1000;
            this.TIMESTEP_SQ = this.TIMESTEP * this.TIMESTEP;

            this.pins = [];

            this.windForce = new THREE.Vector3(0, 0, 0);

            //this. ballPosition = new THREE.Vector3(0, - 45, 0);
            //this. ballSize = 60; //40

            this.tmpForce = new THREE.Vector3();

            function Particle(x, y, z, mass) {

                this.position = new THREE.Vector3();
                this.previous = new THREE.Vector3();
                this.original = new THREE.Vector3();
                this.a = new THREE.Vector3(0, 0, 0); // acceleration
                this.mass = mass;
                this.invMass = 1 / mass;
                this.tmp = new THREE.Vector3();
                this.tmp2 = new THREE.Vector3();

                // init

                clothFunction(x, y, this.position); // position
                clothFunction(x, y, this.previous); // previous
                clothFunction(x, y, this.original);

            }

            // Force -> Acceleration

            Particle.prototype.addForce = function (force) {

                this.a.add(
                    this.tmp2.copy(force).multiplyScalar(this.invMass)
                );

            };


            // Performs Verlet integration

            Particle.prototype.integrate = function (timesq) {

                var newPos = this.tmp.subVectors(this.position, this.previous);
                newPos.multiplyScalar(that.DRAG).add(this.position);
                newPos.add(this.a.multiplyScalar(timesq));

                this.tmp = this.previous;
                this.previous = this.position;
                this.position = newPos;

                this.a.set(0, 0, 0);

            };

            this.diff = new THREE.Vector3();
            function satisfyConstraints(p1, p2, distance) {

                that.diff.subVectors(p2.position, p1.position);
                var currentDist = that.diff.length();
                if (currentDist === 0) return; // prevents division by 0
                var correction = that.diff.multiplyScalar(1 - distance / currentDist);
                var correctionHalf = correction.multiplyScalar(0.5);
                p1.position.add(correctionHalf);
                p2.position.sub(correctionHalf);

            }
            this.simulate = function (now) {
                //这里进行动画
                var windStrength = Math.cos(now / 7000) * 20 + 40 + that.windStrengthDelta;

                that.windForce.set(Math.sin(now / 2000), Math.cos(now / 3000), Math.sin(now / 1000));
                that.windForce.normalize();
                that.windForce.multiplyScalar(windStrength);

                // Aerodynamics forces

                var particles = cloth.particles;

                {

                    let indx;
                    var normal = new THREE.Vector3();
                    var indices = clothGeometry.index;
                    var normals = clothGeometry.attributes.normal;

                    for (let i = 0, il = indices.count; i < il; i += 3) {

                        for (let j = 0; j < 3; j++) {

                            indx = indices.getX(i + j);
                            normal.fromBufferAttribute(normals, indx);
                            that.tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(that.windForce));
                            particles[indx].addForce(that.tmpForce);

                        }

                    }

                }

                for (let i = 0, il = particles.length; i < il; i++) {

                    var particle = particles[i];
                    particle.addForce(that.gravity);

                    particle.integrate(that.TIMESTEP_SQ);

                }

                // Start Constraints

                var constraints = cloth.constraints;
                var il = constraints.length;

                for (let i = 0; i < il; i++) {

                    var constraint = constraints[i];
                    satisfyConstraints(constraint[0], constraint[1], constraint[2]);

                }

                // Ball Constraints




                // Floor Constraints

                for (let i = 0, il = particles.length; i < il; i++) {

                    var particle = particles[i];
                    var pos = particle.position;
                    if (pos.y < - 250) {

                        pos.y = - 250;

                    }

                }

                // Pin Constraints

                for (let i = 0, il = that.pins.length; i < il; i++) {

                    var xy = that.pins[i];
                    var p = particles[xy];
                    p.position.copy(p.original);
                    p.previous.copy(p.original);

                }


            }

            this.pinsFormation = [];
            this.pins = [6];

            this.pinsFormation.push(this.pins);

            this.pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            this.pinsFormation.push(this.pins);

            this.pins = [0];
            this.pinsFormation.push(this.pins);

            this.pins = []; // cut the rope ;)
            this.pinsFormation.push(this.pins);

            this.pins = [0, cloth.w]; // classic 2 pins
            this.pinsFormation.push(this.pins);

            this.pins = this.pinsFormation[1];

            function togglePins() {

                pins = pinsFormation[~ ~(Math.random() * pinsFormation.length)];

            }
            this.clothMaterial = new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide,
                alphaTest: 0.5,
                color: color,
                emissive: color
            });
            var clothGeometry = new THREE.ParametricBufferGeometry(clothFunction, cloth.w, cloth.h);
            this.clothGeometry = clothGeometry;


            this.refresh = function () {
                var p = that.cloth.particles;
                for (let i = 0, il = p.length; i < il; i++) {

                    var v = p[i].position;

                    that.clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z);

                }
                that.clothGeometry.attributes.position.needsUpdate = true;
                that.clothGeometry.computeVertexNormals();
            };

            return this;
        }
        var objToShow = new createFlag(color);
        object = new THREE.Mesh(objToShow.clothGeometry, objToShow.clothMaterial);
        object.userData['animateDataYrq'] = objToShow;
        object.position.set(MercatorGetXbyLongitude(fp.Longitude), 0.1 + MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.Latitde));
        object.scale.set(0.0005, 0.0005, 0.0005);

        var start = new THREE.Vector3(MercatorGetXbyLongitude(fp.Longitude), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.Latitde));
        var end = new THREE.Vector3(MercatorGetXbyLongitude(fp.positionLongitudeOnRoad), MercatorGetZbyHeight(fp.Height) * objMain.heightAmplify, -MercatorGetYbyLatitude(fp.positionLatitudeOnRoad));
        var cc = new Complex(end.x - start.x, end.z - start.z);
        cc.toOne();
        object.rotateY(-cc.toAngle() + Math.PI / 2);
        object.name = flagName;
        objMain.playerGroup.add(object);
        return;
    }
}


var SysOperatePanel =
{
    draw: function () {
        while (document.getElementById('sysOperatePanel') != null) {
            document.getElementById('sysOperatePanel').remove();
        }
        var divSysOperatePanel = document.createElement('div');
        divSysOperatePanel.id = 'sysOperatePanel';
        divSysOperatePanel.style.position = 'absolute';
        divSysOperatePanel.style.zIndex = '7';
        divSysOperatePanel.style.top = 'calc(100% - 2.5em - 8px)';
        divSysOperatePanel.style.left = '8px';
        divSysOperatePanel.style.width = 'calc(100% - 16px)';
        {
            var img = document.createElement('img');
            img.id = 'msgToNotify'
            img.src = 'Pic/chatPng.png';
            img.classList.add('chatdialog');
            img.style.border = 'solid 1px yellowgreen';
            img.style.borderRadius = '5px';
            img.style.height = 'calc(2.5em - 2px)';
            img.style.width = 'auto';

            img.onclick = function () {
                // alert('打开聊天框');
                dialogSys.show();
            };
            img.classList.add('costomButton');
            divSysOperatePanel.appendChild(img);
        }
        {
            var img = document.createElement('img');
            img.id = 'moneyServe';
            img.src = 'Pic/trade.png';
            img.classList.add('chatdialog');
            img.style.border = 'solid 1px yellowgreen';
            img.style.borderRadius = '5px';
            img.style.height = 'calc(2.5em - 2px)';
            img.style.width = 'auto';
            img.style.marginLeft = "0.5em";
            img.onclick = function () {
                // alert('打开聊天框');
                //      dialogSys.show();
                //alert('弹出对话框');
                moneyOperator.add();
            };
            img.classList.add('costomButton');
            divSysOperatePanel.appendChild(img);
        }
        {
            var img = document.createElement('img');
            img.id = 'moneySubsidize';
            img.src = 'Pic/subsidize.png';
            img.classList.add('chatdialog');
            img.style.border = 'solid 1px yellowgreen';
            img.style.borderRadius = '5px';
            img.style.height = 'calc(2.5em - 2px)';
            img.style.width = 'auto';
            img.style.marginLeft = "0.5em";
            img.onclick = function () {
                // alert('打开聊天框');
                //      dialogSys.show();
                //alert('弹出对话框');
                // var el = img;
                subsidizeSys.add();
                //moneyOperator.add();
            };
            img.classList.add('costomButton');
            if (objMain.stateNeedToChange.isLogin) { }
            else
                img.classList.add('msg');
            divSysOperatePanel.appendChild(img);
        }
        {
            var img = document.createElement('img');
            img.id = 'moneySubsidize';
            img.src = 'Pic/trophy.png';
            img.classList.add('chatdialog');
            img.style.border = 'solid 1px yellowgreen';
            img.style.borderRadius = '5px';
            img.style.height = 'calc(2.5em - 2px)';
            img.style.width = 'auto';
            img.style.marginLeft = "0.5em";
            img.onclick = function () {
                // alert('债务框！');
                //      dialogSys.show();
                //alert('弹出对话框');
                //subsidizeSys.add();
                //moneyOperator.add();

                var removePanel = function (panelId) {
                    if (document.getElementById(panelId) == null) {
                    }
                    else {
                        document.getElementById(panelId).remove();
                    }
                }
                removePanel("douyinRankPanle");
                removePanel("douyinPanleShow_DouyiOperatePanle");

                if (document.getElementById("douyinPanleShow") == null) {
                    resistance.bindData(objMain.indexKey);
                }
                else {
                    document.getElementById("douyinPanleShow").remove();
                }
            };
            img.classList.add('costomButton');
            divSysOperatePanel.appendChild(img);
        }
        {
            var img = document.createElement('img');
            img.id = 'gameFrontSetting';
            img.src = 'Pic/settingIcon.png';
            img.classList.add('chatdialog');
            img.style.border = 'solid 1px yellowgreen';
            img.style.borderRadius = '5px';
            img.style.height = 'calc(2.5em - 2px)';
            img.style.width = 'auto';
            img.style.marginLeft = 'calc(100% - 15em + 10px)';
            // img.style.right = '0.5em';

            img.onclick = function () {
                if (objMain.state == 'LookForBuildings') {
                    objMain.ws.send(JSON.stringify({ c: 'CancleLookForBuildings' }));
                }
                else {
                    settingSys.add();
                }
            };
            img.classList.add('costomButton');
            divSysOperatePanel.appendChild(img);
        }
        document.body.appendChild(divSysOperatePanel);
    },
    notifyMsg: function () {
        var element = document.getElementById('msgToNotify');
        element.classList.add('msg');
    },
    //needToLogin: function ()
    //{

    //},
    cancelNotifyMsg: function () {
        var element = document.getElementById('msgToNotify');
        element.classList.remove('msg');
    },
    remove: function () {
        while (document.getElementById('sysOperatePanel') != null) {
            document.getElementById('sysOperatePanel').remove();
        }
    }
};

var setWaitingToStart = function () {
    var text = "";
    text += "  <div>";
    text += "          请等待";
    text += "        </div>";
    document.getElementById('rootContainer').innerHTML = text;
}
var token =
{
    CommandStart: '',

}


var createTeam = function (teamCreateFinish) {

    creatTeamObj.createMain(teamCreateFinish);
    return;
    document.getElementById('rootContainer').innerHTML = '';
    var div1 = document.createElement('div');
    div1.style.textAlign = 'center';
    var addDiv = function (title, content, isSelf) {
        var div = document.createElement('div');
        var label = document.createElement('label');
        var b = document.createElement('b');
        label.innerText = title;
        b.innerText = content;
        div.appendChild(label);
        div.appendChild(b);
        if (isSelf) {
            div.style.background = 'green';
            div.style.color = 'yellow';
        }
        return div;
    }
    div1.appendChild(addDiv('房间号：', teamCreateFinish.TeamNum));
    div1.appendChild(addDiv(teamCreateFinish.PlayerDetail.Description + '：', teamCreateFinish.PlayerDetail.Name, true));

    document.getElementById('rootContainer').appendChild(div1);


    {
        var div2 = document.createElement('div');
        div2.style.textAlign = 'center';
        var button_Start = document.createElement("button");
        button_Start.innerText = '开始';
        button_Start.style.width = "5em";
        button_Start.style.height = "3em";
        button_Start.style.marginTop = "1em";



        var div3 = document.createElement('div');
        div3.style.textAlign = 'center';
        var button_Exit = document.createElement("button");
        button_Exit.innerText = '解散';
        button_Exit.style.width = "5em";
        button_Exit.style.height = "3em";
        button_Exit.style.marginTop = "5em";
        button_Exit.style.backgroundColor = "orange";
        button_Exit.onclick = function () {
            objMain.ws.send(token.CommandStart + 'exit');
            button_Start.onclick = function () { };
            button_Exit.onclick = function () { };
        };

        button_Start.onclick = function () {
            objMain.ws.send(token.CommandStart);
            // this.onclick = function () { };
            button_Start.onclick = function () { };
            button_Exit.onclick = function () { };
        };

        var div4 = document.createElement('div');
        div4.style.textAlign = 'center';
        var button_ClearOffLine = document.createElement("button");
        button_ClearOffLine.innerText = '清理离线';
        button_ClearOffLine.style.width = "5em";
        button_ClearOffLine.style.height = "3em";
        button_ClearOffLine.style.marginTop = "5em";
        // button_ClearOffLine.style.backgroundColor = "orange";
        button_ClearOffLine.onclick = function () {
            objMain.ws.send(token.CommandStart + 'clear');
        };

        div2.appendChild(button_Start);
        div3.appendChild(button_Exit);
        div4.appendChild(button_ClearOffLine);

        document.getElementById('rootContainer').appendChild(div2);
        document.getElementById('rootContainer').appendChild(div4);
        document.getElementById('rootContainer').appendChild(div3);
    }

}

var setWaitingToGetTeam = function () {
    creatTeamObj.join();
    return;

    document.getElementById('rootContainer').innerHTML = '';
    var div1 = document.createElement('div');
    div1.style.textAlign = 'center';
    div1.style.marginTop = '2em';
    var label = document.createElement('label');
    label.innerText = '房间号';
    var input = document.createElement('input');
    input.id = 'roomNumInput';
    input.type = 'number';
    div1.appendChild(label);
    div1.appendChild(input);
    document.getElementById('rootContainer').appendChild(div1);

    var div2 = document.createElement('div');
    div2.style.textAlign = 'center';

    var button = document.createElement("button");
    button.innerText = '加入';
    button.style.width = "5em";
    button.style.height = "3em";
    button.style.marginTop = "1em";
    button.onclick = function () {
        console.log('提示', '加入事件还没有写写哦');
        var roomNumInput = document.getElementById('roomNumInput').value;
        if (roomNumInput == '') {
            alert('不要输入空');
        }
        else {
            objMain.ws.send(roomNumInput);
            this.onclick = function () { };
        }
    };
    div2.appendChild(button);
    document.getElementById('rootContainer').appendChild(div2);
}


var joinTeamDetail = function (teamJoinFinish) {
    creatTeamObj.joinTeamDetail(teamJoinFinish);
    return;
    document.getElementById('rootContainer').innerHTML = '';
    var div1 = document.createElement('div');
    div1.style.textAlign = 'center';

    var addDiv = function (title, content, id, isSelf) {
        var div = document.createElement('div');
        var label = document.createElement('label');
        var b = document.createElement('b');
        label.innerText = title;
        b.innerText = content;
        div.appendChild(label);
        div.appendChild(b);
        if (id != undefined && id != null && id != '') div.id = id;
        if (isSelf) {
            div.style.background = 'green';
            div.style.color = 'yellow';
        }
        return div;
    }
    div1.appendChild(addDiv('房间号：', teamJoinFinish.TeamNum));
    div1.appendChild(addDiv(teamJoinFinish.Players[0].Description + '：', teamJoinFinish.Players[0].Name, teamJoinFinish.Players[0].GUID));

    for (var i = 1; i < teamJoinFinish.Players.length; i++) {
        div1.appendChild(
            addDiv(
                teamJoinFinish.Players[i].Description + '：',
                teamJoinFinish.Players[i].Name,
                teamJoinFinish.Players[i].GUID,
                teamJoinFinish.Players[i].IsSelf));
    }

    document.getElementById('rootContainer').appendChild(div1);

    var div2 = document.createElement('div');
    div2.style.textAlign = 'center';

    var button = document.createElement("button");
    button.innerText = '离开房间';
    button.style.width = "5em";
    button.style.height = "3em";
    button.style.marginTop = "5em";
    button.style.backgroundColor = "orange";
    button.onclick = function () {
        objMain.ws.send(JSON.stringify({ c: 'LeaveTeam' }));
    };
    div2.appendChild(button);

    document.getElementById('rootContainer').appendChild(div2);
}

var broadTeamJoin = function (teamJoinBroadInfo) {
    creatTeamObj.broadTeamJoin(teamJoinBroadInfo);
    return;
}

var broadTeamMemberRemove = function (removeInfo) {
    while (document.getElementById(removeInfo.Guid) != null) {
        document.getElementById(removeInfo.Guid).remove();
    }
}

var marketOperate =
{
    refresh: function () {
        marketOperate.clearPanel();
        marketOperate.state = '';
        switch (objMain.carState["car"]) {
            case 'waitAtBaseStation':
                {
                    marketOperate.drawCarBtns();
                }; break;
            default:
                {
                }; break;
        }
    },
    clearPanel: function () {
        while (document.getElementById('taskOperatingPanel') != null) {
            document.getElementById('taskOperatingPanel').remove();
        }
    },
    drawCarBtns: function () {
        {
            var clearBtnOfObj = function (id) {
                if (document.getElementById(id) == null) { }
                else {
                    var tp = document.getElementById(id);
                    while (tp.children.length > 0) {
                        tp.children[0].remove();
                    }
                }
            }

            var ff2 = function () {
                var divTaskOperatingPanel = document.createElement('div');
                divTaskOperatingPanel.id = 'taskOperatingPanel';

                divTaskOperatingPanel.style.position = 'absolute';
                divTaskOperatingPanel.style.zIndex = '7';
                divTaskOperatingPanel.style.right = '20px';
                divTaskOperatingPanel.style.border = 'none';
                divTaskOperatingPanel.style.width = '5em';
                divTaskOperatingPanel.style.color = 'green';
                //每个子对象1.3em 8px 共2.5个
                divTaskOperatingPanel.style.top = 'calc(50% - 3.25em - 20px)';

                var addItemToTaskOperatingPanle = function (btnName, id, clickF) {
                    var div = document.createElement('div');
                    div.style.width = 'calc(5em - 4px)';
                    div.style.textAlign = 'center';
                    div.style.border = '2px inset #ffc403';
                    div.style.borderRadius = '0.3em';
                    div.style.marginTop = '4px';
                    div.style.marginBottom = '4px';
                    div.style.background = 'rgba(0, 191, 255, 0.6)';
                    div.style.height = '1.3em';
                    div.id = id;

                    var span = document.createElement('span');
                    span.innerText = btnName;
                    div.appendChild(span);
                    //  <span id="carASpan">提升续航</span>

                    div.onclick = function () { clickF(); }
                    divTaskOperatingPanel.appendChild(div);
                }

                addItemToTaskOperatingPanle('宝石', 'useGetDiamondBtn', function () {


                    var tmp_S1 = arguments;
                    clearBtnOfObj('taskOperatingPanel');
                    addItemToTaskOperatingPanle('购买', 'buyDiamondBtn', function () {

                        objMain.ws.send(JSON.stringify({ 'c': 'BuyDiamond', 'pType': objMain.selectObj.obj.userData.index }));
                    });
                    addItemToTaskOperatingPanle('出售', 'sellDiamondBtn', function () {
                        objMain.ws.send(JSON.stringify({ 'c': 'SellDiamond', 'pType': objMain.selectObj.obj.userData.index }));
                    });
                    addItemToTaskOperatingPanle('取消', 'cancleBtn', function () {
                        marketOperate.state = '';
                        marketOperate.refresh();

                    });



                    /*------*/

                });

                document.body.appendChild(divTaskOperatingPanel);
            }

            ff2();
        }

    },
    state: ''
};

var operatePanel =
{
    clearPanel: function () {
        while (document.getElementById('taskOperatingPanel') != null) {
            document.getElementById('taskOperatingPanel').remove();
        }
    },
    refresh: function () {
        operatePanel.clearPanel();
        var clearBtnOfObj = function (id) {
            if (document.getElementById(id) == null) { }
            else {
                var tp = document.getElementById(id);
                while (tp.children.length > 0) {
                    tp.children[0].remove();
                }
            }
        }
        var divTaskOperatingPanel = document.createElement('div');
        divTaskOperatingPanel.id = 'taskOperatingPanel';

        divTaskOperatingPanel.style.position = 'absolute';
        divTaskOperatingPanel.style.zIndex = '7';
        divTaskOperatingPanel.style.right = '20px';
        divTaskOperatingPanel.style.border = 'none';
        divTaskOperatingPanel.style.width = '5em';
        divTaskOperatingPanel.style.color = 'green';
        //根据底部计算所得
        divTaskOperatingPanel.style.bottom = 'calc(2.5em + 14px)';
        var addItemToTaskOperatingPanle = function (btnName, id, clickF) {
            var div = document.createElement('div');
            div.style.width = 'calc(5em - 4px)';
            div.style.textAlign = 'center';
            div.style.border = '2px inset #ffc403';
            div.style.borderRadius = '0.3em';
            div.style.marginTop = '4px';
            div.style.marginBottom = '4px';
            div.style.background = 'rgba(0, 191, 255, 0.6)';
            div.style.height = '1.3em';
            div.id = id;

            var span = document.createElement('span');
            span.innerText = btnName;
            div.appendChild(span);
            //  <span id="carASpan">提升续航</span>

            div.onclick = function () { clickF(); }
            div.classList.add('costomButton');
            divTaskOperatingPanel.appendChild(div);
        }

        var addItemToTaskOperatingPanle2 = function (bgRc, id, clickF, objState) {
            var div = document.createElement('div');
            div.style.width = 'calc(5em - 4px)';
            div.style.textAlign = 'center';
            div.style.border = '2px inset #ffc403';
            div.style.borderRadius = '0.3em';
            div.style.marginTop = '4px';
            div.style.marginBottom = '4px';
            div.style.background = 'rgba(0, 191, 255, 0.6)';
            div.style.height = 'calc(3.09em - 2.47px)';

            switch (objState) {
                case 0:
                    {
                        div.style.backgroundImage = 'url("' + bgRc + '")';
                        div.onclick = function () {
                            clickF();
                        }
                    }; break;
                case 1:
                    {
                        div.style.backgroundImage = '';
                    }; break;
                case 2:
                    {
                        div.style.backgroundImage = 'url("Pic/crossimg/wrong.png")';
                    }; break;
            }
            //if (objHasBeenSelected) {
            //    div.style.backgroundImage = 'url("Pic/crossimg/wrong.png")';
            //}
            //else {

            //}
            div.style.backgroundSize = 'auto calc(1.5em - 1.2px)';
            div.style.backgroundPosition = 'center center';
            div.style.backgroundRepeat = 'no-repeat';
            div.id = id;
            //if (objHasBeenSelected) {
            //}
            //else {

            //}

            div.classList.add('costomButton');
            divTaskOperatingPanel.appendChild(div);
        }
        document.body.appendChild(divTaskOperatingPanel);

        var carState = objMain.carState["car"];

        var attackF = function () {
            addItemToTaskOperatingPanle('攻击', 'attackBtn', function () {
                objMain.canSelect = false;
                if (objMain.carState["car"] == 'waitAtBaseStation' || objMain.carState["car"] == 'waitOnRoad') {
                    var selectObj = objMain.selectObj.obj;
                    var customTagIndexKey = selectObj.name.substring(5);
                    if (objMain.othersBasePoint[customTagIndexKey] != undefined) {
                        var fPIndex = objMain.othersBasePoint[customTagIndexKey].fPIndex;
                        objMain.ws.send(JSON.stringify({ 'c': 'Attack', 'TargetOwner': customTagIndexKey, 'Target': fPIndex }));

                    }
                    objMain.selectObj.obj = null;
                    objMain.selectObj.type = '';
                    operatePanel.refresh();
                }
            });

        };
        var lookUp = function () {
            addItemToTaskOperatingPanle('查看', 'viewBtn', function () {
                objMain.canSelect = false;
                if (objMain.carState["car"] == 'waitAtBaseStation' || objMain.carState["car"] == 'waitOnRoad') {
                    var selectObj = objMain.selectObj.obj;
                    var animationData =
                    {
                        old: {
                            x: objMain.controls.target.x,
                            y: objMain.controls.target.y,
                            z: objMain.controls.target.z,
                            t: Date.now()
                        },
                        newT:
                        {
                            x: objMain.selectObj.obj.position.x,
                            y: objMain.selectObj.obj.position.y,
                            z: objMain.selectObj.obj.position.z,
                            t: Date.now() + 3000
                        }
                    };
                    objMain.heightLevel = objMain.selectObj.obj.position.y;
                    objMain.camaraAnimateData = animationData;
                    objMain.selectObj.obj = null;
                    objMain.selectObj.type = '';
                    operatePanel.refresh();
                }
            });
        };
        var cancelBuildingDetailF = function () {
            addItemToTaskOperatingPanle('取消', 'cancelBuildingDetailF', function () {
                objMain.canSelect = false;
                if (objMain.carState["car"] == 'waitAtBaseStation' || objMain.carState["car"] == 'waitOnRoad') {
                    objMain.ws.send(JSON.stringify({ c: 'CancleLookForBuildings' }));
                    objMain.selectObj.obj = null;
                    objMain.selectObj.type = '';
                }
            });
        };
        var buildingDetailF = function () {
            addItemToTaskOperatingPanle('求福', 'buildingGetRewardBtn', function () {
                objMain.canSelect = false;
                if (objMain.carState["car"] == 'waitOnRoad') {
                    var selectObj = objMain.selectObj.obj;
                    var animationData =
                    {
                        old: {
                            x: objMain.controls.target.x,
                            y: objMain.controls.target.y,
                            z: objMain.controls.target.z,
                            t: Date.now()
                        },
                        newT:
                        {
                            x: objMain.selectObj.obj.position.x,
                            y: objMain.selectObj.obj.position.y,
                            z: objMain.selectObj.obj.position.z,
                            t: Date.now() + 3000
                        }
                    };
                    objMain.camaraAnimateData = animationData;
                    if (objMain.selectObj.obj != null) {
                        var selectObjName = objMain.selectObj.obj.name;
                        objMain.ws.send(JSON.stringify({ c: 'GetRewardFromBuildings', 'selectObjName': selectObjName }));
                    }
                    objMain.selectObj.obj = null;
                    objMain.selectObj.type = '';
                    operatePanel.refresh();
                }
                else if (objMain.carState["car"] == 'waitAtBaseStation') {
                    var selectObj = objMain.selectObj.obj;
                    var animationData =
                    {
                        old: {
                            x: objMain.controls.target.x,
                            y: objMain.controls.target.y,
                            z: objMain.controls.target.z,
                            t: Date.now()
                        },
                        newT:
                        {
                            x: objMain.selectObj.obj.position.x,
                            y: objMain.selectObj.obj.position.y,
                            z: objMain.selectObj.obj.position.z,
                            t: Date.now() + 3000
                        }
                    };
                    objMain.camaraAnimateData = animationData;
                    objMain.selectObj.obj = null;
                    objMain.selectObj.type = '';
                    operatePanel.refresh();
                    $.notify('在基地求福不能提升能力', 'info');
                }
            });
            addItemToTaskOperatingPanle('详情', 'buildingDetailBtn', function () {
                objMain.canSelect = false;
                if (objMain.carState["car"] == 'waitAtBaseStation' || objMain.carState["car"] == 'waitOnRoad') {
                    var selectObj = objMain.selectObj.obj;
                    var animationData =
                    {
                        old: {
                            x: objMain.controls.target.x,
                            y: objMain.controls.target.y,
                            z: objMain.controls.target.z,
                            t: Date.now()
                        },
                        newT:
                        {
                            x: objMain.selectObj.obj.position.x,
                            y: objMain.selectObj.obj.position.y,
                            z: objMain.selectObj.obj.position.z,
                            t: Date.now() + 3000
                        }
                    };
                    objMain.camaraAnimateData = animationData;
                    if (objMain.selectObj.obj != null) {
                        var selectObjName = objMain.selectObj.obj.name;
                        objMain.ws.send(JSON.stringify({ c: 'LookForBuildings', 'selectObjName': selectObjName }));
                    }
                    objMain.selectObj.obj = null;
                    objMain.selectObj.type = '';
                    operatePanel.refresh();
                }
            });
        };
        var selectPanle = function () {
            divTaskOperatingPanel.style.top = 'calc(50% - 6em - 4px)';
            divTaskOperatingPanel.style.right = 'calc(50% - 6em - 10px)';

            if (objMain.directionGroup.children.length > 2) {
                divTaskOperatingPanel.style.height = 'calc(9.27em + 4.59px)';
                divTaskOperatingPanel.style.top = 'calc(50% - 6em - 4px)';
            }
            if (objMain.directionGroup.children.length > 3) {
                divTaskOperatingPanel.style.height = 'calc(12.36em + 6.12px)';
                divTaskOperatingPanel.style.top = 'calc(50% - 9em - 10px)';
            }
            if (objMain.directionGroup.children.length > 4) {
                divTaskOperatingPanel.style.height = 'calc(15.45em + 7.65px)';
                divTaskOperatingPanel.style.top = 'calc(50% - 12em - 16px)';
            }
            addItemToTaskOperatingPanle2('Pic/crossimg/cross.png', 'selectDirectionBtn', function () {
                if (objMain.carState["car"] == 'selecting') {

                    if (objMain.directionGroup.children.length > 0) {
                        //  var p = objMain.directionGroup.children[0].position;
                        var selectObj = objMain.directionGroup.children[0];
                        var animationData =
                        {
                            old: {
                                x: objMain.controls.target.x,
                                y: objMain.controls.target.y,
                                z: objMain.controls.target.z,
                                t: Date.now()
                            },
                            newT:
                            {
                                x: selectObj.position.x,
                                y: selectObj.position.y,
                                z: selectObj.position.z,
                                t: Date.now() + 3000
                            }
                        };
                        objMain.camaraAnimateData = animationData;
                        if (objMain.directionGroup.children.length > 1)
                            objMain.directionGroup.children[1].userData.objState = 0;
                        if (objMain.directionGroup.children.length > 2)
                            objMain.directionGroup.children[2].userData.objState = 0;
                        if (objMain.directionGroup.children.length > 3)
                            objMain.directionGroup.children[3].userData.objState = 0;
                        operatePanel.refresh();
                    }
                }
            }, 0);
            if (objMain.directionGroup.children.length > 1)
                addItemToTaskOperatingPanle2('Pic/crossimg/A.png', 'selectDirectionBtn_01', function () {
                    if (objMain.carState["car"] == 'selecting') {
                        if (objMain.directionGroup.children.length > 1) {
                            var rotationY = objMain.directionGroup.children[1].rotation.y;
                            var postionCrossKey = objMain.directionGroup.children[1].userData.postionCrossKey;
                            var json = JSON.stringify({ c: 'ViewAngle', 'rotationY': rotationY, 'postionCrossKey': postionCrossKey, 'uid': '' });
                            objMain.ws.send(json);
                            objMain.jscwObj.play('A');
                            objMain.directionGroup.children[1].userData.objState = 1;
                            operatePanel.refresh();
                            setTimeout(() => {
                                objMain.targetMusic.change('pass');
                            }, 3000);
                        }
                    }
                }, objMain.directionGroup.children[1].userData.objState);
            if (objMain.directionGroup.children.length > 2)
                addItemToTaskOperatingPanle2('Pic/crossimg/B.png', 'selectDirectionBtn_02', function () {
                    if (objMain.carState["car"] == 'selecting') {
                        if (objMain.directionGroup.children.length > 2) {
                            var rotationY = objMain.directionGroup.children[2].rotation.y;
                            var postionCrossKey = objMain.directionGroup.children[2].userData.postionCrossKey;
                            var json = JSON.stringify({ c: 'ViewAngle', 'rotationY': rotationY, 'postionCrossKey': postionCrossKey, 'uid': '' });
                            objMain.ws.send(json);
                            objMain.jscwObj.play('B');
                            objMain.directionGroup.children[2].userData.objState = 1;
                            operatePanel.refresh();
                            setTimeout(() => {
                                objMain.targetMusic.change('pass');
                            }, 3000);
                        }
                    }
                }, objMain.directionGroup.children[2].userData.objState);
            if (objMain.directionGroup.children.length > 3)
                addItemToTaskOperatingPanle2('Pic/crossimg/C.png', 'selectDirectionBtn_03', function () {
                    if (objMain.carState["car"] == 'selecting') {
                        if (objMain.directionGroup.children.length > 3) {
                            var rotationY = objMain.directionGroup.children[3].rotation.y;
                            var postionCrossKey = objMain.directionGroup.children[3].userData.postionCrossKey;
                            var json = JSON.stringify({ c: 'ViewAngle', 'rotationY': rotationY, 'postionCrossKey': postionCrossKey, 'uid': '' });
                            objMain.ws.send(json);
                            objMain.jscwObj.play('C');
                            objMain.directionGroup.children[3].userData.objState = 1;
                            operatePanel.refresh();
                            setTimeout(() => {
                                objMain.targetMusic.change('pass');
                            }, 3000);
                        }
                    }
                }, objMain.directionGroup.children[3].userData.objState);

            if (true)
                addItemToTaskOperatingPanle2('Pic/crossimg/getrightAnswer.png', 'selectDirectionBtn_GetAnswer', function () {
                    if (objMain.carState["car"] == 'selecting') {

                        if (objMain.directionGroup.children.length > 0) {
                            var json = JSON.stringify({ c: 'AskWhichToSelect' });
                            objMain.jscwObj.play('ASK');
                            objMain.ws.send(json);
                        }
                    }
                }, 0);
        };
        switch (carState) {
            case 'waitAtBaseStation':
                {
                    switch (objMain.Task.state) {
                        case 'collect':
                            {
                                addItemToTaskOperatingPanle('收集', 'collectBtn', function () {
                                    objMain.canSelect = false;
                                    if (objMain.carState["car"] == 'waitAtBaseStation' || objMain.carState["car"] == 'waitOnRoad') {
                                        var selectObj = objMain.selectObj.obj;
                                        var radius = 0.00001;
                                        objMain.ws.send(JSON.stringify(
                                            {
                                                'c': 'SmallMapClick',
                                                'lon': selectObj.userData.collectPosition.Fp.positionLongitudeOnRoad,
                                                'lat': selectObj.userData.collectPosition.Fp.positionLatitudeOnRoad,
                                                'radius': radius
                                            }));

                                        objMain.selectObj.obj = null;
                                        objMain.selectObj.type = '';
                                        operatePanel.refresh();
                                        whetherGo.cancle();
                                    }
                                });
                                lookUp();
                            }; break;
                        case 'attack':
                            {
                            }; break;
                        case 'mile':
                        case 'volume':
                        case 'speed':
                            {
                                addItemToTaskOperatingPanle('寻宝', 'promoteBtn', function () {
                                    objMain.canSelect = false;
                                    if (objMain.carState["car"] == 'waitAtBaseStation' || objMain.carState["car"] == 'waitOnRoad') {
                                        var selectObj = objMain.selectObj.obj;
                                        var radius = 0.00001;
                                        objMain.ws.send(JSON.stringify(
                                            {
                                                'c': 'SmallMapClick',
                                                'lon': selectObj.userData.Fp.positionLongitudeOnRoad,
                                                'lat': selectObj.userData.Fp.positionLatitudeOnRoad,
                                                'radius': radius
                                            }));

                                        objMain.selectObj.obj = null;
                                        objMain.selectObj.type = '';
                                        operatePanel.refresh();
                                        whetherGo.cancle();
                                    }
                                });
                                lookUp();
                            }; break;
                        case 'ability':
                            {
                            }; break;
                        case 'setReturn':
                            {
                                lookUp();
                            }; break;
                        case 'building':
                            {
                                if (objMain.state == 'OnLine') {

                                    if (objMain.selectObj.obj != null && objMain.selectObj.obj.userData != undefined && objMain.selectObj.obj.userData.modelType == 'building') {
                                        buildingDetailF();
                                    }
                                    else {
                                        lookUp();
                                    }
                                }
                            }; break;
                    }
                }; break;
            case 'waitOnRoad':
                {
                    switch (objMain.Task.state) {
                        case 'collect':
                            {
                                addItemToTaskOperatingPanle('收集', 'collectBtn', function () {
                                    objMain.canSelect = false;
                                    if (objMain.carState["car"] == 'waitAtBaseStation' || objMain.carState["car"] == 'waitOnRoad') {
                                        var selectObj = objMain.selectObj.obj;
                                        // console.log('selectObj', selectObj.userData.collectPosition.Fp.FastenPositionID);
                                        //  objMain.ws.send(JSON.stringify({ 'c': 'Collect', 'cType': 'findWork', 'fastenpositionID': selectObj.userData.collectPosition.Fp.FastenPositionID, 'collectIndex': selectObj.userData.collectPosition.collectIndex }));
                                        var radius = 0.00001;
                                        objMain.ws.send(JSON.stringify(
                                            {
                                                'c': 'SmallMapClick',
                                                'lon': selectObj.userData.collectPosition.Fp.positionLongitudeOnRoad,
                                                'lat': selectObj.userData.collectPosition.Fp.positionLatitudeOnRoad,
                                                'radius': radius
                                            }));

                                        objMain.selectObj.obj = null;
                                        objMain.selectObj.type = '';
                                        operatePanel.refresh();
                                        whetherGo.cancle();
                                    }
                                });
                                lookUp();
                            }; break;
                        case 'attack':
                            {
                                //attackF();
                                //magicF();
                                //lookUp();
                            }; break;
                        case 'mile':
                        case 'volume':
                        case 'speed':
                            {
                                addItemToTaskOperatingPanle('寻宝', 'promoteBtn', function () {
                                    objMain.canSelect = false;
                                    if (objMain.carState["car"] == 'waitAtBaseStation' || objMain.carState["car"] == 'waitOnRoad') {
                                        var selectObj = objMain.selectObj.obj;
                                        var radius = 0.00001;
                                        objMain.ws.send(JSON.stringify(
                                            {
                                                'c': 'SmallMapClick',
                                                'lon': selectObj.userData.Fp.positionLongitudeOnRoad,
                                                'lat': selectObj.userData.Fp.positionLatitudeOnRoad,
                                                'radius': radius
                                            }));
                                        objMain.selectObj.obj = null;
                                        objMain.selectObj.type = '';
                                        operatePanel.refresh();
                                        whetherGo.cancle();
                                    }
                                });
                                lookUp();
                            }; break;
                        case 'setReturn':
                            {
                                lookUp();
                            }; break;
                        case 'building':
                            {
                                if (objMain.state == 'LookForBuildings') {
                                    cancelBuildingDetailF();
                                }
                                else if (objMain.state == 'OnLine')

                                    if (objMain.selectObj.obj == null) {
                                        lookUp();
                                    }
                                    else if (objMain.selectObj.obj.userData) {
                                        if (objMain.selectObj.obj.userData.modelType == 'building') {
                                            buildingDetailF();
                                        }
                                        else
                                            lookUp();
                                    }
                                    else {
                                        lookUp();
                                    }
                            }; break;
                    }
                    if (objMain.state == 'OnLine')
                        addItemToTaskOperatingPanle('回基地', 'goBackBtn', function () {
                            objMain.canSelect = false;
                            if (objMain.carState["car"] == 'waitOnRoad') {
                                var selectObj = objMain.selectObj.obj;
                                objMain.ws.send(JSON.stringify({ 'c': 'SetCarReturn' }));
                                objMain.selectObj.obj = null;
                                objMain.selectObj.type = '';
                                operatePanel.refresh();
                                whetherGo.cancle();
                            }
                        });
                }; break;
            case 'selecting':
                {
                    selectPanle();
                }; break;
        }
    }
};

var selectPosition = {
    clearPanel: function () {
        while (document.getElementById('taskOperatingPanel') != null) {
            document.getElementById('taskOperatingPanel').remove();
        }
    },
    refresh: function () {

        selectPosition.clearPanel();
        var divTaskOperatingPanel = document.createElement('div');
        divTaskOperatingPanel.id = 'taskOperatingPanel';

        divTaskOperatingPanel.style.position = 'absolute';
        divTaskOperatingPanel.style.zIndex = '7';
        divTaskOperatingPanel.style.right = '20px';
        divTaskOperatingPanel.style.border = 'none';
        divTaskOperatingPanel.style.width = '5em';
        divTaskOperatingPanel.style.color = 'green';
        //根据底部计算所得
        divTaskOperatingPanel.style.bottom = 'calc(2.5em + 14px)';

        var addItemToTaskOperatingPanle2 = function (bgRc, id, clickF, objState) {
            var div = document.createElement('div');
            div.style.width = 'calc(5em - 4px)';
            div.style.textAlign = 'center';
            div.style.border = '2px inset #ffc403';
            div.style.borderRadius = '0.3em';
            div.style.marginTop = '4px';
            div.style.marginBottom = '4px';
            div.style.background = 'rgba(0, 191, 255, 0.6)';
            div.style.height = 'calc(3.09em - 2.47px)';

            switch (objState) {
                case 0:
                    {
                        div.style.backgroundImage = 'url("' + bgRc + '")';
                        div.onclick = function () {
                            clickF();
                        }
                    }; break;
                case 1:
                    {
                        div.style.backgroundImage = '';
                    }; break;
                case 2:
                    {
                        div.style.backgroundImage = 'url("Pic/crossimg/wrong.png")';
                    }; break;
            }
            //if (objHasBeenSelected) {
            //    div.style.backgroundImage = 'url("Pic/crossimg/wrong.png")';
            //}
            //else {

            //}
            div.style.backgroundSize = 'auto calc(1.5em - 1.2px)';
            div.style.backgroundPosition = 'center center';
            div.style.backgroundRepeat = 'no-repeat';
            div.id = id;
            //if (objHasBeenSelected) {
            //}
            //else {

            //}

            div.classList.add('costomButton');
            divTaskOperatingPanel.appendChild(div);
        }
        document.body.appendChild(divTaskOperatingPanel);

        addItemToTaskOperatingPanle2('Pic/crossimg/east.png', 'selectEast', function () {
            objMain.ws.send(JSON.stringify({ c: 'PositionSelect', Position: 'east' }));
        }, 0);
        addItemToTaskOperatingPanle2('Pic/crossimg/south.png', 'selectSouth', function () {
            objMain.ws.send(JSON.stringify({ c: 'PositionSelect', Position: 'south' }));
        }, 0);
        addItemToTaskOperatingPanle2('Pic/crossimg/west.png', 'selectWest', function () {
            objMain.ws.send(JSON.stringify({ c: 'PositionSelect', Position: 'west' }));
        }, 0);
        addItemToTaskOperatingPanle2('Pic/crossimg/north.png', 'selectNorth', function () {
            objMain.ws.send(JSON.stringify({ c: 'PositionSelect', Position: 'north' }));
        }, 0);
    },
    refresh2: function () {

        selectPosition.clearPanel();
        var divTaskOperatingPanel = document.createElement('div');
        divTaskOperatingPanel.id = 'taskOperatingPanel';

        divTaskOperatingPanel.style.position = 'absolute';
        divTaskOperatingPanel.style.zIndex = '7';
        divTaskOperatingPanel.style.right = '20px';
        divTaskOperatingPanel.style.border = 'none';
        divTaskOperatingPanel.style.width = '5em';
        divTaskOperatingPanel.style.color = 'green';
        //根据底部计算所得
        divTaskOperatingPanel.style.bottom = 'calc(2.5em + 14px)';

        var addItemToTaskOperatingPanle2 = function (bgRc, id, clickF, objState) {
            var div = document.createElement('div');
            div.style.width = 'calc(5em - 4px)';
            div.style.textAlign = 'center';
            div.style.border = '2px inset #ffc403';
            div.style.borderRadius = '0.3em';
            div.style.marginTop = '4px';
            div.style.marginBottom = '4px';
            div.style.background = 'rgba(0, 191, 255, 0.6)';
            div.style.height = 'calc(3.09em - 2.47px)';

            switch (objState) {
                case 0:
                    {
                        div.style.backgroundImage = 'url("' + bgRc + '")';
                        div.onclick = function () {
                            clickF();
                        }
                    }; break;
                case 1:
                    {
                        div.style.backgroundImage = '';
                    }; break;
                case 2:
                    {
                        div.style.backgroundImage = 'url("Pic/crossimg/wrong.png")';
                    }; break;
            }
            //if (objHasBeenSelected) {
            //    div.style.backgroundImage = 'url("Pic/crossimg/wrong.png")';
            //}
            //else {

            //}
            div.style.backgroundSize = 'auto calc(1.5em - 1.2px)';
            div.style.backgroundPosition = 'center center';
            div.style.backgroundRepeat = 'no-repeat';
            div.id = id;
            //if (objHasBeenSelected) {
            //}
            //else {

            //}

            div.classList.add('costomButton');
            divTaskOperatingPanel.appendChild(div);
        }
        document.body.appendChild(divTaskOperatingPanel);

        addItemToTaskOperatingPanle2('Pic/crossimg/east.png', 'startPositionSelect', function () {
            objMain.ws.send(JSON.stringify({ c: 'StartPositionSelect' }));
            objMain.diceRotating = true;
        }, 0);
    }

    //return this;
}

var diceDisplay =
{
    showValue: function (v1, v2, v3, v4) {
        if (v3 + v4 == 0) { }
        else {
            v1 = v3;
            v2 = v4;
        }
        switch (v1) {
            case 1:
                {
                    objMain.diceGroup.getObjectByName('dice1').rotation.set(-Math.PI / 2, 0, 0, 'XYZ');
                }; break;
            case 2:
                {
                    objMain.diceGroup.getObjectByName('dice1').rotation.set(0, 0, Math.PI / 2, 'XYZ');
                }; break;
            case 3:
                {
                    objMain.diceGroup.getObjectByName('dice1').rotation.set(-Math.PI, 0, 0, 'XYZ');
                }; break;
            case 4:
                {
                    objMain.diceGroup.getObjectByName('dice1').rotation.set(0, 0, 0, 'XYZ');
                }; break;
            case 5:
                {
                    objMain.diceGroup.getObjectByName('dice1').rotation.set(0, 0, -Math.PI / 2, 'XYZ');
                }; break;
            case 6:
                {
                    objMain.diceGroup.getObjectByName('dice1').rotation.set(Math.PI / 2, 0, 0, 'XYZ');
                }; break;
        }
        switch (v2) {
            case 1:
                {
                    objMain.diceGroup.getObjectByName('dice2').rotation.set(-Math.PI / 2, 0, 0, 'XYZ');
                }; break;
            case 2:
                {
                    objMain.diceGroup.getObjectByName('dice2').rotation.set(0, 0, Math.PI / 2, 'XYZ');
                }; break;
            case 3:
                {
                    objMain.diceGroup.getObjectByName('dice2').rotation.set(-Math.PI, 0, 0, 'XYZ');
                }; break;
            case 4:
                {
                    objMain.diceGroup.getObjectByName('dice2').rotation.set(0, 0, 0, 'XYZ');
                }; break;
            case 5:
                {
                    objMain.diceGroup.getObjectByName('dice2').rotation.set(0, 0, -Math.PI / 2, 'XYZ');
                }; break;
            case 6:
                {
                    objMain.diceGroup.getObjectByName('dice2').rotation.set(Math.PI / 2, 0, 0, 'XYZ');
                }; break;
        }
    }
}

var ModelOperateF =
{
    f: function (received_obj, config) {
        var manager = new THREE.LoadingManager();
        new THREE.MTLLoader(manager)
            .loadTextOnly(received_obj.Mtl, 'data:image/jpeg;base64,' + received_obj.Img, function (materials) {
                materials.preload();
                new THREE.OBJLoader(manager)
                    .setMaterials(materials)
                    //.setPath('/Pic/')
                    .loadTextOnly(received_obj.Obj, function (object) {
                        //console.log('o', object);
                        //for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                        //    if (object.children[iOfO].isMesh) {
                        //        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                        //            object.children[iOfO].material[mi].transparent = true;
                        //            object.children[iOfO].material[mi].opacity = 1;
                        //            object.children[iOfO].material[mi].side = THREE.FrontSide;
                        //            object.children[iOfO].material[mi].color = new THREE.Color(0.45, 0.45, 0.45);
                        //        }
                        //    }
                        //}
                        //console.log('o', object);
                        if (config.scale == undefined)
                            object.scale.set(0.003, 0.003, 0.003);
                        else
                            object.scale.set(config.scale.x, config.scale.y, config.scale.z);
                        if (config.rotateX == undefined) { }
                        else {
                            object.rotateX(config.rotateX);
                        }
                        // object.rotateX(-Math.PI / 2);
                        //  objMain.Model
                        // objMain.rmbModel[field] = object;
                        if (config.transparent != undefined) {
                            for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                if (object.children[iOfO].isMesh) {
                                    if (object.children[iOfO].material.isMaterial) {
                                        object.children[iOfO].material.transparent = true;
                                        object.children[iOfO].material.opacity = config.transparent.opacity;
                                    }
                                    else
                                        for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                            object.children[iOfO].material[mi].transparent = true;
                                            object.children[iOfO].material[mi].opacity = config.transparent.opacity;
                                        }
                                }
                            }
                        }
                        if (config.color != undefined) {
                            for (var iOfO = 0; iOfO < object.children.length; iOfO++) {
                                if (object.children[iOfO].isMesh) {
                                    for (var mi = 0; mi < object.children[iOfO].material.length; mi++) {
                                        object.children[iOfO].material[mi].color = new THREE.Color(config.color.r, config.color.g, config.color.b);
                                    }
                                }
                            }
                        }
                        if (config.rotate != undefined) {
                            object.rotateX(config.rotate.x);
                            object.rotateX(config.rotate.y);
                            object.rotateX(config.rotate.z);
                        }
                        if (config.bind != undefined) {
                            config.bind(object);
                        }



                    }, function () { }, function () { });
            });
    }
};




var SetBustPage = function () {
    window.cancelAnimationFrame(objMain.animateObj)
    document.body.innerHTML = '';
    var img = document.createElement('img');
    img.src = 'Pic/gameOver.jpg';
    //var div = document.createElement('div');
    //div.appendChild(img);
    img.style.position = 'absolute';
    img.style.top = '50%';
    img.style.left = '50%';
    img.style.width = 'calc(80%)';
    img.style.height = 'auto';
    img.style.maxWidth = 'calc(80%)';
    img.style.maxHeight = 'calc(80%)';
    img.style.minWidth = 'calc(20%)';
    img.style.minWidth = 'calc(20%)';
    img.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(img);
};
var drawGoodsSelection =
{
    f: function (received_obj) {
        /*
         * 依据objText，mtlText，base64画图
         */
        objMain.mainF.removeF.clearGroup(objMain.buildingSelectionGroup);
        drawGoodsSelection.data = [];
        for (var i = 0; i < received_obj.selections.length; i++) {
            var points = [];
            points.push(new THREE.Vector3(received_obj.x, received_obj.y * objMain.heightAmplify, received_obj.z));
            points.push(new THREE.Vector3(received_obj.positions[i * 3], received_obj.positions[i * 3 + 1] * objMain.heightAmplify, received_obj.positions[i * 3 + 2]));

            var geometry = new THREE.BufferGeometry().setFromPoints(points);
            var line = new THREE.Line(geometry, drawGoodsSelection.material);
            objMain.buildingSelectionGroup.add(line);
        }
        if (i > 0) {
            var v = new THREE.Vector3(received_obj.x, received_obj.y * objMain.heightAmplify, received_obj.z);
            drawGoodsSelection.data.push(v);
        }
        for (var i = 0; i < received_obj.selections.length; i++) {
            var v = new THREE.Vector3(received_obj.positions[i * 3], received_obj.positions[i * 3 + 1] * objMain.heightAmplify, received_obj.positions[i * 3 + 2]);
            drawGoodsSelection.data.push(v);
        }
    },
    material: new THREE.LineBasicMaterial({ color: 0x33FF00 }),
    data: []
};

var DiamondModel =
{
    black: null,
    blue: null,
    green: null,
    red: null,
    initialize: function (received_obj) {
        var indexStrs = ['black', 'blue', 'green', 'red'];
        for (var i = 0; i < 4; i++) {
            var indexV = i;
            var indexStr = indexStrs[indexV];
            var manager = new THREE.LoadingManager();
            new THREE.MTLLoader(manager)
                .loadTextOnly(received_obj.mtlText, 'data:image/jpeg;base64,' + received_obj.imageBase64s[indexV], function (materials) {
                    materials.preload();
                    // materials.depthTest = false;
                    new THREE.OBJLoader(manager)
                        .setMaterials(materials)
                        //.setPath('/Pic/')
                        .loadTextOnly(received_obj.objText, function (object) {
                            DiamondModel[indexStr] = object;
                        }, function () { }, function () { });
                });
        }

    }
};

var sceneYUpdate = function (deltaY) {

}

var OperateHelp =
{
    isOn: false,
    f: function () {
        if (this.isOn && objMain.state == 'OnLine') {
            if (objMain.directionGroup != null) {
                if (objMain.directionGroup.visible) {
                    if (this.probability.direction < Math.random()) {
                        $.notify(
                            AMsg.directionNotify,
                            {
                                autoHide: true,
                                className: 'info',
                                autoHideDelay: 20000,
                            });
                        this.probability.direction += 0.015;
                    }
                }
            }

            if (objMain.carState.car) {
                if (objMain.carState.car == 'waitAtBaseStation') {
                    if (this.probability.waitAtBaseStation < Math.random()) {
                        $.notify(AMsg.waitAtStationNotify,
                            {
                                autoHide: true,
                                className: 'info',
                                autoHideDelay: 20000,
                                position: 'left',
                            });
                        this.probability.waitAtBaseStation += 0.015;
                    }
                }
            }
            //objMain.carState.car
        }
    },
    probability:
    {
        direction: 0,
        waitAtBaseStation: 0
    }
};
setInterval("OperateHelp.f();", 12000);

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
    //组织缩放图片！
});

var UpdateOtherBasePoint = function () {
    for (var key in objMain.othersBasePoint) {
        var indexKey = key + '';
        var basePoint = objMain.othersBasePoint[key].basePoint;
        //  drawPoint('orange', basePoint, indexKey);
        objMain.mainF.drawLineOfFpToRoad(basePoint, objMain.playerGroup, 'orange', indexKey);
        objMain.mainF.initilizeCars(basePoint, 'orange', indexKey, false, objMain.othersBasePoint[key].positionInStation);
        //  console.log('哦哦', '出现了预料的情况！！！');
        //alert();
    }
}


var lookInfoForCar = function () {
    // objMain.mouse = new THREE.Vector2(1, 1);
    objMain.raycaster.setFromCamera(objMain.mouse, objMain.camera);

    for (var i = 0; i < objMain.carGroup.children.length; i++) {
        if (objMain.carGroup.children[i].type == "Group") {
            for (var j = 0; j < objMain.carGroup.children[i].children.length; j++) {
                var intersection = objMain.raycaster.intersectObject(objMain.carGroup.children[i].children[j]);
                if (intersection.length > 0) {
                    var carName = objMain.carGroup.children[i].name;
                    var indexKey = carName.split('_')[1];
                    if (objMain.othersBasePoint[indexKey]) {
                        $.notify('这是【' + objMain.othersBasePoint[indexKey].playerName + '】的车', 'msg');
                        return;
                    }
                }
            }
        }
    }


}

var showDesk = function () {
    var onProgress = function () { };
    var onError = function () { };
    new THREE.MTLLoader()
        .setPath('mahjong/desk/')
        .load('mahjongdesk.mtl', function (materials) {

            materials.preload();

            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath('mahjong/desk/')
                .load('mahjongdesk.obj', function (object) {

                    object.position.y = 0;
                    object.name = 'mahjongDesk';
                    object.scale.set(0.4, 0.4, 0.4);
                    object.rotateY(Math.PI)
                    object.castShadow = true;
                    object.receiveShadow = true
                    objMain.scene.add(object);

                }, onProgress, onError);

        });
}

var showAxes = function () {
    objMain.axesHelper = new THREE.AxesHelper(20);
    objMain.axesHelper.name = 'axesHelper';
    // objMain.scene.getObjectByName('axesHelper').position.set(received_obj.mctX / 256, 0, 0 - received_obj.mctY / 256);
    objMain.axesHelper.position.set(0, 0, 0);
    objMain.scene.add(objMain.axesHelper);
}

var mahjongDisplay =
{
    load: function () {
        var mahjongArray = [0,
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            11, 12, 13, 14, 15, 16, 17, 18, 19,
            21, 22, 23, 24, 25, 26, 27, 28, 29,
            40, 47, 54, 61, 68, 75, 82
        ]

        for (var i = 0; i < mahjongArray.length; i++) {

            var mtlFileName = (i == 0 ? 'm0.mtl' : ('m' + 'all' + '.mtl'));
            var objFileName = 'm' + mahjongArray[i] + '.obj';
            var objName = 'm' + mahjongArray[i];

            var loadF = function (mtlFileName, objFileName, objName) {
                var onProgress = function () { };
                var onError = function () { };
                new THREE.MTLLoader()
                    .setPath('mahjong/majong/')
                    .load(mtlFileName, function (materials) {

                        materials.preload();

                        new THREE.OBJLoader()
                            .setMaterials(materials)
                            .setPath('mahjong/majong/')
                            .load(objFileName, function (object) {

                                object.position.y = 0;
                                object.name = objName;
                                //   object.scale.set(0.4, 0.4, 0.4);
                                // object.rotateY(Math.PI)
                                object.castShadow = true;
                                objMain.mahjongsModel[objName] = object;
                                // objMain.scene.add(object);

                            }, onProgress, onError);

                    });
            }

            loadF(mtlFileName, objFileName, objName);
        }
        //{
        //    var onProgress = function () { };
        //    var onError = function () { };
        //    new THREE.MTLLoader()
        //        .setPath('mahjong/majong/')
        //        .load('m0.mtl', function (materials) {

        //            materials.preload();

        //            new THREE.OBJLoader()
        //                .setMaterials(materials)
        //                .setPath('mahjong/majong/')
        //                .load('m0.obj', function (object) {

        //                    object.position.y = 0;
        //                    object.name = 'm0';
        //                    //   object.scale.set(0.4, 0.4, 0.4);
        //                    // object.rotateY(Math.PI)
        //                    object.castShadow = true;
        //                    objMain.mahjongsModel.m0 = object;
        //                    // objMain.scene.add(object);

        //                }, onProgress, onError);

        //        });
        //}
        {
            var onProgress = function () { };
            var onError = function () { };
            new THREE.MTLLoader()
                .setPath('mahjong/majong/dice/')
                .load('dice.mtl', function (materials) {

                    materials.preload();

                    new THREE.OBJLoader()
                        .setMaterials(materials)
                        .setPath('mahjong/majong/dice/')
                        .load('dice.obj', function (object) {

                            object.position.y = 0.015;

                            object.scale.set(0.0015, 0.0015, 0.0015);
                            object.name = 'dice1';
                            object.rotateX(-Math.PI / 2)
                            //   object.scale.set(0.4, 0.4, 0.4);
                            // object.rotateY(Math.PI)
                            object.castShadow = true;
                            objMain.mahjongsModel.dice = object;
                            objMain.scene.add(object);
                            objMain.diceGroup.add(object);
                            var dice2 = object.clone();
                            dice2.position.x = 0.03;
                            dice2.name = 'dice2';
                            objMain.diceGroup.add(dice2);
                            //dice2.x
                            objMain.diceGroup.position.y = 0.8;

                        }, onProgress, onError);

                });
        }

    },
    sortedShow: function () {
        for (var i = 0; i < 34; i++) {
            var o = objMain.mahjongsModel.m0.clone();
            o.name = 'mahjong' + i;
            o.rotateX(Math.PI / 2);
            o.position.y = 0.8 + (i % 2 == 0 ? 0.03 : 0.01);
            objMain.mahjongsGroup.add(o);
            o.position.x += 0.25;
            o.position.z = -0.23 + Math.floor(i / 2) * 0.029;
            o.rotateZ(-Math.PI / 2);
            o.castShadow = true;
            //break;
            //  objMain.mahjongsGroup.add
        }
        for (var i = 34; i < 68; i++) {
            var o = objMain.mahjongsModel.m0.clone();
            o.name = 'mahjong' + i;
            o.rotateX(Math.PI / 2);
            o.position.y = 0.8 + (i % 2 == 0 ? 0.03 : 0.01);
            objMain.mahjongsGroup.add(o);
            o.position.z += 0.25;
            o.position.x = 0.23 - Math.floor((i % 34) / 2) * 0.029;
            o.rotateZ(0);
            o.castShadow = true;
        }
        for (var i = 68; i < 102; i++) {
            var o = objMain.mahjongsModel.m0.clone();
            o.name = 'mahjong' + i;
            o.rotateX(Math.PI / 2);
            o.position.y = 0.8 + (i % 2 == 0 ? 0.03 : 0.01);
            objMain.mahjongsGroup.add(o);
            o.position.x += -0.25;
            o.position.z = 0.23 - Math.floor((i % 34) / 2) * 0.029;
            o.rotateZ(Math.PI / 2);
            o.castShadow = true;
        }
        for (var i = 102; i < 136; i++) {
            var o = objMain.mahjongsModel.m0.clone();
            o.name = 'mahjong' + i;
            o.rotateX(Math.PI / 2);
            o.position.y = 0.8 + (i % 2 == 0 ? 0.03 : 0.01);
            objMain.mahjongsGroup.add(o);
            o.position.z += -0.25;
            o.position.x = -0.23 + Math.floor((i % 34) / 2) * 0.029;
            o.rotateZ(Math.PI);
            o.castShadow = true;
        }
    },
    showMahjongsOnHand: function (mahjongs) {
        var dic_Private = {};
        var dic_Peng = {};
        var dic_MingGang = {};
        var dic_AnGang = {};
        for (var i = 0; i < mahjongs.length; i += 3) {
            /*
            1代表自己，2代表下家,3代表对家,4代表上家，+10代表庄
            */
            if (mahjongs[i] % 10 == 1) {
                //第二行0代表没动作，1代表来牌，2代表出牌//12代表听，3代表碰，4代表杠，
                if (mahjongs[i + 1] % 10 == 1) {
                    //起的牌
                    if (dic_Private[mahjongs[i + 2]] == undefined) {
                        dic_Private[mahjongs[i + 2]] = 1;
                    }
                    else {
                        dic_Private[mahjongs[i + 2]]++;
                    }
                }
                else if (mahjongs[i + 1] % 10 == 2) {
                    //表示出牌或者听的牌。
                    if (dic_Private[mahjongs[i + 2]] == undefined) {
                        throw '出牌逻辑出去，对不上号';//出牌的时候，手里没有牌。当然报错。
                    }
                    else if (dic_Private[mahjongs[i + 2]] < 1) {
                        throw '出牌逻辑出去，对不上号,牌数小于1';
                        //出牌的时候，手里必须有牌
                    }
                    else {
                        dic_Private[mahjongs[i + 2]]--;
                    }
                }
                else if (mahjongs[i + 1] % 10 == 3) {
                    //表示碰牌。
                    if (dic_Private[mahjongs[i + 2]] == undefined) {
                        throw '碰牌逻辑出去，对不上号';
                    }
                    else if (dic_Private[mahjongs[i + 2]] < 2) {
                        throw '碰牌逻辑出去，对不上号，牌数小于2';
                    }
                    else {
                        dic_Private[mahjongs[i + 2]] -= 2;
                        if (dic_Peng[mahjongs[i + 2]] == undefined) {
                            dic_Peng[mahjongs[i + 2]] = 1;
                        }
                        else {
                            throw '碰牌逻辑出去，碰两次？';
                        }
                    }
                }
                else if (mahjongs[i + 1] % 10 == 4) {
                    //表示杠牌。
                    if (dic_Private[mahjongs[i + 2]] == undefined) {
                        throw '杠牌逻辑不对，对不上号';
                    }
                    else if (dic_Private[mahjongs[i + 2]] == 4) {
                        //暗杠
                        dic_Private[mahjongs[i + 2]] == 0;
                        dic_AnGang[mahjongs[i + 2]] = 1;
                        //throw '碰牌逻辑出去，对不上号，牌数小于2';
                    }
                    else if (dic_Private[mahjongs[i + 2]] == 1 && dic_Peng[mahjongs[i + 2]] == 1) {
                        //明杠，先碰后杠
                        //由一张单牌和一组碰，组成杠。
                        dic_MingGang[mahjongs[i + 2]] = 1;
                        dic_Peng[mahjongs[i + 2]] = 0;
                        dic_Private[mahjongs[i + 2]] = 0;
                    }
                    else if (dic_Private[mahjongs[i + 2]] == 3) {
                        if (i >= 3) {
                            if (mahjongs[i - 3] % 10 != 1 && mahjongs[i - 3] % 10 > 0) {
                                if (mahjongs[i - 3 + 1] == 2) {
                                    //** 别的玩家出牌*/
                                    if (mahjongs[i - 3 + 2] == mahjongs[i + 2]) {
                                        //即别的玩家出牌杠。
                                        dic_Private[mahjongs[i + 2]] = 0;
                                        dic_MingGang[mahjongs[i + 2]] = 1;
                                    }
                                }
                            }
                        }
                    }
                }
                //else if()
            }
        }
        var list_Private = [];
        for (let key in dic_Private) {
            // console.log(`键（Key）: ${key}, 值（Value）: ${obj[key]}`);
            //console.log(`键（Key）: ${key}, 值（Value）: ${dic_Private[key]}`);
            for (var i = 0; i < dic_Private[key]; i++) {
                list_Private.push(key);
            }
        }
        list_Private.sort((a, b) => a - b);
        objMain.mainF.removeF.clearGroup(objMain.mahjongsOnHandGroup);
        for (var i = 0; i < list_Private.length; i++) {
            var objOp = objMain.mahjongsModel['m' + list_Private[i]];
            var objClone = objOp.clone();
            objClone.rotateY(Math.PI / 2);
            objClone.name = 'list' + [i];
            objClone.position.y = 0.8 + 0;
            objClone.position.z = 0.029 * 6 - i * 0.029;
            objClone.position.x = 0.34;
            objMain.mahjongsOnHandGroup.add(objClone);
            // break;
            //objMain.mainF.clearGroup()
            //var 
            // objMain.mahjongsOnHandGroup.add()
        }

        if (list_Private.length == 14 || list_Private.length == 11 || list_Private.length == 8) {

        }
    },
    checkCanTing: function (list_Private, dic_Peng, dic_MingGang, dic_AnGang) {
        let k = 1;
        for (let i = 0; i < list_Private.length; i++) {

            if (list_Private[i] > 0 && list_Private[i] < 10) {
                /*此条件为检验饼子*/
                if (k % 2 != 0) {
                    k *= 2;
                }
            }
            else if (list_Private[i] > 10 && list_Private[i] < 20) {
                /*此条件为检验条子*/
                if (k % 3 != 0) {
                    k *= 3;
                }
            }
            else if (list_Private[i] > 20 && list_Private[i] < 30) {
                /*此条件为检验万子*/
                if (k % 5 != 0) {
                    k *= 5;
                }
            }
            else {
                /*此条件为检验风*/
                if (k % 7 != 0) {
                    k *= 5;
                }
            }
        }
        for (let key in dic_Peng) {
            if (key > 0 && key < 10) {
                /*此条件为检验饼子*/
                if (k % 2 != 0) {
                    k *= 2;
                }
            }
            else if (key > 10 && key < 20) {
                /*此条件为检验条子*/
                if (k % 3 != 0) {
                    k *= 3;
                }
            }
            else if (key > 20 && key < 30) {
                /*此条件为检验万子*/
                if (k % 5 != 0) {
                    k *= 5;
                }
            }
            else {
                /*此条件为检验风*/
                if (k % 7 != 0) {
                    k *= 5;
                }
            }
        }

        for (let key in dic_MingGang) {
            if (key > 0 && key < 10) {
                /*此条件为检验饼子*/
                if (k % 2 != 0) {
                    k *= 2;
                }
            }
            else if (key > 10 && key < 20) {
                /*此条件为检验条子*/
                if (k % 3 != 0) {
                    k *= 3;
                }
            }
            else if (key > 20 && key < 30) {
                /*此条件为检验万子*/
                if (k % 5 != 0) {
                    k *= 5;
                }
            }
            else {
                /*此条件为检验风*/
                if (k % 7 != 0) {
                    k *= 5;
                }
            }
        }

        for (let key in dic_AnGang) {
            if (key > 0 && key < 10) {
                /*此条件为检验饼子*/
                if (k % 2 != 0) {
                    k *= 2;
                }
            }
            else if (key > 10 && key < 20) {
                /*此条件为检验条子*/
                if (k % 3 != 0) {
                    k *= 3;
                }
            }
            else if (key > 20 && key < 30) {
                /*此条件为检验万子*/
                if (k % 5 != 0) {
                    k *= 5;
                }
            }
            else {
                /*此条件为检验风*/
                if (k % 7 != 0) {
                    k *= 5;
                }
            }
        }

        if (
            k == 2 ||//桶，清一色
            k == 3 ||//条，清一色
            k == 5 ||//万，清一色
            k == 7 ||//风，清一色
            (k % 6 == 0 && k % 5 != 0) ||//缺门，缺万
            (k % 10 == 0 && k % 3 != 0) ||//缺门，缺万
            (k % 15 == 0 && k % 2 != 0))//缺门，缺桶
        {
            //胡牌的基本条件通常是：
            //至少有一个对子（两张相同的牌）作为眼，
            //其余的牌可以组成顺子（序数连续的三张牌，如123）或
            //刻子（三张相同的牌）。
            if (list_Private.length == 14) {

            }
        }
        else return [false, -1, -1]
        //return [false,-1]
    }
}


//////////
/*
 * 手柄类，此游戏只支持单手柄操作。
 */

/////////////
/*
 * 复数类
 */
function Complex(R, I) {
    if (isNaN(R) || isNaN(I)) { throw new TypeError('Complex params require Number'); }
    this.r = R;
    this.i = I;
}
// 加法
Complex.prototype.add = function (that) {
    return new Complex(this.r + that.r, this.i + that.i);
};
// 负运算
Complex.prototype.neg = function () {
    return new Complex(-this.r, -this.i);
};
// 乘法
Complex.prototype.multiply = function (that) {
    if (this.r === that.r && this.i + that.i === 0) {
        return this.r * this.r + this.i * this.i
    }
    return new Complex(this.r * that.r - this.i * that.i, this.r * that.i + this.i * that.r);
};
// 除法
Complex.prototype.divide = function (that) {
    var a = this.r;
    var b = this.i;
    var c = that.r;
    var d = that.i;
    return new Complex((a * c + b * d) / (c * c + d * d), (b * c - a * d) / (c * c + d * d));
};
// 模长
Complex.prototype.mo = function () {
    return Math.sqrt(this.r * this.r + this.i * this.i);
};
//变为角度
Complex.prototype.toAngle = function () {

    if (this.r > 1e-6) {
        var angle = Math.atan(this.i / this.r);
        angle = (angle + Math.PI * 4) % (Math.PI * 2);
        return angle;
    }
    else if (this.r < -1e-6) {
        var angle = Math.atan(this.i / this.r);
        angle = (angle + Math.PI * 3) % (Math.PI * 2);
        return angle;
    }
    else if (this.i > 0) {
        return Math.PI / 2;
    }
    else if (this.i < 0) {
        return Math.PI * 3 / 2;
    }
    else {
        throw 'this Complex can not change to angle';
    }
    return Math.sqrt(this.r * this.r + this.i * this.i);
};
Complex.prototype.toOne = function () {
    var m = this.mo();
    this.r /= m, this.i /= m;
    //return Math.sqrt(this.r * this.r + this.i * this.i);
};
Complex.prototype.isZero = function () {
    return this.mo() < 1e-4;
}
Complex.prototype.toString = function () {
    return "{" + this.r + "," + this.i + "}";
};
// 判断两个复数相等
Complex.prototype.equal = function (that) {
    return that !== null && that.constructor === Complex && this.r === that.r && this.i === that.i;
};
Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);
// 从普通字符串解析为复数
Complex.parse = function (s) {
    try {
        var execres = Complex.parseRegExp.exec(s);
        return new Complex(parseFloat(execres[1]), parseFloat(execres[2]));
    } catch (e) {
        throw new TypeError("Can't parse '" + s + "'to a complex");
    }
};
Complex.parseRegExp = /^\{([\d\s]+[^,]*),([\d\s]+[^}]*)\}$/;
window.c = Complex;
// console.log(/^\{([\d\s]+[^,]*),([\d\s]+[^}]*)\}$/.exec('{2,3}'));
// 示例代码

////////////
