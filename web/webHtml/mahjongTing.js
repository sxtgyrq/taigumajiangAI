function MahjongStateClass(privateMas, peng, mingGang, anGang) {
    if (!Array.isArray(privateMas)) {
        throw new TypeError('Expected an array');
    }
    this._privateMas = privateMas;
    this._peng = peng;
    this._mingGang = mingGang;
    this._anGang = anGang;
    this._duiPart = [];
    this._shunziPart = [];
    this._keziPart = [];//三个一样的牌

    this._privateMas.sort((a, b) => a - b);

    var that = this;
    this.getWhatToTing = function () {
        const mahjongTings = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            11, 12, 13, 14, 15, 16, 17, 18, 19,
            21, 22, 23, 24, 25, 26, 27, 28, 29,
            40, 47, 54, 61, 68, 75, 82];
        for (let i = 0; i < mahjongTings.length; i++) {
            let mahjongTing = mahjongTings[i];
            for (let j = 0; j < that._privateMas.length; j++) {
                const deepCopiedArray = JSON.parse(JSON.stringify(that._privateMas));
                let mahjongOut = deepCopiedArray[j];
                deepCopiedArray[j] = mahjongTing;
                deepCopiedArray.sort((a, b) => a - b);
                if (that.IsHu(deepCopiedArray, that._peng, that._mingGang, that._anGang)) {
                    if (that.Result[mahjongOut] == undefined) {
                        that.Result[mahjongOut] = [mahjongTing];
                    }
                    else if (that.Result[mahjongOut].findIndex(item => item === mahjongTing) == -1) {
                        that.Result[mahjongOut].push(mahjongTing);
                    }

                }
            }
        }
    }
    this.Result = {};//分别存储 
    this.IsHu = function (privateMas, peng, mingGang, anGang) {
        let k = 1;
        for (let i = 0; i < privateMas.length; i++) {

            if (privateMas[i] > 0 && privateMas[i] < 10) {
                /*此条件为检验饼子*/
                if (k % 2 != 0) {
                    k *= 2;
                }
            }
            else if (privateMas[i] > 10 && privateMas[i] < 20) {
                /*此条件为检验条子*/
                if (k % 3 != 0) {
                    k *= 3;
                }
            }
            else if (privateMas[i] > 20 && privateMas[i] < 30) {
                /*此条件为检验万子*/
                if (k % 5 != 0) {
                    k *= 5;
                }
            }
            else {
                /*此条件为检验风*/
                if (k % 7 != 0) {
                    k *= 7;
                }
            }
        }
        for (let key in peng) {
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
                    k *= 7;
                }
            }
        }

        for (let key in mingGang) {
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
                    k *= 7;
                }
            }
        }

        for (let key in anGang) {
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
                    k *= 7;
                }
            }
        }

        if (
            k == 2 ||//桶，清一色
            k == 3 ||//条，清一色
            k == 5 ||//万，清一色
            k == 7 ||//风，清一色
            (k % 6 == 0 && k % 5 != 0) ||//缺门，缺万
            (k % 10 == 0 && k % 3 != 0) ||//缺门，缺条
            (k % 15 == 0 && k % 2 != 0))//缺门，缺桶
        {
            //胡牌的基本条件通常是：
            //至少有一个对子（两张相同的牌）作为眼，
            //其余的牌可以组成顺子（序数连续的三张牌，如123）或
            //刻子（三张相同的牌）。
            if (privateMas.length == 14) {
                if (privateMas[0] == privateMas[1] &&
                    privateMas[2] == privateMas[3] &&
                    privateMas[4] == privateMas[5] &&
                    privateMas[6] == privateMas[7] &&
                    privateMas[8] == privateMas[9] &&
                    privateMas[10] == privateMas[11] &&
                    privateMas[12] == privateMas[13]
                ) {
                    return true;
                }
            }
            let baseMaterial = [privateMas]
            let cutDuizi = function (material) {
                if (material.length >= 2) {
                    if (material[0] == material[1]) {
                        material.shift();
                        material.shift();
                        return [true, material];
                    }
                }
                return [false, null];
            };
            let cutKezi = function (material) {
                if (material.length >= 3 && (material.length % 3 == 2 || material.length % 3 == 0)) {
                    if (material[0] == material[1] && material[1] == material[2]) {
                        material.shift();
                        material.shift();
                        material.shift();
                        return [true, material];
                    }
                }
                return [false, null];
            };
            let cutShunzi = function (material) {
                if (material.length >= 3 && (material.length % 3 == 2 || material.length % 3 == 0)) {

                    var firstValue = material.shift();
                    var secondValue = firstValue + 1;
                    var thirdValue = secondValue + 1;
                    const secondIndex = material.findIndex(item => item === secondValue);
                    if (secondIndex === -1) {
                        return [false, null]
                    }
                    else {
                        material.splice(secondIndex, 1);
                        const thirdIndex = material.findIndex(item => item === thirdValue);
                        if (thirdIndex === -1) {
                            return [false, null]
                        }
                        else {
                            material.splice(thirdIndex, 1);
                            return [true, material];
                        }
                    }
                }
                return [false, null];
            };
            while (baseMaterial.length > 0) {
                let materialNeedToOp = baseMaterial.shift();
                if (materialNeedToOp.length % 3 == 2) {
                    {
                        let materialNeedToCutDuizi = JSON.parse(JSON.stringify(materialNeedToOp));
                        let cutDuiziResult = cutDuizi(materialNeedToCutDuizi);
                        if (cutDuiziResult[0]) {
                            if (cutDuiziResult[1].length == 0) {
                                return true;
                            }
                            else if (cutDuiziResult[1].length % 3 == 0) {
                                baseMaterial.push(cutDuiziResult[1]);
                            }
                            else throw '减少对子，逻辑错误！';
                        }
                    }
                    {
                        let materialNeedToCutKezi = JSON.parse(JSON.stringify(materialNeedToOp));
                        let cutKeziResult = cutKezi(materialNeedToCutKezi);
                        if (cutKeziResult[0] && cutKeziResult[1].length == 0) {
                            return true;
                        }
                        else if (cutKeziResult[0] && (cutKeziResult[1].length % 3 == 2)) {
                            baseMaterial.push(cutKeziResult[1]);
                        }
                    }
                    {
                        let materialNeedToCutShunzi = JSON.parse(JSON.stringify(materialNeedToOp));
                        let cutShunziResult = cutShunzi(materialNeedToCutShunzi)
                        if (cutShunziResult[0] && cutShunziResult[1].length == 0) {
                            return true;
                        }
                        else if (cutShunziResult[0] && (cutShunziResult[1].length % 3 == 2)) {
                            baseMaterial.push(cutShunziResult[1]);
                        }
                    }
                }
                else if (materialNeedToOp.length % 3 == 0) {
                    {
                        let materialNeedToCutKezi = JSON.parse(JSON.stringify(materialNeedToOp));
                        let cutKeziResult = cutKezi(materialNeedToCutKezi);
                        if (cutKeziResult[0] && cutKeziResult[1].length == 0) {
                            return true;
                        }
                        else if (cutKeziResult[0] && (cutKeziResult[1].length % 3 == 0)) {
                            baseMaterial.push(cutKeziResult[1]);
                        }
                    }
                    {
                        let materialNeedToCutShunzi = JSON.parse(JSON.stringify(materialNeedToOp));
                        let cutShunziResult = cutShunzi(materialNeedToCutShunzi)
                        if (cutShunziResult[0] && cutShunziResult[1].length == 0) {
                            return true;
                        }
                        else if (cutShunziResult[0] && (cutShunziResult[1].length % 3 == 0 || cutShunziResult[1].length % 3 == 2)) {
                            baseMaterial.push(cutShunziResult[1]);
                        }
                    }
                }
            }

            return false;
        }
        else return false;
        //else return [false, -1, -1]

    }

}
//MahjongStateClass.prototype.__defineGetter__("privateMas", function () {
//    ShowGetInfo("Age");
//    return this._privateMas;
//});

//MahjongStateClass.prototype.__defineSetter__("privateMas", function (val) {
//    if (this._state == 'getTax' && val != 'getTax') {
//        Tax.trunOffAnimate();
//    }
//    else if (this._state != 'getTax' && val == 'getTax') {
//        Tax.trunOnAnimate();
//    }
//    this._state = val;
//    if (this._oldState != this._state) {
//        operatePanel.refresh();
//        this._oldState = val;
//    }
//    ShowSetInfo("Age");
//});

//MahjongStateClass.prototype.__defineGetter__("carSelect", function () {
//    ShowGetInfo("Age");
//    return this._carSelect;
//});

//MahjongStateClass.prototype.__defineSetter__("carSelect", function (val) {
//    this._carSelect = val;
//    ShowSetInfo("Age");
//});