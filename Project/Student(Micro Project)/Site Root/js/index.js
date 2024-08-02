var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var studentDBName = "STUDENT-DB";
var studentRelationName = "StudentData";
var connToken = "90932149|-31949221250406279|90963803";

$("#rollno").focus();

function saveRecNo2LS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
  var rollno = $("#rollno").val();
  var jsonStr = {
    id: rollno
  };
  return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
  saveRecNo2LS(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#fullname").val(record.name);
  $("#class").val(record.class);
  $("#birthdate").val(record.birthdate);
  $("#address").val(record.address);
  $("#enrollmentdate").val(record.enrollmentdate);
}

function resetForm() {
  $("#rollno").val("");
  $("#fullname").val("");
  $("#class").val("");
  $("#birthdate").val("");
  $("#address").val("");
  $("#enrollmentdate").val("");
  $("#rollno").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#rollno").focus();
}

function validateData() {
  var rollno, fullname, classValue, birthdate, address, enrollmentdate;
  rollno = $("#rollno").val();
  fullname = $("#fullname").val();
  classValue = $("#class").val();
  birthdate = $("#birthdate").val();
  address = $("#address").val();
  enrollmentdate = $("#enrollmentdate").val();

  if (rollno === "") {
    alert("Roll No missing");
    $("#rollno").focus();
    return "";
  }
  if (fullname === "") {
    alert("Full Name missing");
    $("#fullname").focus();
    return "";
  }
  if (classValue === "") {
    alert("Class missing");
    $("#class").focus();
    return "";
  }
  if (birthdate === "") {
    alert("Birth Date missing");
    $("#birthdate").focus();
    return "";
  }
  if (address === "") {
    alert("Address missing");
    $("#address").focus();
    return "";
  }
  if (enrollmentdate === "") {
    alert("Enrollment Date missing");
    $("#enrollmentdate").focus();
    return "";
  }
  var jsonStrObj = {
    id: rollno,
    name: fullname,
    class: classValue,
    birthdate: birthdate,
    address: address,
    enrollmentdate: enrollmentdate
  };
  return JSON.stringify(jsonStrObj);
}

function getStudent() {
  var rollNoJsonObj = getRollNoAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(
    connToken,
    studentDBName,
    studentRelationName,
    rollNoJsonObj
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });
  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#fullname").focus();
  } else if (resJsonObj.status === 200) {
    $("#rollno").prop("disabled", true);
    fillData(resJsonObj);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#fullname").focus();
  }
}

function saveData() {
  var jsonStrObj = validateData();
  if (jsonStrObj === "") {
    return "";
  }
  var putRequest = createPUTRequest(
    connToken,
    jsonStrObj,
    studentDBName,
    studentRelationName
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    putRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  resetForm();
  $("#rollno").focus();
}

function changeData() {
  $("#change").prop("disabled", true);
  var jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(
    connToken,
    jsonChg,
    studentDBName,
    studentRelationName,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  console.log(resJsonObj);
  resetForm();
  $("#rollno").focus();
}
