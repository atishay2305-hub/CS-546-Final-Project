let sortingCriteria = [];

document.getElementById('sort-criteria').addEventListener('change', function(event) {
    event.preventDefault();
    sortEvents();
});
function sortEvents(criteria) {
    let eventsContainer = document.getElementById('events-container');
    let events = Array.from(eventsContainer.getElementsByClassName('event-container'));

    
    let index = sortingCriteria.indexOf(criteria);
    if (index > -1) {
        sortingCriteria.splice(index, 1);
    }
    sortingCriteria.unshift(criteria);

   
    events.sort((a, b) => {
        for (let i = 0; i < sortingCriteria.length; i++) {
            let currentCriterion = sortingCriteria[i];
            switch (currentCriterion) {
                case 'a-z':
                    let contentA = a.querySelector('h2').innerText.toUpperCase();
                    let contentB = b.querySelector('h2').innerText.toUpperCase();
                    let contentComparison = contentA.localeCompare(contentB);
                    if (contentComparison !== 0) {
                        return contentComparison;
                    }
                    break;

                case 'created_date_asc':
                    let dateAElementAsc = a.querySelector('p.date'); 
                    let dateBElementAsc = b.querySelector('p.date');
                    if (!dateAElementAsc || !dateBElementAsc) {
                     
                        return 0;
                    }
                    let dateAAsc = new Date(dateAElementAsc.getAttribute('data-date'));
                    let dateBAsc = new Date(dateBElementAsc.getAttribute('data-date'));
                    let dateComparisonAsc = dateAAsc - dateBAsc; 
                    if (dateComparisonAsc !== 0) {
                        return dateComparisonAsc;
                    }
                    break;

                case 'created_date_desc':
                    let dateAElementDesc = a.querySelector('p.date'); 
                    let dateBElementDesc = b.querySelector('p.date');
                    if (!dateAElementDesc || !dateBElementDesc) {
                     
                        return 0;
                    }
                    let dateADesc = new Date(dateAElementDesc.getAttribute('data-date'));
                    let dateBDesc = new Date(dateBElementDesc.getAttribute('data-date'));
                    let dateComparisonDesc = dateBDesc - dateADesc; 
                    if (dateComparisonDesc !== 0) {
                        return dateComparisonDesc;
                    }
                    break;
            }
        }
       
        return a.getAttribute('data-order') - b.getAttribute('data-order');
    });

    eventsContainer.innerHTML = '';
    events.forEach((post) => {
        eventsContainer.appendChild(post);
    });
}