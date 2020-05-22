/**
 * SysError.js: A portable JavaScript framework to manage any HTML-related components on the fly.
 * @author SysError99 (SysError_)
 * @version 0.1
 */
/**
 * An object contains error messages in the framework
 */
const SeMessage = {
    compNameInvalid: "Invalid name of seComp (is it a string?)",
    compCompileErr0_0: "Unusual characters betweetn \"?\" and \"(\" or between \")\" and \"{\" of the component \"",
    compCompileErr0_1: "\"!",
    compCompiledWarn: "Due to security concerns, all contidional components loaded after this will not work!",
    jsImportWarn: "Any scripts imported by resFile() will not work, due to to security concerns.\n Implement your scripts in your webpage.html or webpage.js instead.",
    XhttpErr: "XMLHttpRequest failed, is it supported?",
    compCompiled:""
}
/**
 * An object of the framework.
 */
const SeObject = {
    requestHeaders: [], //request headers [n] ["header": "value"]
    modules: ["se-html", "se-css"], //modules to be loaded via se.invoke()
    css: document.createElement("style"), //css storage
    js: document.createElement("script"), //javascript storage
    comps:[], //components
    conds:[], //conditional components (by block stack)
    globs:{} //global declare for Se related things
}
/**
 * Add a request header for XMLHttpRequests.
 * @param {string} seHeader Header text.
 * @param {string} seValue Value text.
 */
export function addRequestHeader(seHeader, seValue){
    var _seHeaderArr = []
    _seHeaderArr["header"] = seHeader
    _seHeaderArr["value"] = seValue 
    SeObject.requestHeaders.push(_seHeaderArr)
}
/**
 * Clear all request header for XMLHttpRequests.
 */
export function clearRequestHeader(){SeObject.requestHeaders = []}
/**
 * 
 * @param {string} seMethod Request method GET, POST
 * @param {string} seTarget Target of request (ex: script.php)
 * @param {function} [seFunctionSuccess] Function to be called when request is success.
 * @param {function} [seFunctionFailed] Function to be called when request is failed.
 */
export function request(seMethod, seTarget, seFunction){
    var _seXhttp = _seCreateCORSRequest(seMethod, seTarget, true)
    if(_seXhttp!=null){
        _seXhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) if(typeof seFunction === "function") seFunction(this.responseText)
            else seFunctionFailed()
        }
        _seXhttp.send()
    }else throw Error(SeMessage.XhttpErr)
}
/**
 * Invoke all se-* attributes in elements.
*/
export function invoke() {
    var _seI, _seAttr, _sI, _seFile
    for(_seI=0; _seI < SeObject.modules.length; _seI++){
        _seAttr = SeObject.modules[_seI]
        var _seElements = document.getElementsByTagName("*") //scan elements
        for (_sI=0; _sI<_seElements.length; _sI++) {
            _seFile = _seElements[_sI].getAttribute(_seAttr)
            if(_seFile) _seLoad(_seAttr, _seFile, _seElements[_sI])
        }
    }
}
/**
 * Load resource from a string.
 * @param {string} seType Resource type to be imported in (se-*)
 * @param {string} seName Resource name (Required for se-comp, leave "" for others)
 * @param {string} seStr String to be loaded.
 * @param {string|object} seElement Element type to append (Optional)
*/
export function res(seType, seName, seStr, seElement) {
    if(SeMessage.compCompiled === "!") console.warn(SeMessage.compCompiledWarn) //if compiled
    var seElmnt = null
    var seCheckedName
    //check against element
    if(typeof seElement === "string") seElmnt = document.getElementById(seElement)
    else if(typeof seElement === "object") seElmnt = seElement
    else seElmnt = document.body
    //check against resource name
    if(typeof seName === "string") seCheckedName = seName
    if(typeof seCheckedName === "string") _seAdd("se-"+seType, seCheckedName, seStr, seElmnt) //add
}
/**
 * Load resource from a file.
 * @param {string} seType Resource type to be imported in (se-*)
 * @param {string} seFile File location to be loaded.
 * @param {string|object} seElement Element type to append (Optional)
 */
export function resFile(seType, seFile, seElement) {
    var seElmnt = null
    //check against the element to be appended
    if(typeof seElement === "string") seElmnt = document.getElementById(seElement)
    else if(typeof seElement === "object") seElmnt = seElement
    else seElmnt = document.body
    if(seType==="js") console.warn(SeMessage.jsImportWarn)
    else if(seType==="comp") console.warn(SeMessage.compCompiledWarn)
    else _seLoad("se-"+seType, seFile, seElmnt) //load file
}
/** 
 * Unload resources
 * @param {target} seTarget Type of things of be unloaded (css, elementId)
 * @param {string} seLocation Location of target to be unloaded (for se-comp)
 */
