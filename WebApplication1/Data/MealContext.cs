using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Classes;

namespace dadabase.Data;

public partial class MealContext : DbContext
{
    public MealContext()
    {
    }

    public MealContext(DbContextOptions<MealContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Meal> Meals { get; set; }
    
}