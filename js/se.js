/**
 * SysError.js: A portable JavaScript framework to manage any HTML-related components on the fly.
 * @author SysError99 (SysError_)
 * @version 0.1
 */
const SeMessage = {
    compInvalid: "Invalid compObject",
    compIdEmptyErr: "Component ID as string cannot be empty!",
    compIdBoolErr: "Component ID cannot be boolean!",
    compIdObjErr: "Component ID cannot be object!",
    compCompileErr0_0: "Unusual characters betweetn \"?\" and \"(\" or between \")\" and \"{\" of the component \"",
    compCompileErr0_1: "\"!",
    compCompiledWarn: "Due to security concerns, all contidional components loaded after this will not work!",
    compFileWarn: "Due to security concerns, any conditional components dynamically loaded from resFile() will not work!",
    jsImportWarn: "Any scripts imported by resFile() will not work, due to to security concerns.\n Implement your scripts in your webpage.html or webpage.js instead.",
    XhttpErr: "XMLHttpRequest failed, is it supported?",
    compCompiled:""
}
const SeObject = {
    requestHeaders: [], //request headers [n] ["header": "value"]
    modules: ["se-html", "se-css"], //modules to be loaded via se.invoke()
    css: document.createElement("style"), //css storage
    js: document.createElement("script"), //javascript storage
    conds:[], //conditional components (by block stack)
    acmps:[] //active components
}
/**
 * Add a request header for XMLHttpRequests.
 * @param {string} header Header text.
 * @param {string} value Value text.
 */
export function addRequestHeader(header, value){
    var _seHeaderArr = []
    _seHeaderArr["header"] = header
    _seHeaderArr["value"] = value 
    SeObject.requestHeaders.push(_seHeaderArr)
}
/**
 * Clear all request header for XMLHttpRequests.
 */
export function clearRequestHeader(){SeObject.requestHeaders = []}
/**
 * Make a request.
 * @param {string} httpMethod Request method GET, POST
 * @param {string} targetElementId Target of request (ex: script.php)
 * @param {string} dataObject Data to be sent.
 * @param {function} [functionSuccess] Function to be called when request is success.
 * @param {function} [functionFailed] Function to be called when request is failed.
 */
export function request(httpMethod, targetElementId, dataObject, functionSuccess, functionFailed){
    var _seXhttp = _seCreateCORSRequest(httpMethod, targetElementId, true)
    if(_seXhttp!=null){
        _seXhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) if(typeof functionSuccess === "function") functionSuccess(this.responseText)
            else if(typeof functionFailed === "function") functionFailed()
        }
        _seXhttp.send(dataObject)
    }else throw Error(SeMessage.XhttpErr)
}
/**
 * Invoke all se-* attributes in elements.
*/
export function invoke() {
    var _seI, attribute, _sI, fileLocation
    for(_seI=0; _seI < SeObject.modules.length; _seI++){
        attribute = SeObject.modules[_seI]
        var _seElements = document.getElementsByTagName("*") //scan elements
        for (_sI=0; _sI<_seElements.length; _sI++) {
            fileLocation = _seElements[_sI].getAttribute(attribute)
            if(fileLocation) _seLoad(attribute, fileLocation, _seElements[_sI])
        }
    }
}
/**
 * Load resource from a string.
 * @param {string} resType Resource type to be imported in (se-*)
 * @param {string} resString Resource as string to be loaded.
 * @param {string|object} resElement Element type to append (Optional)
 * @returns {object|null} If resType is 'comp', this will return a component
*/
export function res(resType, resString, resElement) {
    if(SeMessage.compCompiled === "!") console.warn(SeMessage.compCompiledWarn) //if compiled
    var seElmnt = null
    var seCheckedName
    //check against element
    if(typeof resElement === "string") seElmnt = document.getElementById(resElement)
    else if(typeof resElement === "object") seElmnt = resElement
    else seElmnt = document.body
    return _seAdd("se-"+resType, resString, seElmnt) //add
}
/**
 * Load resource from a file.
 * @param {string} resType Resource type to be imported in (se-*)
 * @param {string} resFile File location to be loaded.
 * @param {string|object} resElement Element type to append (Optional)
 */
