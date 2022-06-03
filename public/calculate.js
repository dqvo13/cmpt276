/* VARIABLES */
// retrieves grade bounds
let max_bound, aPlus_bound, a_bound, aMinus_bound;
let bPlus_bound, b_bound, bMinus_bound;
let cPlus_bound, c_bound, cMinus_bound;
let d_bound, f_bound;

// histogram counters (also adjusts div widths)
let aPlus_count = 0, a_count = 0, aMinus_count = 0;
let bPlus_count = 0, b_count = 0, bMinus_count = 0;
let cPlus_count = 0, c_count = 0, cMinus_count = 0;
let d_count = 0, f_count = 0;

// arbitrary width to represent grade on histogram
let widthMulti = 30;        // px

// initial numerical values of grades
let grades = [65.95, 56.98, 78.62, 96.1, 90.3, 72.24, 92.34, 60.00, 81.43, 86.22, 88.33, 9.03,
    49.93, 52.34, 53.11, 50.10, 88.88, 55.32, 55.69, 61.68, 70.44, 70.54, 90.0, 71.11, 80.01];

// initializing grade bounds
max_bound = document.getElementById("maxBound").value;
aPlus_bound = document.getElementById("aPlusBound").value;
a_bound = document.getElementById("aBound").value;
aMinus_bound = document.getElementById("aMinusBound").value;
bPlus_bound = document.getElementById("bPlusBound").value;
b_bound = document.getElementById("bBound").value;
bMinus_bound = document.getElementById("bMinusBound").value;
cPlus_bound = document.getElementById("cPlusBound").value;
c_bound = document.getElementById("cBound").value;
cMinus_bound = document.getElementById("cMinusBound").value;
d_bound = document.getElementById("dBound").value;
f_bound = document.getElementById("fBound").value;
// DisplayBounds();

// initializing histogram
/*
    - set all grade counters to 0
    - iterate thru array of grades
    - check each grade and find which range it belongs in
        - assume grade ranges are valid (initialized on HTML page)
        - assume grades in array are valid (checked upon appending)
        - if it belongs in a certain range, increment respective grade counter
        - multiply respective div width by grade count * arbitrary width
*/
function RefreshHist() {
    ResetGradeCounters();       // sets all grade counters to 0
    for (let i = 0; i < grades.length; i++) {
        UpdateGradeCount(grades[i], 1);
    }

    // adjust all div widths based on grade counters
    UpdateDivWidth(widthMulti, "f");
    UpdateDivWidth(widthMulti, "d");
    UpdateDivWidth(widthMulti, "c-");
    UpdateDivWidth(widthMulti, "c");
    UpdateDivWidth(widthMulti, "c+");
    UpdateDivWidth(widthMulti, "b-");
    UpdateDivWidth(widthMulti, "b");
    UpdateDivWidth(widthMulti, "b+");
    UpdateDivWidth(widthMulti, "a-");
    UpdateDivWidth(widthMulti, "a");
    UpdateDivWidth(widthMulti, "a+");
}

/*****************************************************************************/
                    /*** IMPORTANT USER FUNCTIONS ***/
/*****************************************************************************/

// adding new grade
/*
    - occurs when user hits Enter in new grade text field (histogram.html)
    - check 0-100
        - input in histogram.html has min="0" max="100"
    - check that it's a number
        - input in histogram.html is type="number"
        - exception, allows "e", scientific notation
            - on its own, "e" is treated as 0
    - check for grade range, increment grade count, adjust div width
*/
document.getElementById("gradeInput").addEventListener("keypress", function(Event){ AddGrade(Event); }, false);
function AddGrade(Event) {
    let x = Event.key;
    let msg, new_grade;
    if (x === "Enter") {
        new_grade = document.getElementById("gradeInput").value;
        new_grade = Number(new_grade);

        // invalid case
        if (new_grade < f_bound || new_grade > max_bound || new_grade === NaN || typeof new_grade != "number") {
            msg = "Invalid grade. Enter numerical grade from " + f_bound + "-" + max_bound + ".";
            NewGradeError(msg);
        }
        // valid case
        else {
            NewGradeNormal();
            PushGrade(new_grade);
        }
    }
}

