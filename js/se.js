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
    compCompiledWarn: "All component expressions loaded before are statically compiled, all contidional components loaded after this will not work!",
    jsImportWarn: "Any scripts imported by resFile() will not work, due to to security concerns.\n Implement your scripts in your webpage.js instead.",
    XhttpErr: "XMLHttpRequest failed, is it supported?",
    compCompiled:""
}
/**
 * An object of the framework.
 */
const SeObject = {
    requestHeaders: [], //request headers [n] ["header": "value"]
    modules: ["se-html", "se-css", "se-js"], //modules to be loaded via se.invoke()
    css: document.createElement("style"), //css storage
    js: document.createElement("script"), //javascript storage
    comps:[], //components
    conds:0 //conditional components
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
    }
    else throw Error(SeMessage.XhttpErr)
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
 * Create an element from component
 * @param {string} [seComp] Loaded component location (without file extension)
 * @param {string|object} [seTarget] Target to insert this component in (optional, append to document.body by default)
 * @param {array|object} [seData] Data to be put in.
 * @returns {object} A component object.
 */
export function comp(seComp, seTarget, seData) {
    var _seComp, _seCompObj, _seCompParent
    if(typeof seComp === "string") _seComp = seComp
    else _seComp = ""
    _seCompObj = {
        comp: _seComp,
        element: document.createElement("div"),
        /**
         * Fetch data to component.
         * @param {object} seData
         */
        set: function(seData){
            compSet(seData, this)
        },
        /**
         * Set a component to be used, and fetch data to component
         * @param {string} seCompName Component name to be used
         * @param {object} seData Object or array of data
         */
        setComp: function(seCompName, seData){
            this.comp = seCompName
            compSet(seData, this)
        },
        /**
         * Set visibility of the component
         * @param {string} seVisibility Visibility
         */
        visibility: function(seVisibility){
            compVisibility(this, seVisibility)
        },
        /**
         * Set display mode for the component
         * @param {string} seCompDisplay Display mode
         */
        display: function(seCompDisplay){
            compDisplay(this,seCompDisplay)
        },
        /**
         * Clean a component (innerHTML)
         */
        clean: function(){
            compClean(this)
        }
    }
    if(typeof seTarget === "string") _seCompParent = document.getElementById(seTarget)//where to put in
    else if(typeof seTarget === "object") {
        if(typeof seTarget.tagName === "string") _seCompParent = seTarget
        else _seCompParent = document.body
    }
    else _seCompParent = document.body
    _seCompParent.appendChild( _seCompObj.element)
    if(seComp !== ""){//if comp is set
        if(typeof seData === "object") _seCompObj.set(seData)//if there is data in parameters
        else if(typeof seTarget === "object" && !_seIsElement(seTarget)) _seCompObj.set(seTarget)//if parmeter "target" is data
        else if(_seCompObj.element.innerHTML === "") _seCompObj.set([])//if inner is empty (not used before, prevent setArr not working)
    }return _seCompObj
}
/**
 * Fetch data to component.
 * @param {object} seData Object of data to be used.
 * @param {object} seComp Target component.
 */