export function resFile(resType, resFile, resElement) {
    var seElmnt = null
    //check against the element to be appended
    if(typeof resElement === "string") seElmnt = document.getElementById(resElement)
    else if(typeof resElement === "object") seElmnt = resElement
    else seElmnt = document.body
    if(resType==="comp") {
        console.warn(SeMessage.compFileWarn)
    }
    if(resType==="js") console.warn(SeMessage.jsImportWarn)
    else _seLoad("se-"+resType, resFile, seElmnt) //load file
    return null
}
/** 
 * Unload resources
 * @param {target} targetElementId Type of things of be unloaded.
 * @param {string} targetLocation Location of target to be unloaded (for comp)
 */
export function unload(targetElementId) {
    //CSS
    if(targetElementId === "css") SeObject.css.innerHTML = ""
    //Elements
    else{
        var seElmnt = document.getElementById(resElement)
        if(seElmnt) seElmnt.innerHTML = ""
    }
}
/**
 * Shorthand for documenrt.getElementsByClassName()
 * @param {string} className Class name.
 * @return {array} Element array.
 */
export function elesClass(className){return document.getElementsByClassName(className)}
/**
 * Shorthand for document.getElementsByName()
 * @param {string} resName Name of Tag.
 * @return {array} Element array.
 */
export function elesName(resName){return document.getElementsByName(resName)}
/**
 * Shorthand for document.getElementsByNameNS()
 * @param {string} namespace Namespace name.
 * @param {string} resName Local Name.
 * @return {array} Element array.
 */
export function elesNS(namespace, resName){return document.getElementsByTagNameNS(namespace,resName)}
/** Shorthand for doucument.getElementsByTagName() 
 * @param {string} tag Tag Name.
 * @return {array} Element array.
*/
export function elesTag(tag){return document.getElementsByTagName(tag)}
/** Shorthand for document.getElementById()
 * @param {string} elementId Element ID.
 * @return {object} Element
 */
export function ele(elementId){return document.getElementById(elementId)}
/**
 * Shorthand for document.querySelector()
 * @param {string} queryStr Query string
 */
export function qs(queryStr){return document.querySelector(queryStr)}
/**
 * Se.JS App container.
 */
export const app = {}
/**
 * Find a component with name
 * @param {string|number} resName name of the component
 */
export function where(resName){
    var _seIndex
    var _seResult = null
    for(_seIndex in resName){
        if(SeObject.acmps[_seIndex].id === resName){
            _seResult = SeObject.acmps[_seIndex]
            break
        }
    }return _seResult
}
/**
 * Create an element from component
 * @param {string|number} elementId Element ID. 
 * @param {string} [compObject] Component object
 * @param {string|object} [targetElementId] Target to insert this component in (optional, append to document.body by default)
 * @param {array|object} [dataObject] Data to be put in.
 * @returns {object} A component object.
 */
export function comp(elementId, compObject, targetElementId, dataObject) {
    if(typeof compObject !== "object")
        throw Error(SeMessage.compInvalid)
    _seCheckCompId(elementId)
    _seCompDeploy()
    this.id = elementId
    this._data = {}
    this.data = this._data
    this.component = compObject //set component
    this.element = _seCompElement(targetElementId)
    if(compObject !== ""){//if comp is set
        if(typeof dataObject === "object") this._data = dataObject//if there is data in parameters
        else if(typeof targetElementId === "object" && !_seIsElement(targetElementId)) this._data = targetElementId//if parmeter "target" is data
        compSet(this, this._data)
    }
    SeObject.acmps.push(this)
}
function _seCheckCompId(elementId){
    if(typeof elementId === "string") {if(elementId === "") throw Error(SeObject.compIdEmptyErr)}
    else if(typeof elementId === "boolean") throw Error(SeObject.compIdBoolErr)
    else if(typeof elementId === "object") throw Error(SeMessage.compIdObjErr)
}
function _seCompElement(targetElementId){
    var _seCompParent
    var _seElement = document.createElement("div") //element
    if(typeof targetElementId === "string") _seCompParent = document.getElementById(targetElementId) //where to put in
    else if(typeof targetElementId === "object") {
        if(_seIsElement(targetElementId) === "string") _seCompParent = targetElementId
        else _seCompParent = document.body
    }else _seCompParent = document.body
    _seCompParent.appendChild(_seElement)
    return _seElement
}
/**
 * Set component with the data.
 * @param {object} dataObject Data that will be used by the component.
 */