// adjusting grade bounds
/*
    - check each bound to make sure they're valid
        - check for 0-100
        - check for bound overlap (e.g. f should not be higher than d)
    - re-initialize histogram once change is made, i.e. RefreshHist()
*/
document.getElementById("fBound").addEventListener("change", function(){ UpdateBounds("f") });
document.getElementById("dBound").addEventListener("change", function(){ UpdateBounds("d") });
document.getElementById("cMinusBound").addEventListener("change", function(){ UpdateBounds("c-") });
document.getElementById("cBound").addEventListener("change", function(){ UpdateBounds("c") });
document.getElementById("cPlusBound").addEventListener("change", function(){ UpdateBounds("c+") });
document.getElementById("bMinusBound").addEventListener("change", function(){ UpdateBounds("b-") });
document.getElementById("bBound").addEventListener("change", function(){ UpdateBounds("b") });
document.getElementById("bPlusBound").addEventListener("change", function(){ UpdateBounds("b+") });
document.getElementById("aMinusBound").addEventListener("change", function(){ UpdateBounds("a-") });
document.getElementById("aBound").addEventListener("change", function(){ UpdateBounds("a") });
document.getElementById("aPlusBound").addEventListener("change", function(){ UpdateBounds("a+") });
document.getElementById("maxBound").addEventListener("change", function(){ UpdateBounds("m") });

