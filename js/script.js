var ie;
var KeyTable = getKeyTable();
var KeyIdTable = getKeyIdTable();
var KeyFnKtm = getKeyFnKtm('core4700', 'us');
var KeyboareList = {
    core4700: {
        name: 'CORE',
        code: 'core4700',
        profileCount: 4,
        layerList: ['fn', 'pn', 'fn1'],
        language: [
            {
                name: 'ANSI',
                code: 'us'
            }
        ]
    },
    /*
    poker3: {
        name: 'POK3R',
        code: 'poker3',
        profileCount: 4,
        layerList: ['fn', 'pn'],
        language: [
            {
                name: 'ANSI',
                code: 'us'
            }, {
                name: 'ISO-UK',
                code: 'uk'
            }, {
                name: 'ISO-NOR',
                code: 'nor'
            }, {
                name: 'ISO-FR',
                code: 'fr'
            }, {
                name: 'ISO-DE',
                code: 'de'
            }, {
                name: 'ISO-SP',
                code: 'sp'
            }
        ]
    },
    */
    vtg7900: {
        name: 'ViBE',
        code: 'vtg7900',
        profileCount: 4,
        layerList: ['fn', 'pn'],
        language: [
            {
                name: 'ANSI',
                code: 'us'
            }, {
                name: 'ISO-UK',
                code: 'uk'
            }, {
                name: 'ISO-NOR',
                code: 'nor'
            }, {
                name: 'ISO-FR',
                code: 'fr'
            }, {
                name: 'ISO-DE',
                code: 'de'
            },
        ]
    },
    vtg7500_1: {
        name: 'New 75(Race 3)',
        code: 'vtg7500_1',
        profileCount: 4,
        layerList: ['fn', 'pn'],
        language: [
            {
                name: 'ANSI',
                code: 'us'
            }, {
                name: 'ISO-UK',
                code: 'uk'
            }, {
                name: 'ISO-NOR',
                code: 'fi'
            }, {
                name: 'ISO-FR',
                code: 'fr'
            }, {
                name: 'ISO-DE',
                code: 'de'
            }
        ]
    },
    /*
    vtg7500_2: {
        name: 'VTG7500_2',
        code: 'vtg7500_2',
        profileCount: 4,
        layerList: ['fn', 'pn'],
        language: [
            {
                name: 'ANSI',
                code: 'us'
            }, {
                name: 'ISO-UK',
                code: 'uk'
            }, {
                name: 'ISO-FI',
                code: 'fi'
            }, {
                name: 'ISO-FR',
                code: 'fr'
            }, {
                name: 'ISO-DE',
                code: 'de'
            }
        ]
    },
    */
    vtg6500: {
        name: 'CYPHER',
        code: 'vtg6500',
        profileCount: 4,
        layerList: ['fn', 'pn'],
        language: [
            {
                name: 'ANSI',
                code: 'us'
            }, {
                name: 'ISO-UK',
                code: 'uk'
            }, {
                name: 'ISO-NOR',
                code: 'nor'
            }, {
                name: 'ISO-DE',
                code: 'de'
            }
        ]
    }
};
var App = (function () {
    function App() {
        var _this = this;
        this.vueChangeByMe = false;
        this.vuePageData = {
            keyboareList: KeyboareList,
            tab: 'macro',
            setting: {
                keyboard: 'core4700',
                language: 'us',
                profileCount: 4,
                layerList: ['fn', 'pn', 'fn1'],
                profile: '1',
                layer: 'INIT'
            },
            active: {
                tab: '',
                index: 0,
                data: {}
            },
            data: {
                macro: [],
                keyChange: [],
                functionSet: []
            }
        };
        ie = getIEVersion();
        if (ie == 8) {
            $('body').addClass('ie8');
        }
        if ($.cookie('setting')) {
            $.extend(this.vuePageData.setting, JSON.parse($.cookie('setting')));
            KeyFnKtm = getKeyFnKtm(this.vuePageData.setting.keyboard, this.vuePageData.setting.language);
        }
        if ($.cookie('vueData')) {
            $.extend(this.vuePageData.data, JSON.parse($.cookie('vueData')));
        }
        this.vuePage = new Vue({
            el: '#Vortexgear',
            data: this.vuePageData,
            watch: {
                'setting.keyboard': function (val, oldVal) {
                    if (!_this.vueChangeByMe) {
                        if (_this.vuePageData.data.functionSet.length + _this.vuePageData.data.keyChange.length + _this.vuePageData.data.macro.length > 0) {
                            if (!confirm('Warning: Change Keyboard will reset all settings.')) {
                                _this.vueChangeByMe = true;
                                _this.vuePageData.setting.keyboard = oldVal;
                                return;
                            }
                        }
                        _this.changeKeyboare();
                        var newLanguage = KeyboareList[_this.vuePageData.setting.keyboard].language[0].code;
                        if (_this.vuePageData.setting.language != newLanguage) {
                            _this.vueChangeByMe = true;
                            _this.vuePageData.setting.language = newLanguage;
                        }
                    }
                    else {
                        _this.vueChangeByMe = false;
                    }
                },
                'setting.language': function (val, oldVal) {
                    if (!_this.vueChangeByMe) {
                        if (_this.vuePageData.data.functionSet.length + _this.vuePageData.data.keyChange.length + _this.vuePageData.data.macro.length > 0) {
                            if (!confirm('Warning: Swap Language will reset all settings.')) {
                                _this.vueChangeByMe = true;
                                _this.vuePageData.setting.language = oldVal;
                                return;
                            }
                        }
                        _this.changeKeyboare();
                    }
                    else {
                        _this.vueChangeByMe = false;
                    }
                },
                'setting.layer': function (val, oldVal) {
                    if (val != 'INIT' && _this.vuePageData.tab == 'function_set') {
                        _this.vuePageData.tab = 'macro';
                    }
                },
                setting: {
                    handler: function (val, oldVal) {
                        setTimeout(function () {
                            $('.select2,.select2WitchSearch').change();
                        }, 1);
                        $.cookie('setting', JSON.stringify(val));
                    },
                    deep: true
                },
                data: {
                    handler: function (val, oldVal) {
                        $.cookie('vueData', JSON.stringify(val));
                    },
                    deep: true
                }
            },
            methods: {
                findIdxFromObjArrayByKey: function (array, filter) {
                    return findIdxFromObjArrayByKey(array, filter);
                },
                keycodeToStr: function (keycode) {
                    return _this.keycodeToStr(keycode);
                },
                getMacroText: function (macro) {
                    return _this.getMacroText(macro);
                },
                getKeyChangeText: function (keyChange) {
                    return _this.getKeyChangeText(keyChange);
                },
                getFunctionSetText: function (functionSet) {
                    return _this.getFunctionSetText(functionSet);
                }
            }
        });
        $('.select2').select2({
            minimumResultsForSearch: Infinity
        }).on('select2:select', function (e) {
            var event = new Event('change');
            e.target.dispatchEvent(event);
        });
        $('.select2WitchSearch').select2().on('select2:select', function (e) {
            var event = new Event('change');
            e.target.dispatchEvent(event);
        });
        ;
        $('.scrollBox').mCustomScrollbar({
            theme: "minimal-dark"
        });
        this.keyboardInit();
    }
    App.prototype.changeKeyboare = function () {
        this.vuePageData.data = {
            macro: [],
            keyChange: [],
            functionSet: []
        };
        $.extend(this.vuePageData.setting, {
            profileCount: KeyboareList[this.vuePageData.setting.keyboard].profileCount,
            layerList: KeyboareList[this.vuePageData.setting.keyboard].layerList,
            profile: '1',
            layer: 'INIT'
        });
        KeyFnKtm = getKeyFnKtm(this.vuePageData.setting.keyboard, this.vuePageData.setting.language);
        setTimeout(function () {
            $('.select2,.select2WitchSearch').select2();
        }, 1);
    };
    App.prototype.keyboardInit = function () {
        var _this = this;
        //function set
        $('#Vortexgear').on('click', '.keyboardFnktm .key', function (e) {
            var key = $(e.target).data('key');
            var idx = findIdxFromObjArrayByKey(_this.vuePageData.data.functionSet, {
                key: key
            });
            _this.functionSet(idx, key);
        });
        $('#Vortexgear').on('click', '.tabBoxFunctionSet .lightbox .physicalKeyboard .key', function (e) {
            var fnktmCode = parseInt($(e.target).data('fnktm'));
            if (fnktmCode == -1) {
                return;
            }
            var idx = _this.vuePageData.active.data.ktm.indexOf(fnktmCode);
            if (idx >= 0) {
                _this.vuePageData.active.data.ktm.splice(idx, 1);
            }
            else if (_this.vuePageData.active.data.ktm.length >= 4) {
                return;
            }
            else {
                var filter = _this.vuePageData.data.functionSet.filter(function (functionSet) {
                    return functionSet.ktm.indexOf(fnktmCode) >= 0;
                });
                if (filter && filter.length > 0) {
                    alert("This key has been set on " + filter[0].key + ".");
                }
                else {
                    _this.vuePageData.active.data.ktm.push(fnktmCode);
                }
            }
        });
        //Key Change
        $('#Vortexgear').on('click', '.tabBoxKeyChange .physicalKeyboard .key', function (e) {
            var sourceKey = $(e.target).data('key');
            if (sourceKey == '0') {
                return;
            }
            var idx = findIdxFromObjArrayByKey(_this.vuePageData.data.keyChange, {
                profileIndex: _this.vuePageData.setting.profile,
                sourceKey: sourceKey,
                sourceLayer: _this.vuePageData.setting.layer
            });
            _this.keyChange(idx, sourceKey);
        });
        $('#Vortexgear').on('click', '.tabBoxKeyChange .keyboardLayer .key', function (e) {
            _this.vuePageData.active.data.targetLayer = $(e.target).data('key');
        });
        $('#Vortexgear').on('click', '.tabBoxKeyChange .keyboardDefatlt .key', function (e) {
            _this.vuePageData.active.data.targetKey = $(e.target).data('key');
        });
        //macro
        $('#Vortexgear').on('click', '.tabBoxMacro .physicalKeyboard .key', function (e) {
            var sourceKey = $(e.target).data('key');
            if (sourceKey == '0') {
                return;
            }
            var idx = findIdxFromObjArrayByKey(_this.vuePageData.data.macro, {
                profileIndex: _this.vuePageData.setting.profile,
                sourceKey: sourceKey,
                sourceLayer: _this.vuePageData.setting.layer
            });
            _this.macro(idx, sourceKey);
        });
        $('#Vortexgear').on('click', '.tabBoxMacro .keyboardLayer .key', function (e) {
            _this.vuePageData.active.data.setting.layer = $(e.target).data('key');
        });
        $('#Vortexgear').on('click', '.tabBoxMacro .keyboardDefatlt .key', function (e) {
            _this.vuePageData.active.data.macro.push({
                key: $(e.target).data('key'),
                layer: _this.vuePageData.active.data.setting.layer,
                event: '1',
                timer: _this.vuePageData.active.data.setting.timer
            });
            setTimeout(function () {
                $(".lightboxMacro .macroListBox .scrollBox").mCustomScrollbar('scrollTo', 'last');
            }, 1);
        });
        $('#Vortexgear').on('keyup', 'input', function (e) {
            e.stopPropagation();
        });
        $('body').on('keyup', function (e) {
            var keyId = KeyIdTable['K_' + e.keyCode];
            if (keyId && keyId != '0') {
                if (_this.vuePageData.active.tab == 'function_set') {
                    $('.tabBoxFunctionSet .lightbox .physicalKeyboard .key.key_' + keyId).click();
                }
                else if (_this.vuePageData.active.tab == 'key_change') {
                    $('.tabBoxKeyChange .keyboardDefatlt .key.key_' + keyId).click();
                }
                else if (_this.vuePageData.active.tab == 'macro') {
                    $('.tabBoxMacro .keyboardDefatlt .key.key_' + keyId).click();
                }
                else if (_this.vuePageData.tab == 'key_change') {
                    $('.tabBoxKeyChange .physicalKeyboard .key.key_' + keyId).click();
                }
                else if (_this.vuePageData.tab == 'macro') {
                    $('.tabBoxMacro .physicalKeyboard .keyd.key_' + keyId).click();
                }
            }
        });
    };
    App.prototype.checkConflict = function (sourceKey) {
        console.log(findIdxFromObjArrayByKey(this.vuePageData.data.macro, {
            profileIndex: this.vuePageData.setting.profile,
            sourceKey: sourceKey,
            sourceLayer: this.vuePageData.setting.layer
        }));
        if (findIdxFromObjArrayByKey(this.vuePageData.data.macro, {
            profileIndex: this.vuePageData.setting.profile,
            sourceKey: sourceKey,
            sourceLayer: this.vuePageData.setting.layer
        }) >= 0) {
            return 'macro';
        }
        if (findIdxFromObjArrayByKey(this.vuePageData.data.keyChange, {
            profileIndex: this.vuePageData.setting.profile,
            sourceKey: sourceKey,
            sourceLayer: this.vuePageData.setting.layer
        }) >= 0) {
            return 'Key Change';
        }
        return '';
    };
    App.prototype.clearActive = function () {
        this.vuePageData.active = {
            tab: '',
            index: 0,
            data: {}
        };
    };
    App.prototype.macro = function (idx, sourceKey) {
        if (sourceKey === void 0) { sourceKey = ''; }
        if (idx >= 0) {
            this.vuePageData.active.tab = this.vuePageData.tab;
            this.vuePageData.active.index = idx;
            var newDate_1 = {};
            $.extend(newDate_1, this.vuePageData.data.macro[idx]);
            newDate_1.setting = {};
            $.extend(newDate_1.setting, this.vuePageData.data.macro[idx].setting);
            newDate_1.macro = [];
            $.each(this.vuePageData.data.macro[idx].macro, function (idx, item) {
                var newItem = {};
                $.extend(newItem, item);
                newDate_1.macro.push(newItem);
            });
            this.vuePageData.active.data = newDate_1;
        }
        else {
            if (this.vuePageData.data.macro.length >= 60) {
                alert('Error: macro can be set up to 60 key-codes.');
            }
            else if (this.checkConflict(sourceKey) != '') {
                alert('This key had been set in ' + this.checkConflict(sourceKey) + ' mode.');
            }
            else {
                this.vuePageData.active.tab = this.vuePageData.tab;
                this.vuePageData.active.index = idx;
                this.vuePageData.active.data = {
                    profileIndex: this.vuePageData.setting.profile,
                    sourceKey: sourceKey,
                    sourceLayer: this.vuePageData.setting.layer,
                    macroType: '1',
                    macroRepeat: '2',
                    setting: {
                        timer: '10',
                        layer: 'INIT'
                    },
                    macro: []
                };
            }
        }
    };
    App.prototype.macroComplete = function () {
        var downKey = [];
        $.each(this.vuePageData.active.data.macro, function (idx, row) {
            if (row.event == '1') {
                if (downKey.indexOf(row.key) < 0) {
                    downKey.push(row.key);
                }
            }
            else {
                if (downKey.indexOf(row.key) >= 0) {
                    downKey.splice(downKey.indexOf(row.key), 1);
                }
            }
        });
        if (downKey.length == 1) {
            alert('Error:  There is a key that has not been released.');
            return;
        }
        else if (downKey.length > 0) {
            alert('Error: There are ' + downKey.length + ' key those have not been released.');
            return;
        }
        if (this.vuePageData.active.index >= 0) {
            $.extend(this.vuePageData.data.macro[this.vuePageData.active.index], this.vuePageData.active.data);
        }
        else {
            var newData = {};
            $.extend(newData, this.vuePageData.active.data);
            this.vuePageData.data.macro.push(newData);
        }
        this.clearActive();
    };
    App.prototype.macroCancel = function () {
        this.clearActive();
    };
    App.prototype.macroDelete = function () {
        if (this.vuePageData.active.index >= 0) {
            this.vuePageData.data.macro.splice(this.vuePageData.active.index, 1);
        }
        this.clearActive();
    };
    App.prototype.macroDeleteMacro = function (idx) {
        if (idx >= 0) {
            this.vuePageData.active.data.macro.splice(idx, 1);
        }
    };
    App.prototype.macroPreview = function () {
        var timer = 50;
        $('.lightboxMacro .lightboxContent .lightboxCover').show();
        $.each(this.vuePageData.active.data.macro, function (idx, row) {
            setTimeout(function () {
                if (row.event == '1') {
                    $('.tabBoxMacro .keyboardDefatlt .key.key_' + row.key).addClass('preview');
                }
                else {
                    $('.tabBoxMacro .keyboardDefatlt .key.key_' + row.key).removeClass('preview');
                }
            }, timer);
            timer += parseInt(row.timer);
        });
        timer += 50;
        setTimeout(function () {
            if ($('.tabBoxMacro .keyboardDefatlt .key.preview').length == 1) {
                alert('Error:  There is a key that has not been released.');
                return;
            }
            else if ($('.tabBoxMacro .keyboardDefatlt .key.preview').length > 0) {
                alert('Error: There are ' + $('.tabBoxMacro .keyboardDefatlt .key.preview').length + ' key those have not been released.');
                $('.tabBoxMacro .keyboardDefatlt .key').removeClass('preview');
            }
            $('.lightboxMacro .lightboxContent .lightboxCover').hide();
        }, timer);
    };
    App.prototype.macroClear = function () {
        var _this = this;
        this.vuePageData.data.macro = $.map(this.vuePageData.data.macro, function (ele, idx) {
            if (ele.profileIndex != _this.vuePageData.setting.profile || ele.sourceLayer != _this.vuePageData.setting.layer)
                return ele;
        });
    };
    App.prototype.keyChange = function (idx, sourceKey) {
        if (sourceKey === void 0) { sourceKey = ''; }
        if (idx >= 0) {
            this.vuePageData.active.tab = this.vuePageData.tab;
            this.vuePageData.active.index = idx;
            var newDate = {};
            $.extend(newDate, this.vuePageData.data.keyChange[idx]);
            this.vuePageData.active.data = newDate;
        }
        else {
            if (this.checkConflict(sourceKey) != '') {
                alert('This key had been set in ' + this.checkConflict(sourceKey) + ' mode.');
            }
            else {
                this.vuePageData.active.tab = this.vuePageData.tab;
                this.vuePageData.active.index = idx;
                this.vuePageData.active.data = {
                    profileIndex: this.vuePageData.setting.profile,
                    sourceKey: sourceKey,
                    sourceLayer: this.vuePageData.setting.layer,
                    targetKey: '0',
                    targetLayer: 'INIT'
                };
            }
        }
    };
    App.prototype.keyChangeComplete = function () {
        if (this.vuePageData.active.index >= 0) {
            $.extend(this.vuePageData.data.keyChange[this.vuePageData.active.index], this.vuePageData.active.data);
        }
        else {
            var newData = {};
            $.extend(newData, this.vuePageData.active.data);
            this.vuePageData.data.keyChange.push(newData);
        }
        this.clearActive();
    };
    App.prototype.keyChangeCancel = function () {
        this.clearActive();
    };
    App.prototype.keyChangeDelete = function () {
        if (this.vuePageData.active.index >= 0) {
            this.vuePageData.data.keyChange.splice(this.vuePageData.active.index, 1);
        }
        this.clearActive();
    };
    App.prototype.keyChangeClear = function () {
        var _this = this;
        this.vuePageData.data.keyChange = $.map(this.vuePageData.data.keyChange, function (ele, idx) {
            if (ele.profileIndex != _this.vuePageData.setting.profile || ele.sourceLayer != _this.vuePageData.setting.layer)
                return ele;
        });
    };
    App.prototype.functionSet = function (idx, key) {
        if (key === void 0) { key = ''; }
        this.vuePageData.active.tab = this.vuePageData.tab;
        this.vuePageData.active.index = idx;
        if (idx >= 0) {
            var newDate = {};
            newDate = JSON.parse(JSON.stringify(this.vuePageData.data.functionSet[idx]));
            this.vuePageData.active.data = newDate;
        }
        else {
            this.vuePageData.active.data = {
                profileIndex: this.vuePageData.setting.profile,
                key: key,
                ktm: []
            };
        }
    };
    App.prototype.functionSetComplete = function () {
        if (this.vuePageData.active.index >= 0) {
            $.extend(this.vuePageData.data.functionSet[this.vuePageData.active.index], this.vuePageData.active.data);
        }
        else {
            var newData = {};
            $.extend(newData, this.vuePageData.active.data);
            this.vuePageData.data.functionSet.push(newData);
        }
        this.clearActive();
    };
    App.prototype.functionSetCancel = function () {
        this.clearActive();
    };
    App.prototype.functionSetDelete = function () {
        if (this.vuePageData.active.index >= 0) {
            this.vuePageData.data.functionSet.splice(this.vuePageData.active.index, 1);
        }
        this.clearActive();
    };
    App.prototype.functionSetClear = function () {
        var _this = this;
        this.vuePageData.data.functionSet = $.map(this.vuePageData.data.functionSet, function (ele, idx) {
            if (ele.profileIndex != _this.vuePageData.setting.profile)
                return ele;
        });
    };
    App.prototype.tab = function (tab) {
        this.vuePageData.tab = tab;
    };
    App.prototype.download = function () {
        var blob = new Blob([this.convertToBytes()], { type: "octet/stream" });
        saveAs(blob, 'Vortex.cys');
    };
    App.prototype.downloadTxt = function () {
        var blob = new Blob([this.convertToText()], { type: "text/plain;charset=utf-8" });
        saveAs(blob, 'Vortex.txt');
    };
    App.prototype.convertToBytes = function () {
        // Mod: respect profileCount & set itemSize accordingly
        var profileCount = this.vuePageData.setting.profileCount;
        var itemSize = this.vuePageData.data.macro.length * 2 + this.vuePageData.data.keyChange.length + this.vuePageData.data.functionSet.length * profileCount;

        var cysHeader = {
            title: stringToBytes('CYFI'),
            rev: numberTo2Bytes(0),
            itemSize: numberTo2Bytes(itemSize)
        };
        var cysItem = [];
        var cysProfile = [];
        var cysMacro = [];
        var macroIndex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var profilePos = 8 + itemSize * 8;

        var _loop_1 = function (filterIndex) {
            //function set
            // Mod: Apply func.change globally
            var filterFunctionSet = this_1.vuePageData.data.functionSet;
            $.each(filterFunctionSet, function (idx, row) {
                var profile = {
                    pos: profilePos,
                    len: [2],
                    key: { FN: 0x94, FN1: 0x95, PN: 0x96, FN3: 0x97 }[row.key],
                    index: numberTo2Bytes(row.ktm.length),
                    data: row.ktm
                };
                var profileLength = 8;
                if (profilePos % 0x1000 + profileLength > 0x1000) {
                    profilePos = Math.ceil(profilePos / 0x1000) * 0x1000;
                    profile.pos = profilePos;
                }
                cysProfile.push(profile);
                cysItem.push({
                    type: [0],
                    profileIndex: [parseInt(filterIndex)], // Mod: apply func.change to every profile
                    macroIndex: numberTo2Bytes(0),
                    itemDataShift: numberTo4Bytes(profilePos)
                });
                profilePos += profileLength;
            });
            //key change
            var filterKeyChange = this_1.vuePageData.data.keyChange.filter(function (row) {
                return parseInt(row.profileIndex) === filterIndex;
            });
            $.each(filterKeyChange, function (idx, row) {
                var profileIndex = [];
                profileIndex.push(parseInt(row.sourceKey, 16));
                if (row.sourceLayer == 'FN') {
                    profileIndex.push(1);
                }
                else if (row.sourceLayer == 'FN1') {
                    profileIndex.push(2);
                }
                else if (row.sourceLayer == 'PN') {
                    profileIndex.push(3);
                }
                else {
                    profileIndex.push(0);
                }
                var profileData = [];
                profileData.push(parseInt(row.targetKey, 16));
                if (row.targetLayer == 'FN') {
                    profileData.push(1);
                }
                else if (row.targetLayer == 'FN1') {
                    profileData.push(2);
                }
                else if (row.targetLayer == 'PN') {
                    profileData.push(3);
                }
                else {
                    profileData.push(0);
                }
                var profile = {
                    pos: profilePos,
                    len: [2],
                    key: [0x20],
                    index: profileIndex,
                    data: profileData.concat(numberTo2Bytes(0))
                };
                var profileLength = 8;
                if (profilePos % 0x1000 + profileLength > 0x1000) {
                    profilePos = Math.ceil(profilePos / 0x1000) * 0x1000;
                    profile.pos = profilePos;
                }
                cysProfile.push(profile);
                cysItem.push({
                    type: [0],
                    profileIndex: [parseInt(row.profileIndex)],
                    macroIndex: numberTo2Bytes(0),
                    itemDataShift: numberTo4Bytes(profilePos)
                });
                profilePos += profileLength;
            });
            //macro
            var filterMacro = this_1.vuePageData.data.macro.filter(function (row) {
                return parseInt(row.profileIndex) === filterIndex;
            });
            var macroPos = profilePos + filterMacro.length * 8 + 4;
            $.each(filterMacro, function (idx, row) {
                var profileData = parseInt(row.macroType).toString(2) + '111';
                if (row.sourceLayer == 'FN') {
                    profileData += '01';
                }
                else if (row.sourceLayer == 'FN1') {
                    profileData += '10';
                }
                else if (row.sourceLayer == 'PN') {
                    profileData += '11';
                }
                else {
                    profileData += '00';
                }
                var profile = {
                    pos: profilePos,
                    len: [2],
                    key: [0x18],
                    index: numberTo2Bytes(macroIndex[row.profileIndex]),
                    data: [parseInt(row.sourceKey, 16), parseInt(profileData, 2)].concat(numberTo2Bytes(parseInt(row.macroRepeat)))
                };
                var profileLength = 8;
                if (profilePos % 0x1000 + profileLength > 0x1000) {
                    profilePos = Math.ceil(profilePos / 0x1000) * 0x1000;
                    profile.pos = profilePos;
                }
                cysProfile.push(profile);
                cysItem.push({
                    type: [0],
                    profileIndex: [parseInt(row.profileIndex)],
                    macroIndex: numberTo2Bytes(0),
                    itemDataShift: numberTo4Bytes(profilePos)
                });
                profilePos += profileLength;
                var macro = {
                    pos: macroPos,
                    macro: []
                };
                $.each(row.macro, function (idx, item) {
                    var macroData = '';
                    if (item.event == '1') {
                        macroData += '001';
                    }
                    else {
                        macroData += '010';
                    }
                    macroData += '111';
                    if (item.layer == 'FN') {
                        macroData += '01';
                    }
                    else if (item.layer == 'FN1') {
                        macroData += '10';
                    }
                    else if (item.layer == 'PN') {
                        macroData += '11';
                    }
                    else {
                        macroData += '00';
                    }
                    var timer = parseInt(item.timer);
                    var macroTimer = [];
                    if (timer < 16383) {
                        macroTimer = numberTo2Bytes(timer / 0.5 - 1);
                    }
                    else {
                        macroTimer = numberTo2Bytes(Math.floor(timer / 512) - 1 + 32768);
                    }
                    macro.macro = macro.macro.concat([parseInt(item.key, 16), parseInt(macroData, 2)]).concat(macroTimer);
                });
                macro.macro = macro.macro.concat([0, 0xFC, 0, 0]);
                var macroLength = macro.macro.length;
                if (macroPos % 0x1000 + macroLength > 0x1000) {
                    macroPos = Math.ceil(macroPos / 0x1000) * 0x1000;
                    macro.pos = macroPos;
                }
                cysMacro.push(macro);
                cysItem.push({
                    type: [1],
                    profileIndex: [parseInt(row.profileIndex)],
                    macroIndex: numberTo2Bytes(macroIndex[row.profileIndex]),
                    itemDataShift: numberTo4Bytes(macroPos)
                });
                macroPos += macroLength;
                macroIndex[row.profileIndex]++;
            });
            profilePos = macroPos + 8;
        };
        var this_1 = this;
        // Mod: only check range [0, profileCount)
        for (var filterIndex = 0; filterIndex < profileCount; filterIndex++) {
            _loop_1(filterIndex);
        }
        var bytes = [];
        bytes = bytes.concat(cysHeader.title, cysHeader.rev, cysHeader.itemSize);
        $.each(cysItem, function (idx, item) {
            bytes = bytes.concat(item.type, item.profileIndex, item.macroIndex, item.itemDataShift);
        });
        while (bytes.length < profilePos) {
            bytes.push(0);
        }
        $.each(cysProfile, function (idx, profile) {
            var newData = [];
            newData = newData.concat(profile.len, profile.key, profile.index, profile.data);
            for (var pos = 0; pos < newData.length; pos++) {
                bytes[profile.pos + pos] = newData[pos];
            }
        });
        $.each(cysMacro, function (idx, macro) {
            var newData = [];
            newData = newData.concat(macro.macro);
            for (var pos = 0; pos < newData.length; pos++) {
                bytes[macro.pos + pos] = newData[pos];
            }
        });
        while (bytes.length < 8192) {
            bytes.push(255);
        }
        return new Uint8Array(bytes);
    };
    App.prototype.convertToText = function () {
        var _this = this;
        var text = '';
        var profileIndex;
        text += 'Macro\r\n';
        profileIndex = null;
        this.vuePageData.data.macro.slice().sort(function (a, b) {
            var sourceLayerList = ['INIT', 'FN', 'FN1', 'PN'];
            return sourceLayerList.indexOf(a.sourceLayer) - sourceLayerList.indexOf(b.sourceLayer);
        }).sort(function (a, b) {
            return a.profileIndex > b.profileIndex ? 1 : -1;
        }).forEach(function (row) {
            if (profileIndex != row.profileIndex) {
                text += " Layer " + row.profileIndex + "\r\n";
                profileIndex = row.profileIndex;
            }
            text += '  ';
            if (row.sourceLayer != 'INIT') {
                text += row.sourceLayer + " + ";
            }
            text += _this.keycodeToStr(row.sourceKey);
            text += " [";
            text += ['Default', 'Times:', 'Toggle', 'Loop'][parseInt(row.macroType) - 1];
            if (row.macroType == '2') {
                text += " " + row.macroRepeat;
            }
            text += "] ";
            text += _this.getMacroText(row.macro);
            text += '\r\n';
        });
        text += '--- \r\n';
        text += 'Key Change\r\n';
        profileIndex = null;
        this.vuePageData.data.keyChange.slice().sort(function (a, b) {
            return a.profileIndex > b.profileIndex ? 1 : -1;
        }).forEach(function (row) {
            if (profileIndex != row.profileIndex) {
                text += " Layer " + row.profileIndex + "\r\n";
                profileIndex = row.profileIndex;
            }
            text += '  ';
            text += _this.getKeyChangeText(row);
            text += '\r\n';
        });
        text += '--- \r\n';
        text += 'Fn/pn change\r\n';
        this.vuePageData.data.functionSet.forEach(function (row) {
            text += ' ';
            text += _this.getFunctionSetText(row);
            text += '\r\n';
        });
        return text;
    };
    App.prototype.showData = function () {
        console.log(JSON.parse(JSON.stringify(this.vuePageData)));
    };
    App.prototype.keycodeToStr = function (keycode) {
        return KeyTable['k_' + keycode];
    };
    App.prototype.getMacroText = function (macro) {
        var reArr = [];
        $.each(macro, function (idx, row) {
            var re = '';
            if (row.layer != 'INIT') {
                re += row.layer + '+';
            }
            re += KeyTable['k_' + row.key];
            re += '(' + ['↑', '↓'][row.event] + ')';
            re += ', delay ' + row.timer + ' ms';
            reArr.push(re);
        });
        return reArr.join(', ');
    };
    App.prototype.getKeyChangeText = function (keyChange) {
        var re = '';
        if (keyChange.sourceLayer != 'INIT') {
            re += keyChange.sourceLayer + '+';
        }
        re += KeyTable['k_' + keyChange.sourceKey];
        re += ' → ';
        if (keyChange.targetLayer != 'INIT') {
            re += keyChange.targetLayer + '+';
        }
        re += KeyTable['k_' + keyChange.targetKey];
        return re;
    };
    App.prototype.getFunctionSetText = function (functionSet) {
        var keyNames = functionSet.ktm.map(function (ktm) {
            return KeyFnKtm[ktm];
        });
        return functionSet.key + ' ← ' + keyNames.join(', ');
    };
    return App;
}());
function findIdxFromObjArrayByKey(array, filter) {
    var re = -1;
    for (var idx = 0; idx < array.length; idx++) {
        var obj = array[idx];
        re = idx;
        for (var key in filter) {
            if (filter.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                if (obj[key] != filter[key]) {
                    re = -1;
                    break;
                }
            }
        }
        if (re != -1) {
            return idx;
        }
    }
    return -1;
}
function getIEVersion() {
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    else if (navigator.appName == 'Netscape') {
        var ua = navigator.userAgent;
        var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})"); //for IE 11
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}
function numberTo2Bytes(num) {
    var bytes = [0, 0];
    for (var i = 0; i < bytes.length; i++) {
        var byte = num & 0xff;
        bytes[i] = byte;
        num = (num - byte) / 0x100;
    }
    return bytes;
}
function numberTo4Bytes(num) {
    var bytes = [0, 0, 0, 0];
    for (var i = 0; i < bytes.length; i++) {
        var byte = num & 0xff;
        bytes[i] = byte;
        num = (num - byte) / 0x100;
    }
    return bytes;
}
function stringToBytes(str) {
    var binaryLen = str.length;
    var bytes = [];
    for (var i = 0; i < binaryLen; i++) {
        var ascii = str.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}
function base64ToBytes(base64) {
    var binaryString = window.atob(base64.split(',')[1]);
    var bytes = new Uint8Array(stringToBytes(binaryString));
    return bytes;
}
function getKeyTable() {
    return {
        "k_0": "NO",
        "k_1": "ERR_RO",
        "k_2": "POST_FAIL",
        "k_3": "UNDEFINE",
        "k_4": "A",
        "k_5": "B",
        "k_6": "C",
        "k_7": "D",
        "k_8": "E",
        "k_9": "F",
        "k_A": "G",
        "k_B": "H",
        "k_C": "I",
        "k_D": "J",
        "k_E": "K",
        "k_F": "L",
        "k_10": "M",
        "k_11": "N",
        "k_12": "O",
        "k_13": "P",
        "k_14": "Q",
        "k_15": "R",
        "k_16": "S",
        "k_17": "T",
        "k_18": "U",
        "k_19": "V",
        "k_1A": "W",
        "k_1B": "X",
        "k_1C": "Y",
        "k_1D": "Z",
        "k_1E": "1",
        "k_1F": "2",
        "k_20": "3",
        "k_21": "4",
        "k_22": "5",
        "k_23": "6",
        "k_24": "7",
        "k_25": "8",
        "k_26": "9",
        "k_27": "0",
        "k_28": "ENTER",
        "k_29": "ESC",
        "k_2A": "BACKSPACE",
        "k_2B": "TAB",
        "k_2C": "SPACE",
        "k_2D": "NEG",
        "k_2E": "EQUATION",
        "k_2F": "L_BRACKETS",
        "k_30": "R_BRACKETS",
        "k_31": "BACKSLASH",
        "k_32": "CODE42",
        "k_33": "SEMICOLON",
        "k_34": "APOSTROPHE",
        "k_35": "TILDE",
        "k_36": "COMMA",
        "k_37": "DOT",
        "k_38": "SLASH",
        "k_39": "CAP",
        "k_3A": "F1",
        "k_3B": "F2",
        "k_3C": "F3",
        "k_3D": "F4",
        "k_3E": "F5",
        "k_3F": "F6",
        "k_40": "F7",
        "k_41": "F8",
        "k_42": "F9",
        "k_43": "F10",
        "k_44": "F11",
        "k_45": "F12",
        "k_46": "PRINT",
        "k_47": "SCROLL",
        "k_48": "PAUSE",
        "k_49": "INSERT",
        "k_4A": "HOME",
        "k_4B": "PGUP",
        "k_4C": "DEL",
        "k_4D": "END",
        "k_4E": "PGDN",
        "k_4F": "R_ARROW",
        "k_50": "L_ARROW",
        "k_51": "DN_ARROW",
        "k_52": "UP_ARROW",
        "k_53": "NUM_LOCK",
        "k_54": "NUM_DIV",
        "k_55": "NUM_STAR",
        "k_56": "NUM_NEG",
        "k_57": "NUM_PLUS",
        "k_58": "NUM_ENTER",
        "k_59": "NUM_1",
        "k_5A": "NUM_2",
        "k_5B": "NUM_3",
        "k_5C": "NUM_4",
        "k_5D": "NUM_5",
        "k_5E": "NUM_6",
        "k_5F": "NUM_7",
        "k_60": "NUM_8",
        "k_61": "NUM_9",
        "k_62": "NUM_0",
        "k_63": "NUM_DOT",
        "k_64": "CODE45",
        "k_65": "APP(PN)",
        "k_66": "POWER",
        "k_67": "EQUAL",
        "k_68": "F13",
        "k_69": "F14",
        "k_6A": "F15",
        "k_6B": "F16",
        "k_6C": "F17",
        "k_6D": "F18",
        "k_6E": "F19",
        "k_6F": "F20",
        "k_70": "F21",
        "k_71": "F22",
        "k_72": "F23",
        "k_73": "F24",
        "k_74": "KB_EXECUTE",
        "k_75": "KB_HELP",
        "k_76": "KB_MENU",
        "k_77": "KB_SELECT",
        "k_78": "KB_STOP",
        "k_79": "KB_AGAIN",
        "k_7A": "KB_UNDO",
        "k_7B": "KB_CUT",
        "k_7C": "KB_COPY",
        "k_7D": "KB_PASTE",
        "k_7E": "KB_FIND",
        "k_7F": "KB_MUTE",
        "k_80": "KB_VOL_UP",
        "k_81": "KB_VOL_DN",
        "k_82": "LOCK_CAP",
        "k_83": "LOCK_NUM",
        "k_84": "LOCK_SCR",
        "k_85": "CODE107",
        "k_86": "0x086",
        "k_87": "CODE56",
        "k_88": "CODE133",
        "k_89": "CODE14",
        "k_8A": "CODE132",
        "k_8B": "CODE131",
        "k_90": "CODE151",
        "k_91": "CODE150",
        "k_B0": "MOUSE_KEY1",
        "k_B1": "MOUSE_KEY2",
        "k_B2": "MOUSE_KEY3",
        "k_B3": "MOUSE_KEY4",
        "k_B4": "MOUSE_KEY5",
        "k_B5": "MOUSE_KEY6",
        "k_B6": "MOUSE_KEY7",
        "k_B7": "MOUSE_KEY8",
        "k_B8": "MOUSE_KEY9",
        "k_B9": "MOUSE_KEY10",
        "k_BA": "MOUSE_KEY11",
        "k_BB": "MOUSE_KEY12",
        "k_BC": "MOUSE_KEY13",
        "k_BD": "MOUSE_KEY14",
        "k_BE": "MOUSE_KEY15",
        "k_BF": "MOUSE_KEY16",
        "k_C0": "G1",
        "k_C1": "G2",
        "k_C2": "G3",
        "k_C3": "G4",
        "k_C4": "G5",
        "k_C5": "G6",
        "k_C6": "G7",
        "k_C7": "G8",
        "k_C8": "G9(L_Space)",
        "k_C9": "G10(Fn1)",
        "k_CA": "G11",
        "k_CB": "G12",
        "k_CC": "G13",
        "k_CD": "G14",
        "k_CE": "G15",
        "k_CF": "G16(FN)",
        "k_D0": "G17",
        "k_D1": "G18",
        "k_D2": "G19",
        "k_D3": "G20",
        "k_D4": "G21",
        "k_D5": "G22",
        "k_D6": "G23",
        "k_D7": "G24",
        "k_E0": "L_CTRL",
        "k_E1": "L_SHIFT",
        "k_E2": "L_ALT",
        "k_E3": "L_WIN",
        "k_E4": "R_CTRL",
        "k_E5": "R_SHIFT",
        "k_E6": "R_ALT",
        "k_E7": "R_WIN",
        "k_E9": "ACPI_PD",
        "k_EA": "ACPI_SLEEP",
        "k_EB": "ACPI_WAKE",
        "k_EC": "MEDIA_SEL",
        "k_ED": "MAIL",
        "k_EE": "CALCULATOR",
        "k_EF": "MYCOMPUTER",
        "k_F0": "PLAY_PAUSE",
        "k_F1": "STOP",
        "k_F2": "PRE_TRACK",
        "k_F3": "NEXT_TRACK",
        "k_F4": "MUTE",
        "k_F5": "VOL_DEC",
        "k_F6": "VOL_INC",
        "k_F7": "W3SEARCH",
        "k_F8": "W3HOME",
        "k_F9": "W3BACK",
        "k_FA": "W3FORWARD",
        "k_FB": "W3STOP",
        "k_FC": "W3REFRESH",
        "k_FD": "W3FAVORITE"
    };
}
function getKeyFnKtm(keyboard, language) {
    switch (keyboard) {
        case 'core4700':
            switch (language) {
                case 'us':
                    return [
                        'G9(L_Space)', 'R_ALT', 'ESC', 'Q', 'TAB', 'A', 'L_SHIFT', 'Z',
                        'G15', 'PN', 'W', 'E', 'S', 'D', 'X', 'C',
                        'L_ALT', 'G13', 'R', 'T', 'F', 'G', 'V', 'B',
                        'G10(Fn1)', 'G16(FN)', 'Y', 'U', 'H', 'J', 'N', 'M',
                        'ENTER', 'L_CTRL', 'I', 'O', 'K', 'L', 'COMMA', 'DOT',
                        'BACKSPACE', 'L_WIN', 'P', 'R_CTRL', 'SEMICOLON', 'DEL', 'FN0', 'R_SHIFT',
                        'SPACE', 'G11', 'G12'
                    ];
            }
            break;
        case 'poker3':
            switch (language) {
                case 'us':
                    return [
                        'ESC', '1', '2', '3', '4', '5', '6', '7',
                        'TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U',
                        'CAP', 'A', 'S', 'D', 'F', 'G', 'H', 'J',
                        'L_SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',
                        'L_CTRL', 'L_WIN', 'L_ALT', '8', '9', '0', 'NEG', 'BACKSPACE',
                        'CODE45', '', 'EQUATION', 'I', 'O', 'P', 'L_BRACKETS', 'BACKSLASH',
                        '', '', 'R_BRACKETS', 'K', 'L', 'SEMICOLON', 'APOSTROPHE', 'ENTER',
                        '', '', 'SPACE', 'COMMA', 'DOT', 'SLASH', 'R_SHIFT', 'FN',
                        '', '', '', 'R_ALT', 'R_WIN', 'PN', '', 'R_CTRL',
                        'G1', 'G2', 'G3', 'G4'
                    ];
                case 'eu':
                case 'uk':
                case 'nor':
                case 'fr':
                case 'de':
                case 'sp':
                    return [
                        'ESC', '1', '2', '3', '4', '5', '6', '7',
                        'TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U',
                        'CAP', 'A', 'S', 'D', 'F', 'G', 'H', 'J',
                        'L_SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',
                        'L_CTRL', 'L_WIN', 'L_ALT', '8', '9', '0', 'NEG', 'BACKSPACE',
                        'CODE45', '', 'EQUATION', 'I', 'O', 'P', 'L_BRACKETS', 'BACKSLASH',
                        '', 'CODE42', 'R_BRACKETS', 'K', 'L', 'SEMICOLON', 'APOSTROPHE', 'ENTER',
                        '', '', 'SPACE', 'COMMA', 'DOT', 'SLASH', 'R_SHIFT', 'FN',
                        '', '', '', 'R_ALT', 'R_WIN', 'PN', '', 'R_CTRL',
                        'G1', 'G2', 'G3', 'G4'
                    ];
                case 'jp':
                    return [
                        'ESC', '1', '2', '3', '4', '5', '6', '7',
                        'TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U',
                        'CAP', 'A', 'S', 'D', 'F', 'G', 'H', 'J',
                        'L_SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',
                        'L_CTRL', 'L_WIN', 'L_ALT', '8', '9', '0', 'NEG', 'BACKSPACE',
                        'CODE45', '', 'EQUATION', 'I', 'O', 'P', 'L_BRACKETS', 'BACKSLASH',
                        'CODE42', 'CODE56', 'R_BRACKETS', 'K', 'L', 'SEMICOLON', 'APOSTROPHE', 'ENTER',
                        'CODE133', '', 'SPACE', 'COMMA', 'DOT', 'SLASH', 'R_SHIFT', 'FN',
                        'CODE132', 'CODE131', '', 'R_WIN', '', 'PN', 'CODE14', 'R_CTRL',
                        'G1', 'G2', 'G3', 'G4'
                    ];
            }
            break;
        case 'vtg7900':
            switch (language) {
                case 'us':
                case 'uk':
                case 'sp':
                case 'nor':
                case 'fr':
                case 'de':
                    return [
                        'ESC', '1', 'TAB', 'Q', 'CAP', 'A', 'L_SHIFT',
                        '2', '3', 'W', 'E', 'S', 'D', 'X', 'C',
                        '4', '5', 'R', 'T', 'F', 'G', 'V', 'B',
                        '6', '7', 'Y', 'U', 'H', 'J', 'N', 'M',
                        '8', '9', 'I', 'O', 'K', 'L', 'COMMA', 'DOT',
                        '0', 'NEG', 'P', 'L_BRACKETS', 'SEMICOLON', 'APOSTROPHE', 'SLASH', 'R_SHIFT',
                        'EQUATION', 'G6', 'R_BRACKETS', 'BACKSLASH', 'ENTER', 'CODE42', 'R_CTRL', 'NUM_DOT',
                        'BACKSPACE', 'TILDE', 'G12', '', 'PN', 'NUM_2', 'G13', 'NUM_0',
                        'SPACE', 'G9(L_Space)', 'L_WIN', 'L_CTRL', 'L_ALT', 'G8', 'R_ALT', 'FN',
                        'NUM_LOCK', 'NUM_DIV', 'NUM_7', 'NUM_8', 'NUM_4', 'NUM_5', 'NUM_1', 'CODE45',
                        'NUM_STAR', 'NUM_NEG', 'NUM_9', 'NUM_PLUS', 'NUM_6', 'NUM_ENTER', 'NUM_3', 'G7',
                        'G10(Fn1)', 'G11'
                    ];
            }
            break;
        case 'vtg7500_1':
        case 'vtg7500_2':
            return [
                'TILDE', '1', 'TAB', 'Q', 'CAP', 'A', 'L_SHIFT', 'Z',
                '2', '3', 'W', 'E', 'S', 'D', 'X', 'C',
                '4', '5', 'R', 'T', 'F', 'G', 'V', 'B',
                '6', '7', 'Y', 'U', 'H', 'J', 'N', 'M',
                '8', '9', 'I', 'O', 'K', 'L', 'COMMA', 'DOT',
                '0', 'NEG', 'P', 'L_BRACKETS', 'SEMICOLON', 'APOSTROPHE', 'SLASH', 'R_SHIFT',
                'EQUATION', 'BACKSPACE', 'R_BRACKETS', 'BACKSLASH', 'ENTER', 'PGDN', 'R_CTRL', 'R_ARROW',
                'PN', 'HOME', 'DEL', 'END', 'FN', 'UP_ARROW', 'DN_ARROW', 'L_ARROW',
                '', 'PGUP', 'L_WIN', 'L_CTRL', 'L_ALT', 'SPACE', 'R_ALT', '',
                'ESC', 'F1', 'F2', 'F3', 'F9', 'F8', 'CODE45', '',
                'F4', 'F5', 'F6', 'CODE42', 'F7', 'F10', 'F11', 'F12',
                'G10', 'G11', 'G12'
            ];
        case 'vtg6500':
            switch (language) {
                case 'us':
                case 'de':
                case 'uk':
                case 'nor':
                    return [
                        'ESC', '1', 'TAB', 'Q', 'CAP', 'A', 'L_SHIFT', 'Z',
                        '2', '3', 'W', 'E', 'S', 'D', 'X', 'C',
                        '4', '5', 'R', 'T', 'F', 'G', 'V', 'B',
                        '6', '7', 'Y', 'U', 'H', 'J', 'N', 'M',
                        '8', '9', 'I', 'O', 'K', 'L', 'COMMA', 'DOT',
                        '0', 'NEG', 'P', 'L_BRACKETS', 'SEMICOLON', 'APOSTROPHE', 'SLASH', 'R_SHIFT',
                        'EQUATION', 'BACKSPACE', 'R_BRACKETS', 'BACKSLASH', 'ENTER', 'CODE42', 'FN1', 'CODE56',
                        'CODE14', 'HOME', 'G11', 'END', 'FN0', 'UP_ARROW', 'DN_ARROW', 'L_ARROW',
                        'PGUP', 'G14', 'PGDN', 'G13', 'G12', 'CODE133', 'R_ARROW', 'CODE45',
                        'SPACE', 'CODE131', 'L_WIN', 'L_CTRL', 'L_ALT', 'CODE_132', 'R_ALT', 'G10',
                        'NUM_0', 'NUM_1', 'NUM_4', 'NUM_7', 'NUM_LOCK', 'MUTE', '', '',
                        'G1', 'NUM_2', 'NUM_5', 'NUM_8', 'NUM_DIV', 'VOL_DEC', '', '',
                        'NUM_DOT', 'NUM_3', 'NUM_6', 'NUM_9', 'NUM_STAR', 'VOL_INC', '', '',
                        'NUM_ENTER', '', 'NUM_PLUS', '', 'NUM_NEG', 'CALCULATOR', ''
                    ];
            }
            break;
        default:
            return [];
    }
}
function getKeyIdTable() {
    return {
        'K_8': '2A',
        'K_9': '2B',
        'K_13': '28',
        'K_16': 'E1',
        'K_17': 'E0',
        'K_18': 'E2',
        'K_19': '48',
        'K_20': '39',
        'K_27': '29',
        'K_33': '4B',
        'K_34': '4E',
        'K_35': '4D',
        'K_36': '4A',
        'K_37': '50',
        'K_38': '52',
        'K_39': '4F',
        'K_40': '51',
        'K_45': '49',
        'K_46': '4C',
        'K_48': '27',
        'K_49': '1E',
        'K_50': '1F',
        'K_51': '20',
        'K_52': '21',
        'K_53': '22',
        'K_54': '23',
        'K_55': '24',
        'K_56': '25',
        'K_57': '26',
        'K_65': '4',
        'K_66': '5',
        'K_67': '6',
        'K_68': '7',
        'K_69': '8',
        'K_70': '9',
        'K_71': 'A',
        'K_72': 'B',
        'K_73': 'C',
        'K_74': 'D',
        'K_75': 'E',
        'K_76': 'F',
        'K_77': '10',
        'K_78': '11',
        'K_79': '12',
        'K_80': '13',
        'K_81': '14',
        'K_82': '15',
        'K_83': '16',
        'K_84': '17',
        'K_85': '18',
        'K_86': '19',
        'K_87': '1A',
        'K_88': '1B',
        'K_89': '1C',
        'K_90': '1D',
        'K_91': 'E3',
        'K_92': 'E7',
        'K_96': '62',
        'K_97': '59',
        'K_98': '5A',
        'K_99': '5B',
        'K_100': '5C',
        'K_101': '5D',
        'K_102': '5E',
        'K_103': '5F',
        'K_104': '60',
        'K_105': '61',
        'K_106': '55',
        'K_107': '57',
        'K_109': '56',
        'K_110': '63',
        'K_111': '54',
        'K_112': '3A',
        'K_113': '3B',
        'K_114': '3C',
        'K_115': '3D',
        'K_116': '3E',
        'K_117': '3F',
        'K_118': '40',
        'K_119': '41',
        'K_120': '42',
        'K_121': '43',
        'K_122': '44',
        'K_123': '45',
        'K_144': '53',
        'K_145': '47',
        'K_186': '33',
        'K_187': '2E',
        'K_188': '36',
        'K_189': '2D',
        'K_190': '37',
        'K_191': '38',
        'K_219': '2F',
        'K_220': '31',
        'K_221': '30',
        'K_222': '34'
    };
}