export function compSet(seData, seComp){
    var seCompWaiter = setInterval(function(){ //wait for loaded components
        if(typeof SeObject.comps[seComp.comp] === "string"){
            seComp.element.innerHTML = _seCompParse(seData, SeObject.comps[seComp.comp])
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
    }
    return _seTextSplit.join("\n")
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
    _sRI++}
    return _seRemoved
}
function _seCompCompile(seCompStr, seCompName){ //compile component
    var _sI = 0
    var _seStack = 0
    var _seStage = 0
    var _seBucket = ""
    var _seStartBlock = -1 //save process time
    var _seCompStr = _seRemoveTab(seCompStr)
    while(_sI < _seCompStr.length){ //compile
        var _seTxt = _seCompStr[_sI]
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
                }else if(isNaN(_seTxt)) throw Error(SeMessage.compCompileErr0_0 + seCompName + SeMessage.compCompileErr0_1) //wrong syntax
                else{//ignore compiled
                    _seStage = 0
                    _sI--
                }break
            case 2: //find ( and ) until complete expression
                if(_seTxt === "(") _seStack++
                else if(_seTxt === ")"){ _seStack--
                    if(_seStack === 0){ //end stack
                        _seStage = 3
                    }
                }break
            case 3: //find {
                if(_seTxt === "{") _seStage = 4
                else throw Error(SeMessage.compCompileErr0_0 + seCompName + SeMessage.compCompileErr0_1) //wrong syntax
                break
            case 4: //find } or { when sub block
                if(_seTxt === "}") _seStage = 5 
                else if(_seTxt === "?" && _seCompStr[_sI+1] === "(") { //another sub block, reset
                    _seStage = 0
                    _sI--
                }break
            case 5: //find ? (end)
                if(_seTxt === "?"){
                    //process here
                    var _seProcessSign = _seCompCompile_process(_seBucket)
                    _seCompStr = _seCompStr.split(_seBucket).join(_seProcessSign) //replace
                    _sI = _seStartBlock //find again
                    _seStage = 0 
                }else if(_seTxt != " ") _seStage = 4 //get back
                break
        }   
    _sI++}
    return _seCompStr
}
function _seCompCompile_process(seCompStr){
    var _seComp = seCompStr.substring(seCompStr.indexOf("?(")+2,seCompStr.lastIndexOf("}?")).split("){") //split script
    var _seCompCompileResult = "?"+(SeObject.conds).toString()+"{"+_seComp[1]+"}"+(SeObject.conds).toString()+"?" //make a sign
    SeMessage.compCompiled += "case "+SeObject.conds.toString()+":return ("+_seRemoveSpace(_seComp[0]).split("$").join("data.")+");break;" //create a script
    SeObject.conds++ //shift order
    return _seCompCompileResult
}
function _seCompParse(seData, seCompStr){ //parse component
    if(SeMessage.compCompiled !== "" && SeMessage.compCompiled !== "!"){//if never deploy js engine before
        _seAdd("se-js",null,"function _SE_JSE_EVAL(scr,data){switch(scr){default: return null;"+SeMessage.compCompiled+"}}",document.body) //deploy
        SeMessage.compCompiled = "!" //clean
    }
    var _seResult = seCompStr
    var _seDataKey, _seArrKey
    var _seCompParseMode = 2
    var _seCondFound = true //conditional component
    var _seCond = 0
    while(_seCondFound){
        var _seCondStart = "?"+_seCond+"{"
        var _seCondStartIndex =  _seResult.indexOf(_seCondStart)
        if(_seCondStartIndex !== -1){//exists
            var _seCondEnd = "}"+_seCond+"?"
            var _seCondComp = _seResult.substring(_seCondStartIndex+_seCondStart.length, _seResult.indexOf(_seCondEnd))
            if(window._SE_JSE_EVAL(_seCond,seData)===true) {
                _seResult = _seResult.split(_seCondStart+_seCondComp+_seCondEnd).join(_seCondComp) //true
            }
            else {
                _seResult = _seResult.split(_seCondStart+_seCondComp+_seCondEnd).join("") //false
            }
        _seCond++}else _seCondFound = false
    }while(_seCompParseMode--){ //array component
        for(_seDataKey in seData) {
            var _seEmptyComp = "" //empty component
            var _seEmptyCompFront = "!"+_seDataKey+"{"
            var _seEmptyCompIndex = _seResult.indexOf(_seEmptyCompFront)
            if(_seEmptyCompIndex!==-1){
                var _seEmptyCompBack = "}"+_seDataKey+"!"
                _seEmptyComp = _seResult.substring(_seEmptyCompIndex+_seEmptyCompFront.length, _seResult.lastIndexOf(_seEmptyCompBack))//extract
                _seResult = _seResult.split(_seEmptyCompFront+_seEmptyComp+_seEmptyCompBack).join("")
            }if(_seCompParseMode === 1 && typeof seData[_seDataKey] === "object") { //array or obj
                var _seSubCompFront = "$"+_seDataKey+"{"
                var _seSubCompIndex = _seResult.indexOf(_seSubCompFront)
                if(_seSubCompIndex!==-1){
                    var _seSubCompData = "" //sub component
                    var _seSubCompBack = "}"+_seDataKey+"$"
                    var _seSubComp = _seResult.substring(_seSubCompIndex+_seSubCompFront.length, _seResult.lastIndexOf(_seSubCompBack))//extract
                    for(_seArrKey in seData[_seDataKey]){ //data in array
                        if(typeof seData[_seDataKey][_seArrKey] === "object") _seSubCompData += _seCompParse(seData[_seDataKey][_seArrKey], _seSubComp)//object
                        else _seSubCompData += _seSubComp.split("$[]").join(seData[_seDataKey][_seArrKey]) //non-object
                        _seSubCompData = _seSubCompData.split("$?").join(_seArrKey) //array number
                    }if(_seSubCompData === "") _seSubCompData = _seEmptyComp//if empty
                    _seResult = _seResult.split(_seSubCompFront+_seSubComp+_seSubCompBack).join(_seSubCompData)
                }
            }else if(_seCompParseMode === 0){ //others
                var _seKey = _seResult.split("$"+_seDataKey)
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
function _seInsert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
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
    }
    return _seXhr
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
    SeObject.css.id = "se-css"
    SeObject.js.id = "se-js"
    _seDocHead.appendChild(SeObject.css)
    _seDocHead.appendChild(SeObject.js)
    _seAdd("se-js",null,`
        function seCompEvaulate(seCompEvalId){
            var seCompEvalResult = null
            switch(seCompEvalId){
                /**SECOMPEVAL**/
            }
            return seCompEvalResult
        }
    `,document.body)
    invoke()
}_se()