function UpdateBounds(letterGrade) {
    curr_bound = GetBoundInput(letterGrade);
    curr_bound = Number(curr_bound);
    let msg;
    if (letterGrade == "f") {
        if (curr_bound < 0 || curr_bound >= d_bound) {
            msg = "Invalid F lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else {
            f_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "d") {
        if (curr_bound <= f_bound || curr_bound >= cMinus_bound) {
            msg = "Invalid D lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            d_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "c-") {
        if (curr_bound <= d_bound || curr_bound >= c_bound) {
            msg = "Invalid C- lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            cMinus_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "c") {
        if (curr_bound <= cMinus_bound || curr_bound >= cPlus_bound) {
            msg = "Invalid C lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            c_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "c+") {
        if (curr_bound <= c_bound || curr_bound >= bMinus_bound) {
            msg = "Invalid C+ lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            cPlus_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "b-") {
        if (curr_bound <= cPlus_bound || curr_bound >= b_bound) {
            msg = "Invalid B- lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            bMinus_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "b") {
        if (curr_bound <= bMinus_bound || curr_bound >= bPlus_bound) {
            msg = "Invalid B lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            b_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "b+") {
        if (curr_bound <= b_bound || curr_bound >= aMinus_bound) {
            msg = "Invalid B+ lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            bPlus_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "a-") {
        if (curr_bound <= bPlus_bound || curr_bound >= a_bound) {
            msg = "Invalid A- lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            aMinus_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "a") {
        if (curr_bound <= aMinus_bound || curr_bound >= aPlus_bound) {
            msg = "Invalid A lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            a_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "a+") {
        if (curr_bound <= a_bound || curr_bound >= max_bound) {
            msg = "Invalid A+ lower bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            aPlus_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
    else if (letterGrade == "m") {
        if (curr_bound <= aPlus_bound || curr_bound > 100) {
            msg = "Invalid max bound. Ensure bounds are within 0-100 and do not overlap.";
            GradeBoundError(letterGrade, msg);
        }
        else { 
            max_bound = curr_bound;
            GradeBoundNormal(letterGrade);
            RefreshHist();
        }
    }
}

/*****************************************************************************/
        /*** OTHER FUNCTIONS USED BY MORE IMPORTANT FUNCTIONS ***/
/*****************************************************************************/

// display grade counts in console
function DisplayCounts() {
    console.log("grade counts:");
    console.log(aPlus_count, a_count, aMinus_count);
    console.log(bPlus_count, b_count, bMinus_count);
    console.log(cPlus_count, c_count, cMinus_count);
    console.log(d_count, f_count);
    console.log("END grade counts");
}

// display grade bounds in console
function DisplayBounds() {
    console.log("grade lower bounds:");
    console.log(max_bound, aPlus_bound, a_bound, aMinus_bound);
    console.log(bPlus_bound, b_bound, bMinus_bound);
    console.log(cPlus_bound, c_bound, cMinus_bound);
    console.log(d_bound, f_bound);
    console.log("END grade lower bounds");
}

// reset grades[] (for testing purposes)
function ResetGrades() {
    grades = [65.95, 56.98, 78.62, 96.1, 90.3, 72.24, 92.34, 60.00, 81.43, 86.22, 88.33, 9.03,
        49.93, 52.34, 53.11, 50.10, 88.88, 55.32, 55.69, 61.68, 70.44, 70.54, 90.0, 71.11, 80.01];
    RefreshHist();
}

// reset grade counters (e.g. in RefreshHist())
function ResetGradeCounters() {
    aPlus_count = 0, a_count = 0, aMinus_count = 0;
    bPlus_count = 0, b_count = 0, bMinus_count = 0;
    cPlus_count = 0, c_count = 0, cMinus_count = 0;
    d_count = 0, f_count = 0;
}

// increase/decrease appropriate grade counter based on grade range
// returns string indicating which grade was updated, if necessary
function UpdateGradeCount(grade, adjust) {
    if (grade >= f_bound && grade < d_bound) { 
        f_count += adjust; 
        return "f";
    }
    else if (grade >= d_bound && grade < cMinus_bound) { 
        d_count += adjust; 
        return "d";
    }
    else if (grade >= cMinus_bound && grade < c_bound) { 
        cMinus_count += adjust; 
        return "c-";
    }
    else if (grade >= c_bound && grade < cPlus_bound) { 
        c_count += adjust; 
        return "c";
    }
    else if (grade >= cPlus_bound && grade < bMinus_bound) { 
        cPlus_count += adjust; 
        return "c+";
    }
    else if (grade >= bMinus_bound && grade < b_bound) { 
        bMinus_count += adjust;
        return "b-";
    }
    else if (grade >= b_bound && grade < bPlus_bound) { 
        b_count += adjust;
        return "b";
    }
    else if (grade >= bPlus_bound && grade < aMinus_bound) { 
        bPlus_count += adjust; 
        return "b+";
    }
    else if (grade >= aMinus_bound && grade < a_bound) { 
        aMinus_count += adjust;
        return "a-";
    }
    else if (grade >= a_bound && grade < aPlus_bound) { 
        a_count += adjust; 
        return "a";
    }
    else if (grade >= aPlus_bound && grade <= max_bound) { 
        aPlus_count += adjust;
        return "a+";
    }
}

// adjusts width of div bar in histogram, updates respective label
function UpdateDivWidth(widthMulti, letterGrade) {
    if (letterGrade == "f") {
        document.getElementById("fCount").style.width = (widthMulti * f_count) + "px";
        document.getElementById("fLabel").innerHTML = f_count;
    }
    else if (letterGrade == "d") {
        document.getElementById("dCount").style.width = (widthMulti * d_count) + "px";
        document.getElementById("dLabel").innerHTML = d_count;
    }
    else if (letterGrade == "c-") {
        document.getElementById("cMinusCount").style.width = (widthMulti * cMinus_count) + "px";
        document.getElementById("cMinusLabel").innerHTML = cMinus_count;
    }
    else if (letterGrade == "c") {
        document.getElementById("cCount").style.width = (widthMulti * c_count) + "px";
        document.getElementById("cLabel").innerHTML = c_count;
    }
    else if (letterGrade == "c+") {
        document.getElementById("cPlusCount").style.width = (widthMulti * cPlus_count) + "px";
        document.getElementById("cPlusLabel").innerHTML = cPlus_count;
    }
    else if (letterGrade == "b-") {
        document.getElementById("bMinusCount").style.width = (widthMulti * bMinus_count) + "px";
        document.getElementById("bMinusLabel").innerHTML = bMinus_count;
    }
    else if (letterGrade == "b") {
        document.getElementById("bCount").style.width = (widthMulti * b_count) + "px";
        document.getElementById("bLabel").innerHTML = b_count;
    }
    else if (letterGrade == "b+") {
        document.getElementById("bPlusCount").style.width = (widthMulti * bPlus_count) + "px";
        document.getElementById("bPlusLabel").innerHTML = bPlus_count;
    }
    else if (letterGrade == "a-") {
        document.getElementById("aMinusCount").style.width = (widthMulti * aMinus_count) + "px";
        document.getElementById("aMinusLabel").innerHTML = aMinus_count;
    }
    else if (letterGrade == "a") {
        document.getElementById("aCount").style.width = (widthMulti * a_count) + "px";
        document.getElementById("aLabel").innerHTML = a_count;
    }
    else if (letterGrade == "a+") {
        document.getElementById("aPlusCount").style.width = (widthMulti * aPlus_count) + "px";
        document.getElementById("aPlusLabel").innerHTML = aPlus_count;
    }
}

// push new grade into grades[], checking for validity
// returns letter grade, if necessary
function PushGrade(newGrade) {
    grades.push(newGrade);
    let letter = UpdateGradeCount(newGrade, 1);    // updates counter, returns letter grade as string
    UpdateDivWidth(widthMulti, letter);

    return letter;
}

// pop latest grade from grades[], update counter + histogram accordingly
function PopGrade() {
    let curr_grade = grades.pop();
    let letter = UpdateGradeCount(curr_grade, -1);
    UpdateDivWidth(widthMulti, letter);
}

// revert text field to look normal upon valid entry
function NewGradeNormal() {
    // revert text field
    document.getElementById("gradeInput").style.borderWidth = "0";
    document.getElementById("gradeInput").value = '';

    // remove error message
    document.getElementById("newGradeErrorMsg").innerHTML = "";
    document.getElementById("newGradeErrorMsg").style.visibility = "hidden";
}

// change look of text field when user enters invalid grade
function NewGradeError(msg) {
    // change the look of the text field
    document.getElementById("gradeInput").style.borderWidth = "3px";
    document.getElementById("gradeInput").style.borderStyle = "solid";
    document.getElementById("gradeInput").style.borderColor = "#CC0633";

    // display error message below
    document.getElementById("newGradeErrorMsg").innerHTML = msg;
    document.getElementById("newGradeErrorMsg").style.visibility = "visible";
}

function GetBoundInput(letter) {
    if (letter == "f") { return document.getElementById("fBound").value; }
    else if (letter == "d") { return document.getElementById("dBound").value; }
    else if (letter == "c-") { return document.getElementById("cMinusBound").value; }
    else if (letter == "c") { return document.getElementById("cBound").value; }
    else if (letter == "c+") { return document.getElementById("cPlusBound").value; }
    else if (letter == "b-") { return document.getElementById("bMinusBound").value; }
    else if (letter == "b") { return document.getElementById("bBound").value; }
    else if (letter == "b+") { return document.getElementById("bPlusBound").value; }
    else if (letter == "a-") { return document.getElementById("aMinusBound").value; }
    else if (letter == "a") { return document.getElementById("aBound").value; }
    else if (letter == "a+") { return document.getElementById("aPlusBound").value; }
    else if (letter == "m") { return document.getElementById("maxBound").value; }
}

function GradeBoundNormal(letter) {
    // revert the look of the appropriate text field
    if (letter == "f") { document.getElementById("fBound").style.borderWidth = "0"; }
    else if (letter == "d") { document.getElementById("dBound").style.borderWidth = "0"; }
    else if (letter == "c-") { document.getElementById("cMinusBound").style.borderWidth = "0"; }
    else if (letter == "c") { document.getElementById("cBound").style.borderWidth = "0"; }
    else if (letter == "c+") { document.getElementById("cPlusBound").style.borderWidth = "0"; }
    else if (letter == "b-") { document.getElementById("bMinusBound").style.borderWidth = "0"; }
    else if (letter == "b") { document.getElementById("bBound").style.borderWidth = "0"; }
    else if (letter == "b+") { document.getElementById("bPlusBound").style.borderWidth = "0"; }
    else if (letter == "a-") { document.getElementById("aMinusBound").style.borderWidth = "0"; }
    else if (letter == "a") { document.getElementById("aBound").style.borderWidth = "0"; }
    else if (letter == "a+") { document.getElementById("aPlusBound").style.borderWidth = "0"; }
    else if (letter == "m") { document.getElementById("maxBound").style.borderWidth = "0"; }

    // remove error message
    document.getElementById("newBoundErrorMsg").innerHTML = "";
    document.getElementById("newBoundErrorMsg").style.visibility = "hidden";
}

function GradeBoundError(letter, msg) {
    // change the look of the appropriate text field
    if (letter == "f") {
        document.getElementById("fBound").style.borderWidth = "3px";
        document.getElementById("fBound").style.borderStyle = "solid";
        document.getElementById("fBound").style.borderColor = "#CC0633";
    }
    else if (letter == "d") {
        document.getElementById("dBound").style.borderWidth = "3px";
        document.getElementById("dBound").style.borderStyle = "solid";
        document.getElementById("dBound").style.borderColor = "#CC0633";
    }
    else if (letter == "c-") {
        document.getElementById("cMinusBound").style.borderWidth = "3px";
        document.getElementById("cMinusBound").style.borderStyle = "solid";
        document.getElementById("cMinusBound").style.borderColor = "#CC0633";
    }
    else if (letter == "c") {
        document.getElementById("cBound").style.borderWidth = "3px";
        document.getElementById("cBound").style.borderStyle = "solid";
        document.getElementById("cBound").style.borderColor = "#CC0633";
    }
    else if (letter == "c+") {
        document.getElementById("cPlusBound").style.borderWidth = "3px";
        document.getElementById("cPlusBound").style.borderStyle = "solid";
        document.getElementById("cPlusBound").style.borderColor = "#CC0633";
    }
    else if (letter == "b-") {
        document.getElementById("bMinusBound").style.borderWidth = "3px";
        document.getElementById("bMinusBound").style.borderStyle = "solid";
        document.getElementById("bMinusBound").style.borderColor = "#CC0633";
    }
    else if (letter == "b") {
        document.getElementById("bBound").style.borderWidth = "3px";
        document.getElementById("bBound").style.borderStyle = "solid";
        document.getElementById("bBound").style.borderColor = "#CC0633";
    }
    else if (letter == "b+") {
        document.getElementById("bPlusBound").style.borderWidth = "3px";
        document.getElementById("bPlusBound").style.borderStyle = "solid";
        document.getElementById("bPlusBound").style.borderColor = "#CC0633";
    }
    else if (letter == "a-") {
        document.getElementById("aMinusBound").style.borderWidth = "3px";
        document.getElementById("aMinusBound").style.borderStyle = "solid";
        document.getElementById("aMinusBound").style.borderColor = "#CC0633";
    }
    else if (letter == "a") {
        document.getElementById("aBound").style.borderWidth = "3px";
        document.getElementById("aBound").style.borderStyle = "solid";
        document.getElementById("aBound").style.borderColor = "#CC0633";
    }
    else if (letter == "a+") {
        document.getElementById("aPlusBound").style.borderWidth = "3px";
        document.getElementById("aPlusBound").style.borderStyle = "solid";
        document.getElementById("aPlusBound").style.borderColor = "#CC0633";
    }
    else if (letter == "m") {
        document.getElementById("maxBound").style.borderWidth = "3px";
        document.getElementById("maxBound").style.borderStyle = "solid";
        document.getElementById("maxBound").style.borderColor = "#CC0633";
    }

    // display error message below
    document.getElementById("newBoundErrorMsg").innerHTML = msg;
    document.getElementById("newBoundErrorMsg").style.visibility = "visible";
}