export function unload(seTarget, seLocation) {
    //CSS
    if(seTarget === "css") SeObject.css.innerHTML = ""
    //Component
    else if(seTarget === "comp"){
        if(typeof seLocation === "string") SeObject.comps[seLocation] = ""
    }
    //Elements
    else{
        var seElmnt = document.getElementById(seElement)
        if(seElmnt) seElmnt.innerHTML = ""
    }
}
/**
 * Objects/functions declared for Se components.
 */
export var global = SeObject.globs
/**
 * Create an element from component
 * @param {string} [seComp] Loaded component location (without file extension)
 * @param {string|object} [seTarget] Target to insert this component in (optional, append to document.body by default)
 * @param {array|object} [seData] Data to be put in.
 * @returns {object} A component object.
 */
export function comp(seComp, seTarget, seData) {
    _seCompDeploy()
    this._data = {}
    this.component = ""
    this.element = _seCompElement(seTarget)
    if(typeof seComp === "string") this.component = seComp //set component
    if(seComp !== ""){//if comp is set
        if(typeof seData === "object") this._data //if there is data in parameters
        else if(typeof seTarget === "object" && !_seIsElement(seTarget)) this._data //if parmeter "target" is data
        compSet(this, this._data)
    }
}
function _seCompElement(seTarget){
    var _seCompParent
    var _seElement = document.createElement("div") //element
    if(typeof seTarget === "string") _seCompParent = document.getElementById(seTarget) //where to put in
    else if(typeof seTarget === "object") {
        if(_seIsElement(seTarget) === "string") _seCompParent = seTarget
        else _seCompParent = document.body
    }else _seCompParent = document.body
    _seCompParent.appendChild(_seElement)
    return _seElement
}
/**
 * Set component with the data.
 * @param {object} seData Data that will be used by the component.
 */
comp.prototype.set = function(seData) {
    if(typeof seData === "undefined") compSet(this, this._data)
    else compSet(this, seData)
}
/**
 * Set component visibility.
 * @param {string} seVisibility Visibility.
 */
comp.prototype.visibility = function(seVisibility) { compVisibility(this, seVisibility) }
/**
 * Set component display.
 * @param {string} seDisplay Display mode.
 */
comp.prototype.display = function(seDisplay) { compDisplay(this, seDisplay) }
/**
 * Clean a component (innerHTML)
 */
comp.prototype.clean = function() { compClean(this) }
/**
 * Create a reactive element from component
 * @param {string} [seComp] Loaded component location (without file extension)
 * @param {string|object} [seTarget] Target to insert this component in (optional, append to document.body by default)
 * @param {array|object} [seData] Data to be put in.
 * @returns {object} A component object.
 */
export function reactComp(seComp, seTarget, seData){
    _seCompDeploy()
    this._data = {}
    this.component = ""
    this.element = _seCompElement(seTarget)
    if(typeof seComp === "string") this.component = seComp //set component
    if(seComp !== ""){//if comp is set
        if(typeof seData === "object") this._data = seData //if there is data in parameters
        else if(typeof seTarget === "object" && !_seIsElement(seTarget)) this._data = seTarget //if parmeter "target" is data
        compSet(this, this._data)
    }var _seComp = this //reactive
    var _seReactCompTrigger = {
        comp: _seComp, data: _seComp._data,
        get(_seData, _seDataKey) {
            if (typeof _seData[_seDataKey] === 'object' && _seData[_seDataKey] !== null) return new Proxy(_seData[_seDataKey], _seReactCompTrigger)
            else return _seData[_seDataKey]
        },set(_seData, _seDataKey, _seDataValue){
            _seData[_seDataKey] = _seDataValue
            compSet(this.comp, this.data)
            return true
        }
    }
    this.data = new Proxy(this._data,_seReactCompTrigger)
}reactComp.prototype = Object.create(comp.prototype)
/**
 * Fetch data to component.
 * @param {object} seComp Target component.
 * @param {object} seData Object of data to be used.
 */
export function compSet(seComp,seData){
    var seCompWaiter = setInterval(function(){ //wait for loaded components
        if(typeof SeObject.comps[seComp.component] === "string"){
            seComp.element.innerHTML = _seCompParse(seData, SeObject.comps[seComp.component])
            clearInterval(seCompWaiter)//kill waiter
        }
    },2)
    _seIntervalTimeout(seCompWaiter)
}
/**
 * Set visibility of a component.
 * @param {object} seComp Target component.
 * @param {string} seVisibility Visibility.
 */
