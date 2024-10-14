
// Load Meals Details ID API
const loadMealDetailsId = async(category) => {
    // console.log(category);
    try{
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        const data = await res.json();
        loadMealDetailsCategories(data.meals[0].idMeal);
    }
    catch(error) {
        console.log(error);
    }
}

// Load Meal Details API
const loadMealDetailsCategories = async(id) => {
    console.log(id);
    try{
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json()
        displayMealDetails(data.meals[0]);
    }
    catch(error){
        console.log(error);
    }
}

const loadAllMealCategories = async(status, searchText = "") => {
    console.log(status, searchText);
    try{
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        const data = await res.json();

        // Filter the data based on searchText
        let filteredCategories = data.categories.filter(meal => 
            meal.strCategory.toLowerCase().includes(searchText.toLowerCase())
        );

        if(status){
            displayAllMealCategories(filteredCategories);
        }else{
            displayAllMealCategories(filteredCategories.slice(0, 6));
        }
    }
    catch(error){
        console.log("Something is wrong: ", error);
    }
}



// Display All Meal Categories
const displayAllMealCategories = (allMeals) => {
    // console.log(allMeals)
    
    const allMealContainer = document.getElementById('all-meals-container');
    allMealContainer.innerHTML = '';

    // যদি লেন্থ শুন্য হয়, তাহলে একটি ম্যাসেজ দিবে
    if(allMeals.length === 0){
        // alert('no content')
        // return;
        allMealContainer.classList.remove('grid');
        allMealContainer.innerHTML = `
            <h1 class="text-red-500 font-bold text-2xl text-center">Oops! Sorry, there are no dishes with this name. Please search for another meal.<h1>
        `;
    }else{
        allMealContainer.classList.add('grid');
    }

    
    allMeals.forEach((meal) => {
        console.log(meal);   
        const {strCategoryThumb, strCategory, strCategoryDescription, idCategory} = meal

        // First 50 letter showing
        const shortDescription = strCategoryDescription.length > 50 ? strCategoryDescription.slice(0, 200) + '...' : strCategoryDescription;
        // const fullDescription = strCategoryDescription;

        // 2nd way
        // const shortDescription = strCategoryDescription.length > 50 ? strCategoryDescription.substring(0, 200) + '...' : strCategoryDescription;

        const div = document.createElement('div');
        div.innerHTML = `
            <div class="flex flex-col h-full lg:flex-row border rounded-lg p-4 md:p-3 items-center ">
                <div class="images rounded-lg lg:w-1/3 flex  md:h-[150px] lg:h-4/6 xl:h-5/6">
                    <img class="rounded-lg" src=${strCategoryThumb}>
                </div>
                <div class="lg:ml-4 mt-7 lg:mt-0 lg:w-2/3">
                    <h2 class="font-bold text-2xl text-[#010d78] mb-4">${strCategory}</h2>
                    <p class="description mb-4">${shortDescription}</p>


                    <button onclick='loadMealDetailsId("${strCategory}")' class=" btn bg-yellow-400 hover:bg-[#010d78] hover:text-white text-black">View Details </button>
                </div>
            </div>
        `;
        allMealContainer.append(div);
    }) 
}


const displayMealDetails = (details) => {
    console.log(details);
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = "";
 
    const {strMeal, strMealThumb, strCategory, strArea, strInstructions, strYoutube} = details;

    const div = document.createElement('div');
    div.innerHTML = `
        <dialog id="detailsModal" class="modal">
            <div class="modal-box overflow-visible  p-0">
                <form method="dialog">
                    <button class="btn bg-white shadow-lg hover:bg-gray-200  transition duration-200 text-xl md:text-2xl z-10 overflow-visible btn-sm btn-circle btn-ghost absolute -right-3 -top-4 w-10 h-10 md:w-12 md:h-12">✕</button>
                </form>
                <div class="modal-box overflow-y-scroll w-full h-full">
                    <h3 class="text-lg font-bold">${!strMeal ? "Not Found" : strMeal}</h3>
                    <img class="w-full h-[300px] py-4" src=${!strMealThumb ? "Not Found" : strMealThumb} alt="Meal...">
                    <p class="text-black font-medium">Category: <span class="text-gray-500 font-normal text-sm">${!strCategory ? "Not Found" : strCategory}</span></p>
                    <p class="text-black font-medium py-1">Area: <span class="text-gray-500 font-normal text-sm">${!strArea ? "Not Found" : strArea}</span></p>
                    <p class="text-black font-medium">Instructions: <span class="text-gray-500 font-normal text-sm">${!strInstructions ? "Not Found" : strInstructions}</span></p>
                    <p class="text-black font-medium pt-2">Youtube: <span class="text-green-500 font-normal text-sm"><a href='${strYoutube}'>${!strYoutube ? 'Not Found' : strYoutube}</a></span></p>
                </div>
            </div>
        </dialog>
    `;
    modalContainer.appendChild(div);

    document.getElementById('detailsModal').showModal();
    

}

loadAllMealCategories();


// View More Button Handle
const handleViewMoreBtn = () => {
    loadAllMealCategories(true);
}

// Search Button Functionality
const handleSearchBtn = () => {
    // console.log('search btn');
    const searchValue = document.getElementById('search-box').value;
    loadAllMealCategories(false, searchValue);
}