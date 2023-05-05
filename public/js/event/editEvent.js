const allowedLocation = [
    "edwin a. stevens hall", "carnegie laboratory", "lieb building", "burchard building",
    "mclean hall", "babbio center", "morton-pierce-kidde complex", "rocco technology center", "nicholl environmental laboratory",
    "davidson laboratory", "gatehouse", "griffith building and building technology tower", "walker gymnasium",
    "schaefer athletic and recreation center", "samuel c. williams library and computer center", "jacobus student center",
    "alexander house", "colonial house"
];

const selectElement = document.getElementById("buildingName");

allowedLocation.forEach((location) => {
    const option = document.createElement("option");
    option.text = location;
    option.value = location;
    selectElement.appendChild(option);
});