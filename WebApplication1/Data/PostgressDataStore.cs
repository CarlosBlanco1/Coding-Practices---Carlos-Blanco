using Microsoft.EntityFrameworkCore;
using WebApplication1.Classes;
using WebApplication1.Data;

namespace dadabase.Data
{
    public class PostgresMealDataStore: IDataStore
    {
        private readonly MealContext context;
        private readonly ILogger<PostgresMealDataStore> logger;

        public PostgresMealDataStore(MealContext context, ILogger<PostgresMealDataStore> logger)
        {
            this.context = context;
            this.logger = logger;
        }

        public async Task<Meal> AddMeal(Meal Meal)
        {

            context.Meals.Add(Meal);
            await context.SaveChangesAsync();
            return Meal;
        }

        public async Task DeleteMeal(int id)
        {
            var existingRecipe = await context.Meals.FindAsync(id);
            if (existingRecipe is null)
            {
                throw new ArgumentException($"Recipe with id {id} does not exist");
            }
            context.Meals.Remove(existingRecipe);
            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Meal>> GetAllMeals() => await context.Meals.ToListAsync();

        public async Task<Meal> GetMeal(int id, bool showDetails = false)
        {
            if (showDetails)
            {
                return await context.Meals
                    .Include(c => c.CategorizedMeals)
                    .ThenInclude(c => c.Mealcategory)
                    .FirstOrDefaultAsync(c => c.Id == id);
            }
            return await context.Meals.FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Meal> UpdateMeal(Meal Meal)
        {
            await Task.CompletedTask;
            var value = await context.Meals.Include(c => c.CategorizedMeals)
                    .ThenInclude(c => c.Mealcategory)
            .FirstOrDefaultAsync(r => r.Id == Meal.Id);
            value.Mealname = Meal.Mealname;
            value.Mealtext = Meal.Mealtext;
            await context.SaveChangesAsync();
            return Meal;
        }

        public async Task<IEnumerable<Meal>> GetMealsByCategory(string category)
        {
            var query = from categorizedMeal in context.CategorizedMeals
                        join MealCategory in context.Mealcategories on categorizedMeal.Mealcategoryid equals MealCategory.Id
                        join Meal in context.Meals on categorizedMeal.Mealid equals Meal.Id
                        where MealCategory.Categoryname == category
                        select Meal;

            var results =  await query.ToListAsync();
            return results;
        }

        public async Task<IEnumerable<Meal>> GetMealsByAudience(string inputAudience)
        {
            var query = from deliveredMeal in context.DeliveredMeals
                        join audience in context.Audiences on deliveredMeal.Audienceid equals audience.Id
                        join Meal in context.Meals on deliveredMeal.Mealid equals Meal.Id
                        where audience.Audiencename == inputAudience
                        select Meal;

            var results = await query.ToListAsync();
            return results;
        }

        public async Task<IEnumerable<Meal>> GetMealsByReaction()
        {
            var query = from deliveredMeal in context.DeliveredMeals
                        join MealReactionCategory in context.Mealreactioncategories on deliveredMeal.Mealreactionid equals MealReactionCategory.Id
                        join Meal in context.Meals on deliveredMeal.Mealid equals Meal.Id
                        orderby deliveredMeal.Mealreactionid ascending
                        select Meal;

            var results = await query.ToListAsync();
            return results;
        }

        public async Task<IEnumerable<Meal>> GetMealsRankedGivenCategory(string inputCategory)
        {
            var query = from deliveredMeal in context.DeliveredMeals
                        join Meal in context.Meals on deliveredMeal.Mealid equals Meal.Id
                        join categorizedMeal in context.CategorizedMeals on Meal.Id equals categorizedMeal.Mealid 
                        join MealCategory in context.Mealcategories on categorizedMeal.Mealcategoryid equals MealCategory.Id
                        where MealCategory.Categoryname == inputCategory
                        orderby deliveredMeal.Mealreactionid ascending
                        select Meal;

            var results = await query.ToListAsync();
            return results;
        }

        public async Task<IEnumerable<Meal>> GetMealsRankedGivenAudience(string inputAudience)
        {
            var query = from deliveredMeal in context.DeliveredMeals
                        join Meal in context.Meals on deliveredMeal.Mealid equals Meal.Id
                        join audience in context.Audiences on deliveredMeal.Audienceid equals audience.Id
                        where audience.Audiencename == inputAudience
                        orderby deliveredMeal.Mealreactionid ascending
                        select Meal;

            var results = await query.ToListAsync();
            return results;
        }

        public async Task<int> GetNumberOfTimesTold(string MealName)
        {
            await Task.CompletedTask;
            int count = context.DeliveredMeals
                .Join(context.Meals,
                d => d.Mealid,
                f => f.Id,
                (d, f) => new {deliveredMeals = d, Meal = f})
                .Where(e => e.Meal.Mealname == MealName)
                .Count();

            return count;
        }



    }
}