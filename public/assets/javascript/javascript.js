$( document ).ready(function() {
  $("#addclientname").on('click', function(){
    alert('Please remember that you have to enter client name equal to what the username you gave them')
  });
});
// var AdmZip = require('adm-zip');
//
// // reading archives
// var zip = new AdmZip("./my_file.zip");
// var zipEntries = zip.getEntries(); // an array of ZipEntry records
//
// zipEntries.forEach(function(zipEntry) {
//     console.log(zipEntry.toString()); // outputs zip entries information
//     if (zipEntry.entryName == "my_file.txt") {
//          console.log(zipEntry.data.toString('utf8'));
//     }
// });
// // outputs the content of some_folder/my_file.txt
// console.log(zip.readAsText("some_folder/my_file.txt"));
// // extracts the specified file to the specified location
// zip.extractEntryTo(/*entry name*/"some_folder/my_file.txt", /*target path*/"/home/me/tempfolder", /*maintainEntryPath*/false, /*overwrite*/true);
// // extracts everything
// zip.extractAllTo(/*target path*/"/home/me/zipcontent/", /*overwrite*/true);