export function compVisibility(seComp, seVisibility){
    var seCompWaiter = setInterval(function(){ //wait for loaded components
        if(typeof seComp.element === "object") {
            seComp.element.style.visibility = seVisibility
            clearInterval(seCompWaiter)//kill waiter
        }
    },2)
    _seIntervalTimeout(seCompWaiter)
}
/**
 * Set display mode for a component
 * @param {object} seComp Target component
 * @param {string} seCompDisplay Display mode.
 */
export function compDisplay(seComp, seCompDisplay){
    var seCompWaiter = setInterval(function(){ //wait for loaded components
        if(typeof seComp.element === "object") {
            seComp.element.style.display = seCompDisplay
            clearInterval(seCompWaiter)//kill waiter
        }
    },2)
    _seIntervalTimeout(seCompWaiter)
}
/**
 * Clean a component (innerHTML)
 * @param {object} seComp Target component.
 */
export function compClean(seComp){
    var seCompWaiter = setInterval(function(){ //wait for loaded components
        if(typeof seComp.element === "object") {
            seComp.element.innerHTML = ""
            clearInterval(seCompWaiter)
        }
    },2)
    _seIntervalTimeout(seCompWaiter)
}
function _seRemoveTab(seStr){
    var _seTextSplit = seStr.split("\n")
    var _sRI, _sRII, _sRT, _seNotTab
    for(_sRI in _seTextSplit){
        _sRII = 0
        _seNotTab = false
        while(_seNotTab === false && _sRII < _seTextSplit[_sRI].length){
            _sRT = _seTextSplit[_sRI][_sRII]
            if(_sRT === " ") _sRII++
            else _seNotTab = true
        }
        _seTextSplit[_sRI] = _seTextSplit[_sRI].substring(_sRII,_seTextSplit[_sRI].length)
    }return _seTextSplit.join("\n")
}
function _seRemoveSpace(seStr){
    var _sRI = 0
    var _seTxt = ""
    var _seRemoved = ""
    var _seQuoteSign = ""
    while(_sRI < seStr.length){ //remove spaces
        _seTxt = seStr[_sRI]
        if(_seQuoteSign === ""){
            if(_seTxt !== " " && _seTxt !== "\t"){
                _seRemoved += _seTxt
                if(_seTxt === "\"" || _seTxt === "\'" || _seTxt === "\`") _seQuoteSign = _seTxt //detect quote signs
            }
        }else{
            _seRemoved += _seTxt
            if(_seTxt === _seQuoteSign) _seQuoteSign = ""
        }
    _sRI++}return _seRemoved
}
function _seCompCompile(seCompStr, seCompName){ //compile component
    var _sI = 0
    var _seStack = 0
    var _seStage = 0
    var _seBucket = ""
    var _seStackBlock = 0;
    var _seStartBlock = -1 //save process time
    var _seCompStr = _seRemoveTab(seCompStr).split("?if(").join("?(if#").split("?elif(").join("?(elif#").split("?else{").join("?(else#){")
    while(_sI < _seCompStr.length){ //compile
        var _seTxt = _seCompStr[_sI]
        var _seTxts= _seCompStr[_sI+1]
        if(_seStage > 0) {//putTxt
            _seBucket += _seTxt
        }else{
            _seBucket = _seTxt
        }switch(_seStage){
            case 0: //find ?
                if(_seTxt === "?") {
                    _seStage = 1
                    if(_seStartBlock === -1) _seStartBlock = _sI - 1 //save process time
                }break
            case 1: //find (
                if(_seTxt === "(") { //start stack
                    _seStack = 1
                    _seStage = 2
                }else{ //ignore compiled
                    _seStage = 0
                    _sI--
                }break
            case 2: //find ( and ) until complete expression
                if(_seTxt === "(") _seStack++
                else if(_seTxt === ")"){
                    _seStack--
                    if(_seStack === 0) _seStage = 3//end stack
                }break
            case 3: //find {
                if(_seTxt === "{") {
                    _seStack = 1
                    _seStage = 4
                }else throw Error(SeMessage.compCompileErr0_0 + seCompName + SeMessage.compCompileErr0_1) //wrong syntax
                break
            case 4: //find }
                if(_seTxt === "}" && _seTxts === "?") { //end block, stack-
                    _seStack--
                    if(_seStack === 0) _seStage = 5 //end stack
                }else if(_seTxt === "?" && _seTxts === "(") _seStack++ //another sub block, stack+
                break
            case 5: //find ? (end)
                //process here
                var _seProcessSign = _seCompCompile_process(_seBucket,_seStackBlock)
                _seCompStr = _seCompStr.split(_seBucket).join(_seProcessSign) //replace
                _sI = _seStartBlock //find again
                _seStackBlock = 0 //reset
                _seStage = 0 
                break
        }if(_seTxt === "?" && _seTxts === "<") _seStackBlock++ //stack trace
        else if(_seTxt === ">" && _seTxts === "?") _seStackBlock--
    _sI++}return _seCompStr
}
function _seCompCompile_process(seCompStr,seStackBlock){
    if(typeof SeObject.conds[seStackBlock] === "undefined") SeObject.conds[seStackBlock] = [] //create stack trace
    var _seComp = seCompStr.substring(2,seCompStr.length-2).split("){") //split script
    var _seExpression = _seComp.shift() //pull expression
        _seComp = _seComp.join("){") //return back
    var _seStackBlockId = SeObject.conds[seStackBlock].length //get stack block id
    var _seCond = _seExpression.substring(0, _seExpression.indexOf("#"))//detect conditions
    if(_seCond != "") {
        SeObject.conds[seStackBlock][_seStackBlockId] = _seCond //add to stack
        _seExpression = _seExpression.split(_seCond+"#").join("") //remove from expression for js engine
        if(_seCond !== "else") SeMessage.compCompiled += "case \""+seStackBlock.toString()+"."+_seStackBlockId.toString()+"\":return ("+_seRemoveSpace(_seExpression).split("$").join("b.")+");break;" //create a script, when not "else"
    }else throw Error("Condition Error of condition \""+_seExpression+"\"")
    return "?<"+seStackBlock.toString()+"."+_seStackBlockId.toString()+"{"+_seComp+"}"+seStackBlock.toString()+"."+_seStackBlockId.toString()+">?" //make a sign
}
function _seCompParse(seData, seCompStr){ //parse component
    var _seDataKey, _seArrKey, _seCond, _seCondTest, _seStack, _seStackBlock, _seStackIf, _seCondStart, _seCondStartIndex, _seCondEnd, _seCondComp,  _seKey, _seEmptyComp, _seEmptyCompFront, _seEmptyCompIndex, _seEmptyCompBack, _seSubComp, _seSubCompFront, _seSubCompIndex, _seSubCompData, _seSubCompBack
    var _seResult = seCompStr
    var _seCompParseMode = 2
    for(_seStack in SeObject.conds){ //conditional component
        _seStackIf = true
        for(_seStackBlock in SeObject.conds[_seStack]){
            _seCond = _seStack+"."+_seStackBlock
            _seCondStart = "?<"+_seCond+"{"
            _seCondStartIndex =  _seResult.indexOf(_seCondStart)
            if(_seCondStartIndex !== -1){ //exists
                _seCondEnd = "}"+_seCond+">?"
                _seCondComp = _seResult.substring(_seCondStartIndex+_seCondStart.length, _seResult.indexOf(_seCondEnd))//inside cond
                if(SeObject.conds[_seStack][_seStackBlock] === "if") _seStackIf = true //if "if", reset
                _seCondTest = window.__SEEXPRESSION__(_seCond,seData) //test
                if(_seCondTest && _seStackIf){ //true
                    _seResult = _seResult.split(_seCondStart+_seCondComp+_seCondEnd).join(_seCondComp)
                    _seStackIf = false
                }else _seResult = _seResult.split(_seCondStart+_seCondComp+_seCondEnd).join("") //false
            }
        }
    }while(_seCompParseMode--){ //array component
        for(_seDataKey in seData) if(typeof seData[_seDataKey] !== "function") {
            _seEmptyComp = "" //empty component
            _seEmptyCompFront = "!"+_seDataKey+"{"
            _seEmptyCompIndex = _seResult.indexOf(_seEmptyCompFront)
            if(_seEmptyCompIndex!==-1){
                _seEmptyCompBack = "}"+_seDataKey+"!"
                _seEmptyComp = _seResult.substring(_seEmptyCompIndex+_seEmptyCompFront.length, _seResult.lastIndexOf(_seEmptyCompBack))//extract
                _seResult = _seResult.split(_seEmptyCompFront+_seEmptyComp+_seEmptyCompBack).join("")
            }if(_seCompParseMode === 1 && typeof seData[_seDataKey] === "object") { //array or obj
                _seSubCompFront = "$"+_seDataKey+"{"
                _seSubCompIndex = _seResult.indexOf(_seSubCompFront)
                if(_seSubCompIndex!==-1){
                    _seSubCompData = "" //sub component
                    _seSubCompBack = "}"+_seDataKey+"$"
                    _seSubComp = _seResult.substring(_seSubCompIndex+_seSubCompFront.length, _seResult.lastIndexOf(_seSubCompBack))//extract
                    for(_seArrKey in seData[_seDataKey]){ //data in array
                        if(typeof seData[_seDataKey][_seArrKey] === "object") _seSubCompData += _seCompParse(seData[_seDataKey][_seArrKey], _seSubComp)//object
                        else if(typeof seData[_seDataKey][_seArrKey] !== "function") _seSubCompData += _seSubComp.split("$[]").join(seData[_seDataKey][_seArrKey]) //non-object
                        _seSubCompData = _seSubCompData.split("$@").join(_seArrKey) //array number
                    }if(_seSubCompData === "") _seSubCompData = _seEmptyComp//if empty
                    _seResult = _seResult.split(_seSubCompFront+_seSubComp+_seSubCompBack).join(_seSubCompData)
                }
            }else if(_seCompParseMode === 0){ //others
                _seKey = _seResult.split("$"+_seDataKey)
                if(
                    Number.isNaN(seData[_seDataKey]) ||
                    seData[_seDataKey] === null ||
                    seData[_seDataKey] === ""
                ) _seResult = _seKey.join(_seEmptyComp) //none or invalid data
                else _seResult = _seKey.join(seData[_seDataKey])
            }
        }
    }return _seResult
}
function _seCompDeploy(){
    if(SeMessage.compCompiled !== "" && SeMessage.compCompiled !== "!"){//if never deploy js engine before
        _seAdd("se-js",null,"__SEEXPRESSION__=(a,b)=>{switch(a){default: return true;"+SeMessage.compCompiled+"}}",document.body) //deploy
        SeMessage.compCompiled = "!" //clean
    }else console.warn(SeMessage.compCompiledWarn)
}
function _seIntervalTimeout(_seInterval){//kill interval if out of time
    setTimeout(function(){
        if(typeof _seInterval === "object"){
            clearInterval(_seInterval);
        }
    },10000)
}
function _seCreateCORSRequest(_seMethod, _seUrl, _seAsync){ //CORSRequest
    var _seXhr = new XMLHttpRequest()
    if ("withCredentials" in _seXhr) _seXhr.open(_seMethod, _seUrl, _seAsync) //modern browsers
    else if (typeof XDomainRequest != "undefined") {
      //ie
      _seXhr = new XDomainRequest()
      _seXhr.open(_seMethod, _seUrl)
    }
    else _seXhr = null;//unsupported
    //set headers
    if(_seXhr != null){
        var _seRequestHeaders = SeObject.requestHeaders.length
        while(_seRequestHeaders--)
            _seXhr.setRequestHeader(SeObject.requestHeaders[_seRequestHeaders]["header"],SeObject.requestHeaders[_seRequestHeaders]["value"])
    }return _seXhr
}
function _seLoad(_seAttr, _seFile, _seElmnt){ //load from file
    request("GET", _seFile, function(seResponse){
        _seAdd(_seAttr, _seFile, seResponse, _seElmnt)
    })
}
function _seAdd(_seAttr, _seFile, _seRpTxt, _seElmnt){ //add
    switch(_seAttr){
        //HTML
        case "se-html":
            _seElmnt.innerHTML += _seRpTxt
            break
        //CSS
        case "se-css":
            SeObject.css.innerHTML += _seRpTxt
            break
        //JavaScript
        case "se-js":
            SeObject.js.innerHTML += _seRpTxt
            break
        //Component
        case "se-comp":
            SeObject.comps[_seFile.split(".html").join("")] = _seCompCompile(_seRpTxt, _seFile) //compile component
            break
    }
    if(_seElmnt.getAttribute(_seAttr) !== null) _seElmnt.removeAttribute(_seAttr) //clean loaded attribute
}
function _seIsElement(_seObj){
    return (
        typeof HTMLElement === "object" ? _seObj instanceof HTMLElement : //DOM2
        _seObj && typeof _seObj === "object" && _seObj !== null && _seObj.nodeType === 1 && typeof _seObj.nodeName==="string"
    )
}
function _se(){
    //Append to header
    var _seDocHead  = document.getElementsByTagName('head')[0]
    _seDocHead.appendChild(SeObject.css)
    _seDocHead.appendChild(SeObject.js)
    window.Se = global //append function holder to global scope
    invoke()
}_se()