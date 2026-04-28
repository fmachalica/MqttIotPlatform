using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin());
});

var app = builder.Build();

app.UseCors("AllowReact");

app.MapGet("/measurements", async (DateTime start_time, DateTime end_time) =>
{
    var results = new List<Measurement>();

    var connectionString =
        "Host=MqttIotDBContainer;Port=5432;Username=myuser;Password=mypassword;Database=mydatabase";

    await using var con = new NpgsqlConnection(connectionString);
    await con.OpenAsync();

    await using var cmd = new NpgsqlCommand(
        "SELECT value, timestamp FROM public.measurments WHERE timestamp > @from AND timestamp < @to",
        con);

    cmd.Parameters.AddWithValue("from", start_time);
    cmd.Parameters.AddWithValue("to", end_time);

    await using var reader = await cmd.ExecuteReaderAsync();

    while (await reader.ReadAsync())
    {
        var value = reader.GetDouble(0);
        var timestamp = reader.GetDateTime(1);

        results.Add(new Measurement(value, timestamp));
    }

    return Results.Ok(results);
});

app.Run();

// 👇 ALWAYS put types AFTER top-level code
record Measurement(double Value, DateTime Timestamp);