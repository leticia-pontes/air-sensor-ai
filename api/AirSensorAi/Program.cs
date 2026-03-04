using Firebase.Database;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<FirebaseClient>(provider =>
{
    var basePath = Environment.GetEnvironmentVariable("FIREBASE_BASE_PATH")
                   ?? throw new InvalidOperationException("FIREBASE_BASE_PATH environment variable is not set");
    return new FirebaseClient(basePath);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/teste", () => "ok");
app.UseCors("AllowAll");
app.UseRouting();
app.MapControllers();
app.Run();