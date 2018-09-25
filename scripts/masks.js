$(document).ready(function(){
    $("#inputCode").inputmask("AA",{ "clearIncomplete": true , showMaskOnHover: false,
    showMaskOnFocus: false,});
    $("#inputDays").inputmask("9999",{ "clearIncomplete": false , showMaskOnHover: false,
    showMaskOnFocus: false,});
    $("#inputDate").inputmask("99/99/2099",{ "clearIncomplete": true , showMaskOnHover: true,
    showMaskOnFocus: true,"placeholder": "mm/dd/yyyy" });
    
});