comp.prototype.set = function(dataObject) {
    if(typeof dataObject === "undefined") compSet(this, this._data)
    else compSet(this, dataObject)
}
/**
 * Set component visibility.
 * @param {string} visible Visibility.
 */
comp.prototype.visibility = function(visible) { compVisibility(this, visible) }
/**
 * Set component display.
 * @param {string} displayMode Display mode.
 */
comp.prototype.display = function(displayMode) { compDisplay(this, displayMode) }
/**
 * Clean a component (innerHTML)
 */
comp.prototype.clean = function() { compClean(this) }
/**
 * Kill the component
 */
comp.prototype.kill = function() { compKill (this) }
/**
 * Create a reactive element from component
 * @param {string|number} elementId Element ID. 
 * @param {string} [compObject] Loaded component location (without file extension)
 * @param {string|object} [targetElementId] Target to insert this component in (optional, append to document.body by default)
 * @param {array|object} [dataObject] Data to be put in.
 * @returns {object} A component object.
 */
export function reactComp(elementId, compObject, targetElementId, dataObject){
    if(typeof compObject !== "object")
        throw Error(SeMessage.compInvalid)
    _seCheckCompId(elementId)
    _seCompDeploy()
    this.id = elementId
    this._data = {}
    this.component = compObject //set component
    this.element = _seCompElement(targetElementId)
    if(compObject !== ""){//if comp is set
        if(typeof dataObject === "object") this._data = dataObject //if there is data in parameters
        else if(typeof targetElementId === "object" && !_seIsElement(targetElementId)) this._data = targetElementId //if parmeter "target" is data
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
    SeObject.acmps.push(this)
}reactComp.prototype = Object.create(comp.prototype)
/**
 * Fetch data to component.
 * @param {object} compObject Component object.
 * @param {object} dataObject Object of data to be used.
 */
export function compSet(compObject, dataObject){
    var seCompWaiter = setInterval(function(){ //wait for loaded components
        if(typeof compObject.component !== 'object')
            return
        if(compObject.component === null)
            return
        if(compObject.component.str !== '' && compObject.component.str !== null){
            compObject.element.innerHTML = _seCompParse(dataObject, compObject.component.str).split("$#?").join(compObject.id) //also set comp id in component
            clearInterval(seCompWaiter)//kill waiter
        }
    },2)
    _seIntervalTimeout(seCompWaiter)
}
/**
 * Set visibility of a component.
 * @param {object} compObject Component object.
 * @param {string} visible Visibility.
 */
export function compVisibility(compObject, visible){
    var seCompWaiter = setInterval(function(){ //wait for loaded components
        if(typeof compObject.element === "object") {
            compObject.element.style.visibility = visible
            clearInterval(seCompWaiter)//kill waiter
        }
    },2)
    _seIntervalTimeout(seCompWaiter)
}
/**
 * Set display mode for a component
 * @param {object} compObject Component object
 * @param {string} seCompDisplay Display mode.
 */
export function compDisplay(compObject, seCompDisplay){
    var seCompWaiter = setInterval(function(){ //wait for loaded components
        if(typeof compObject.element === "object") {
            compObject.element.style.display = seCompDisplay
            clearInterval(seCompWaiter)//kill waiter
        }
    },2)
    _seIntervalTimeout(seCompWaiter)
}
/**
 * Clean a component (innerHTML)
 * @param {object} compObject Component object.
 */
export function compClean(compObject){
    var seCompWaiter = setInterval(function(){ //wait for loaded components
        if(typeof compObject.element === "object") {
            compObject.element.innerHTML = ""
            clearInterval(seCompWaiter)
        }
    },2)
    _seIntervalTimeout(seCompWaiter)
}
/**
 * Kill a component.
 * @param {object} compObject Component object.
 */
export function compKill(compObject){
    var _seIndex
    for(_seIndex in SeObject.acmps){
        if(SeObject.acmps[_seIndex] === compObject){
            SeObject.acmps[_seIndex] = null
            break
        }
    }
    compObject.data = null
    compObject._data = null
    compObject.element.parentNode.removeChild(compObject.element)
    compObject.element = null
}
function _seRemoveTab(resString){
    var _seTextSplit = resString.split("\n")
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
function _seRemoveSpace(resString){
    var _sRI = 0
    var _seTxt = ""
    var _seRemoved = ""
    var _seQuoteSign = ""
    while(_sRI < resString.length){ //remove spaces
        _seTxt = resString[_sRI]
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
function _seCompCompile(compStr){ //compile component
    var _sI = 0
    var _seStack = 0
    var _seStage = 0
    var _seBucket = ""
    var _seStackBlock = 0;
    var _seStartBlock = -1 //save process time
    var _seCompStr = _seRemoveTab(compStr).split("?if(").join("?(if#").split("?elif(").join("?(elif#").split("?else{").join("?(else#){").split('$.').join('SeJS.')
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
                }else throw Error(SeMessage.compCompileErr0_0 + SeMessage.compCompileErr0_1) //wrong syntax
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
function _seCompCompile_process(compStr,stackBlock){
    if(typeof SeObject.conds[stackBlock] === "undefined") SeObject.conds[stackBlock] = [] //create stack trace
    var _seComp = compStr.substring(2,compStr.length-2).split("){") //split script
    var _seExpression = _seComp.shift() //pull expression
        _seComp = _seComp.join("){") //return back
    var _seStackBlockId = SeObject.conds[stackBlock].length //get stack block id
    var _seCond = _seExpression.substring(0, _seExpression.indexOf("#"))//detect conditions
    if(_seCond != "") {
        SeObject.conds[stackBlock][_seStackBlockId] = _seCond //add to stack
        _seExpression = _seExpression.split(_seCond+"#").join("") //remove from expression for js engine
        if(_seCond !== "else") SeMessage.compCompiled += "case \""+stackBlock.toString()+"."+_seStackBlockId.toString()+"\":return ("+_seRemoveSpace(_seExpression).split("$").join("b.")+");break;" //create a script, when not "else"
    }else throw Error("Condition Error of condition \""+_seExpression+"\"")
    return "?<"+stackBlock.toString()+"."+_seStackBlockId.toString()+"{"+_seComp+"}"+stackBlock.toString()+"."+_seStackBlockId.toString()+">?" //make a sign
}
function _seCompParse(dataObject, compStr){ //parse component
    var _seDataKey, _seArrKey, _seCond, _seCondTest, _seStack, _seStackBlock, _seStackIf, _seCondStart, _seCondStartIndex, _seCondEnd, _seCondComp,  _seKey, _seEmptyComp, _seEmptyCompFront, _seEmptyCompIndex, _seEmptyCompBack, _seSubComp, _seSubCompFront, _seSubCompIndex, _seSubCompData, _seSubCompBack
    var _seResult = compStr
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
                _seCondTest = window.__SEEXPRESSION__(_seCond,dataObject) //test
                if(_seCondTest && _seStackIf){ //true
                    _seResult = _seResult.split(_seCondStart+_seCondComp+_seCondEnd).join(_seCondComp)
                    _seStackIf = false
                }else _seResult = _seResult.split(_seCondStart+_seCondComp+_seCondEnd).join("") //false
            }
        }
    }while(_seCompParseMode--){ //array component
        for(_seDataKey in dataObject) if(typeof dataObject[_seDataKey] !== "function") {
            _seEmptyComp = "" //empty component
            _seEmptyCompFront = "!"+_seDataKey+"{"
            _seEmptyCompIndex = _seResult.indexOf(_seEmptyCompFront)
            if(_seEmptyCompIndex!==-1){
                _seEmptyCompBack = "}"+_seDataKey+"!"
                _seEmptyComp = _seResult.substring(_seEmptyCompIndex+_seEmptyCompFront.length, _seResult.lastIndexOf(_seEmptyCompBack))//extract
                _seResult = _seResult.split(_seEmptyCompFront+_seEmptyComp+_seEmptyCompBack).join("")
            }if(_seCompParseMode === 1 && typeof dataObject[_seDataKey] === "object") { //array or obj
                _seSubCompFront = "$"+_seDataKey+"{"
                _seSubCompIndex = _seResult.indexOf(_seSubCompFront)
                if(_seSubCompIndex!==-1){
                    _seSubCompData = "" //sub component
                    _seSubCompBack = "}"+_seDataKey+"$"
                    _seSubComp = _seResult.substring(_seSubCompIndex+_seSubCompFront.length, _seResult.lastIndexOf(_seSubCompBack))//extract
                    for(_seArrKey in dataObject[_seDataKey]){ //data in array
                        if(typeof dataObject[_seDataKey][_seArrKey] === "object") _seSubCompData += _seCompParse(dataObject[_seDataKey][_seArrKey], _seSubComp)//object
                        else if(typeof dataObject[_seDataKey][_seArrKey] !== "function") _seSubCompData += _seSubComp.split("$[]").join(dataObject[_seDataKey][_seArrKey]) //non-object
                        _seSubCompData = _seSubCompData.split("$@").join(_seArrKey) //array number
                    }if(_seSubCompData === "") _seSubCompData = _seEmptyComp//if empty
                    _seResult = _seResult.split(_seSubCompFront+_seSubComp+_seSubCompBack).join(_seSubCompData)
                }
            }else if(_seCompParseMode === 0){ //others
                _seKey = _seResult.split("$"+_seDataKey)
                if(
                    Number.isNaN(dataObject[_seDataKey]) ||
                    dataObject[_seDataKey] === null ||
                    dataObject[_seDataKey] === ""
                ) _seResult = _seKey.join(_seEmptyComp) //none or invalid data
                else _seResult = _seKey.join(dataObject[_seDataKey])
            }
        }
    }return _seResult
}
function _seCompDeploy(){
    if(SeMessage.compCompiled !== "" && SeMessage.compCompiled !== "!"){//if never deploy js engine before
        _seAdd("se-js","__SEEXPRESSION__=(a,b)=>{switch(a){default: return true;"+SeMessage.compCompiled+"}}",document.body) //deploy
        SeMessage.compCompiled = "!" //clean
    }
}
function _seIntervalTimeout(interval){//kill interval if out of time
    setTimeout(function(){
        if(typeof interval === "object"){
            clearInterval(interval);
        }
    },10000)
}
function _seCreateCORSRequest(corsMethod, corsUrl, corsAsync){ //CORSRequest
    var _seXhr = new XMLHttpRequest()
    if ("withCredentials" in _seXhr) _seXhr.open(corsMethod, corsUrl, corsAsync) //modern browsers
    else if (typeof XDomainRequest != "undefined") {
      //ie
      _seXhr = new XDomainRequest()
      _seXhr.open(corsMethod, corsUrl)
    }
    else _seXhr = null;//unsupported
    //set headers
    if(_seXhr != null){
        var _seRequestHeaders = SeObject.requestHeaders.length
        while(_seRequestHeaders--)
            _seXhr.setRequestHeader(SeObject.requestHeaders[_seRequestHeaders]["header"],SeObject.requestHeaders[_seRequestHeaders]["value"])
    }return _seXhr
}
function _seLoad(attribute, fileLocation, elementToClean){ //load from file
    request("GET", fileLocation, "", function(seResponse){
        _seAdd(attribute, seResponse, elementToClean)
    })
}
function _seAdd(attribute, responseText, elementToClean){ //add
    let seCompCompiled = null
    switch(attribute){
        //HTML
        case "se-html":
            elementToClean.innerHTML += responseText
            break
        //CSS
        case "se-css":
            SeObject.css.innerHTML += responseText
            break
        //JavaScript
        case "se-js":
            SeObject.js.innerHTML += responseText
            break
        //Component
        case "se-comp":
            seCompCompiled = _seCompCompile(responseText) //compile component
            break
    }
    if(elementToClean.getAttribute(attribute) !== null)
        elementToClean.removeAttribute(attribute) //clean loaded attribute
    return {
        str: seCompCompiled
    }
}
function _seIsElement(object){
    return (
        typeof HTMLElement === "object" ? object instanceof HTMLElement : //DOM2
        object && typeof object === "object" && object !== null && object.nodeType === 1 && typeof object.nodeName==="string"
    )
}
function _se(){
    //Append to header
    var _seDocHead  = document.getElementsByTagName('head')[0]
    _seDocHead.appendChild(SeObject.css)
    _seDocHead.appendChild(SeObject.js)
    window.SeJS = app //append function holder to global scope
    invoke()
}_se()