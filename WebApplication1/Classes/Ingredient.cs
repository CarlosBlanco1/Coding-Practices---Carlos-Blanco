namespace WebApplication1.Classes
{
    public class Ingredient
    {
        private string _name {  get; set; }
        private int _quantity { get; set; }
        private string _unit { get; set; }
        public string GetDescription()
        {
            return $"{_quantity} {_unit} {_name} ";
        }
    }
}
