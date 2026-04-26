using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using System.Text;
using Npgsql;

var factory = new MqttFactory();
var client = factory.CreateMqttClient();

client.ApplicationMessageReceivedAsync += HandleMessageAsync;

var options = new MqttClientOptionsBuilder()
    .WithClientId($"dotnet8-subscriber-{Guid.NewGuid()}")
    .WithTcpServer("MqttIotBrokerContainer", 1883) // 👈 your broker IP
    .Build();

await client.ConnectAsync(options);
await client.SubscribeAsync("test/topic1", MqttQualityOfServiceLevel.AtLeastOnce);
await client.SubscribeAsync("test/topic2", MqttQualityOfServiceLevel.AtLeastOnce);
Console.WriteLine("Subscribed. Waiting for messages...");
await Task.Delay(Timeout.Infinite);

static async Task HandleMessageAsync(MqttApplicationMessageReceivedEventArgs e)
{
    var topic = e.ApplicationMessage.Topic;

    if (topic != "test/topic1")
    {
        Console.WriteLine($"Unknown topic {topic}");
        return;
    }

    var payload = Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment);

    if (!float.TryParse(payload, System.Globalization.CultureInfo.InvariantCulture, out float value))
    {
        Console.WriteLine($"Invalid float: {payload}");
        return;
    }

    var now = DateTime.Now;
    Console.WriteLine($"{now} -> {value}");

    await SaveToDatabaseAsync(topic, value);
}

static async Task SaveToDatabaseAsync(string topic, float value)
{
    var connectionString = "Host=MqttIotDBContainer;Port=5432;Username=myuser;Password=mypassword;Database=mydatabase";

    await using var conn = new NpgsqlConnection(connectionString);
    await conn.OpenAsync();

    await using var cmd = new NpgsqlCommand(
        "INSERT INTO public.measurments (value) VALUES (@value)", conn);

    cmd.Parameters.AddWithValue("value", value);

    await cmd.ExecuteNonQueryAsync();
}