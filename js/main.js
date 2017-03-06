function JSUtil() {
    var isInverted = false;

    function invert(state) {
        var invertStr;
        if (state) {
            invertStr = "100%";
        }
        else {
            invertStr = "0%";
        }
        document.getElementById("monitor").style.filter = "invert(" + invertStr + ")";
        //Firefox fix (button needs individual filter)
        document.getElementById("invertButton").style.filter = "invert(" + invertStr + ")";
    }

    this.toggleInvert = function () {
        isInverted = !isInverted;
        invert(isInverted);
    }
}
var util = new JSUtil();