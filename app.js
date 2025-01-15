const searchMeal = async (e) => {
  e.preventDefault();

  //Getting data from the dom
  const img = document.querySelector(".img");
  const meal_name = document.querySelector(".meal_name");
  const info = document.querySelector("#info");
  const input = document.querySelector("#search");
  const ingredients_output = document.querySelector(".ingredients");
  const error_container = document.querySelector("#error_message");
  const errorMessage = document.querySelector(".message");

  //clear error on input
  input.addEventListener("input", () => {
    error_container.classList.remove("active");
  });

  //dismiss error
  error_container.addEventListener("click", () => {
    error_container.classList.remove("active");
  });

  //show meal to UI
  const showMealInfo = (meal) => {
    const { strMeal, strMealThumb, strInstructions } = meal;
    img.style.backgroundImage = `url(${strMealThumb})`;
    meal_name.textContent = strMeal;
    info.textContent = strInstructions;

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      // Ingredient keys start from 1
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient) {
        ingredients.push(`${ingredient} - ${measure}`);
      } else {
        break;
      }
    }

    const html = `
    <span>${ingredients
      .map((ing) => `<li class="ing">${ing}</li>`)
      .join("")}</span>
    `;

    ingredients_output.innerHTML = html;
  };

  //fetching meal data
  const fetchMeal = async (val) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const { meals } = await response.json();
      error_container.classList.remove("active");
      return meals;
    } catch (error) {
      error_container.classList.add("active");
      errorMessage.textContent = "An error occurred while fetching data.";
    }
  };

  //check if input has value
  let val = input.value.trim();
  if (val) {
    const meals = await fetchMeal(val);

    if (!meals) {
      error_container.classList.add("active");
      if (
        errorMessage.textContent !== "An error occurred while fetching data."
      ) {
        errorMessage.textContent = "MEAL NOT FOUND :(";
      }
      if (meals === null) {
        errorMessage.textContent = "MEAL NOT FOUND :(";
      }
      return;
    }

    meals.forEach(showMealInfo);
  } else {
    error_container.classList.add("active");
    errorMessage.textContent = "PLEASE SEARCH FOR A MEAL :)";
  }
};

const form = document.querySelector("form");
form.addEventListener("submit", searchMeal);

const magnifier = document.querySelector(".magnifier");
magnifier.addEventListener("click", searchMeal);

const collapseBtn = document.querySelector(".collapse");
const collapseMessage = document.querySelector(".collapse_message");

collapseBtn.addEventListener("click", () => {
  collapseBtn.classList.toggle("active");
  collapseMessage.classList.toggle("active");
});
