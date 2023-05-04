let map = null; // Declare map variable outside the function

document.getElementById("showOnMapBtn").addEventListener("click", function(event) {
    event.preventDefault();
    showAddressOnMap();
});

function showAddressOnMap() {
    const addressInput = document.getElementById('address');
    const address = addressInput.value;

    // Define the bounds of the Stevens Institute of Technology main campus
    const campusBounds = {
        north: 40.7639,
        south: 40.7342,
        east: -74.0016,
        west: -74.0349,
    };

    // If map is already initialized, remove it from the DOM
    if (map !== null) {
        map.remove();
    }

    // Create a new map instance
    map = L.map('map').setView([40.7441, -74.0258], 13);

    // Add a tile layer to the map (you can choose a different tile provider)
    const tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    });
    tile.addTo(map);

    const geocoder = L.Control.Geocoder.nominatim();

    // Add a current position icon to the map
    L.control.locate({
        position: 'topright',
        icon: 'fas fa-location-arrow',
        iconElementTag: 'i'
    }).addTo(map);

    // Geocode the address to get latitude and longitude
    geocodeAddress(address);

    function geocodeAddress(address) {
        geocoder.geocode(address, (results) => {
            if (results.length > 0) {
                const { lat, lng } = results[0].center;

                // Compare latitude and longitude with campus bounds
                if (
                    lat >= campusBounds.south &&
                    lat <= campusBounds.north &&
                    lng >= campusBounds.west &&
                    lng <= campusBounds.east
                ) {
                    L.marker([lat, lng])
                        .addTo(map)
                        .bindPopup(`${address}<br>Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}`)
                        .openPopup();
                    map.setView([lat, lng], 13);
                } else {
                    alert('Address is not within the Stevens Institute of Technology main campus!');
                    // Prompt user to input a new address
                    const newAddress = prompt('Enter a new address:', address);
                    if (newAddress !== null) {
                        if (newAddress.trim() !== '') {
                            // Recursively geocode the new address
                            geocodeAddress(newAddress);
                        } else {
                            // If the new address is empty, use the previous address
                            geocodeAddress(address);
                        }
                        addressInput.value = newAddress; // Update the input field with the new address
                    }
                }
            } else {
                alert('Address not found!');
            }
        });
    }

    return false;
}

function commentPopup(postId){
    let popup = document.getElementById("comments-popup-" + postId);
    popup.classList.toggle("show");
}
