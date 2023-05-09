let map = null; // Declare map variable outside the function

document.getElementById("showOnMapBtn").addEventListener("click", function(event) {
    event.preventDefault();
    showAddressOnMap();
});

function showAddressOnMap() {
    const addressInput = document.getElementById('address');
    const address = addressInput.value;

    const campusBounds = {
        north: 40.7639,
        south: 40.7342,
        east: -74.0016,
        west: -74.0349,
    };

    if (map !== null) {
        map.remove();
    }

    map = L.map('map').setView([40.7441, -74.0258], 13);
    const tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    });
    tile.addTo(map);

    const geocoder = L.Control.Geocoder.nominatim();

    L.control.locate({
        position: 'topright',
        icon: 'fas fa-location-arrow',
        iconElementTag: 'i'
    }).addTo(map);

    geocodeAddress(address);

    function geocodeAddress(address) {
        geocoder.geocode(address, (results) => {
            if (results.length > 0) {
                const { lat, lng } = results[0].center;

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
                    const newAddress = prompt('Enter a new address:', address);
                    if (newAddress !== null) {
                        if (newAddress.trim() !== '') {
                            geocodeAddress(newAddress);
                        } else {

                            geocodeAddress(address);
                        }
                        addressInput.value = newAddress; 
                    }
                }
            } else {
                alert('Address not found!');
            }
        });
    }

    return false;
}