using Microsoft.AspNetCore.Mvc;
using WebApplication1.Classes;
using WebApplication1.Data;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MealController : Controller
    {
        private ILogger<MealController> _logger;
       private readonly IDataStore dataStore;
        private List<Meal> meals {  get; set; }

   
        public MealController(ILogger<MealController> logger, IDataStore dataStore)
        {
            _logger = logger;
            this.dataStore = dataStore;
        }

        [HttpGet()]
        public async Task<String> Get()
        {
            return await dataStore.GetAllMovies();
        }

        [HttpGet("{id}")]
        public async Task<String> Get(int id)
        {
            return await dataStore.GetMovie(id);
        }

        [HttpPost]
        public async Task<Meal> Post([FromBody] Meal movie)
        {
            var newMovie = await dataStore.AddMovie(movie);
            return newMovie;
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await dataStore.DeleteMovie(id);
        }

        [HttpDelete("/actor/delete/{id}")]
        public async Task DeleteActor(int id)
        {
            await dataStore.DeleteActor(id);
        }

        [HttpPatch()]

        public async Task<Meal> Patch([FromBody] Meal movie)
        {
            var updatedMovie = await dataStore.UpdateMovie(movie);
            return updatedMovie;
        }


    }
}
