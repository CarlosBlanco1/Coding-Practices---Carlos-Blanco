using WebApplication1.Classes;

namespace WebApplication1.Data
{
    public interface IDataStore
    {
        Task<String> GetAllMovies();
        Task<String> GetMovie(int id);
        Task<Meal> AddMovie(Meal movie);
        Task<Meal> UpdateMovie(Meal movie);
        Task DeleteMovie(int id);
        Task DeleteActor(int id);
    }
}
