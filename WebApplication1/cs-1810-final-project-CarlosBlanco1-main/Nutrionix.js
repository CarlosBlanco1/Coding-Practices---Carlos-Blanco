// REQUIREMENT 8: Here I use the 2 event listners. One to retrive information after the forms have been submitted and other after 
//the page content has loaded. Event listeners are used to make a website interactive and responsive to user actions like mouse clicks 
//or keyboard input by triggering certain functions in response to these actions.


document.addEventListener('DOMContentLoaded', () => {

    let Recipes;
// REQUIREMENT 10: Here I extract information from a JSON file I have in this same directory. It's great becuase I can load
// the content of the JSON file on the background while the user is filling out the form information, and when it is submitted, the 
//information is ready. Ajax is useful because it enables web pages to update content dynamically without requiring a full page reload,
//resulting in a more seamless user experience.


    fetch("Recipes.JSON")
        .then(response => response.json())
        .then(data => {
            Recipes = data;

            selectValidRecipes(Recipes);
        }
        )
        .catch(error => console.error(error));
});

// REQUIREMENT 11: Here the class really helped me to encapsulate and later on acess the information from each of the recipes.
// In this case, I used it to store the nutritional content of each recipe and later on compare it with the user requirements.
// JavaScript classes are useful because they allow you to create reusable code blueprints for creating objects with shared properties
// and methods.

class RecipeNutrients {
    constructor(calories, protein, vegetarian, micronutrients, numIngredients) {
        this.calories = calories;
        this.protein = protein;
        this.vegetarian = vegetarian;
        this.micronutrients = micronutrients;
        this.numIngredients = numIngredients;
    }
}

// REQUIREMENT 9: Here I used the query selectors in order to slect elements and make changes to them such as their internal HTML.
// In the same way, to add event listeners and make the site much more responsive. They are useful because they simplify the process 
// of finding and working with specific elements on a webpage, which saves time and makes coding more efficient.

function selectValidRecipes(recipes) {
    let button = document.querySelector('#bttn');

    button.addEventListener('click', () => {
        let validRecipes = [];
        let parentForm = document.querySelector('.parent-form');
        let formData = new FormData(parentForm);

        const minCalories = parseInt(formData.get('minCalories'));
        const maxCalories = parseInt(formData.get('maxCalories'));
        const protein = formData.get('protein');
        const vegetarian = formData.get('vegetarian');
        const micronutrients = formData.get('micronutrients');
        const numIngredients = parseInt(formData.get('numberIngredients'));

        validRecipes = recipes.filter(recipe => {

            let currentRecipe = new RecipeNutrients(recipe.nutrients.calories, recipe.nutrients.protein, recipe.nutrients.vegetarian, recipe.nutrients.micronutrient, recipe.ingredients.length);

            if (vegetarian != "default") {
                return currentRecipe.vegetarian == vegetarian;
            }
            if (micronutrients != "default") {
                return currentRecipe.micronutrients == micronutrients;
            }
            if (!isNaN(numIngredients)) {
                return currentRecipe.numIngredients <= numIngredients;
            }
            return currentRecipe.calories <= maxCalories && currentRecipe.calories >= minCalories
                && currentRecipe.protein >= protein;

        });

        GenerateRecipeCards(validRecipes);
    });
}


function GenerateRecipeCards(Recipes) {
    let container = document.getElementById('cardcontainer');
    container.innerHTML = "";

    for (let i = 0; i < Recipes.length; i++) {
        let divContain = document.createElement('div');

        let h1 = document.createElement('h1');
        let P = document.createElement('p');
        let img = document.createElement("img");
        let button = document.createElement("button");

        img.setAttribute("src", `recipeImages/${Recipes[i].imageName}`);
        img.classList.add('recipeImg')
        img.setAttribute("alt", Recipes[i].dishname);

        let text = document.createTextNode(Recipes[i].description);
        P.appendChild(text);

        let title = document.createTextNode(Recipes[i].dishname)
        h1.appendChild(title);
        h1.classList.add('recipeTitle');

        let btext = document.createTextNode("Learn more");
        button.appendChild(btext);
        button.classList.add('recipeBTN')

        button.addEventListener('click', () => {
            GenerateNewPage(Recipes[i])
        })

        divContain.appendChild(h1);
        divContain.appendChild(img);
        divContain.appendChild(P)
        divContain.appendChild(button);
        container.appendChild(divContain);

    }
}

function GenerateNewPage(ClickedRecipe) {
    let body = document.querySelector('body');
    body.innerHTML = "";

    body.style.backgroundImage = 'url(images/backgroundNew.jpeg)';

    let section = document.createElement('section');
    section.classList.add('newRecipeContainer');

    let h1 = document.createElement('h1');
    let recipeTitleText = document.createTextNode(ClickedRecipe.dishname);
    h1.classList.add('newRecipeTitle');
    h1.appendChild(recipeTitleText);

    // REQ 3: Here I create an image element and add an alt element that is simply the name of the dish.
    // The alt attribute in an image is important for web accessibility, providing alternative text that 
    // describes the content of the image to users who may not be able to see it.

    let img = document.createElement('img');
    img.setAttribute("src", `recipeImages/${ClickedRecipe.imageName}`);
    img.classList.add('newRecipeImg');

    let ingredientList = document.createElement('ol');
    ingredientList.classList.add('newRecipeIngredients');

    let ingredientListTitle = document.createElement('h1');
    ingredientListTitle.style.border = '2px solid black';
    let ingredientsTitleText = document.createTextNode('Ingredients');
    ingredientListTitle.appendChild(ingredientsTitleText);
    ingredientList.appendChild(ingredientListTitle);

    for (let i = 0; i < ClickedRecipe.ingredients.length; i++) {
        let li = document.createElement('li');
        let ingredientText = document.createTextNode(ClickedRecipe.ingredients[i]);
        li.appendChild(ingredientText);
        ingredientList.appendChild(li);
    }

    let instructionList = document.createElement('ol');
    instructionList.classList.add('newRecipeInstructions');

    let instructionListTitle = document.createElement('h1');
    instructionListTitle.style.border = '2px solid black';
    let instructionsTitleText = document.createTextNode('Directions');
    instructionListTitle.appendChild(instructionsTitleText);
    instructionList.appendChild(instructionListTitle);

    for (let i = 0; i < ClickedRecipe.instructions.length; i++) {
        let li = document.createElement('li');
        let instructionText = document.createTextNode(ClickedRecipe.instructions[i]);
        li.appendChild(instructionText);
        instructionList.appendChild(li);
    }

    let printButton = document.createElement('button');
    printButton.setAttribute("onclick", "window.print()");
    let printButtonText = document.createTextNode("Print");
    printButton.classList.add('newRecipeButton');
    printButton.appendChild(printButtonText);


    section.appendChild(h1);
    section.appendChild(img);
    section.appendChild(ingredientList);
    section.appendChild(instructionList);
    section.appendChild(printButton);

    body.appendChild(section);
}