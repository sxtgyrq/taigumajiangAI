using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore;
using System.Text.RegularExpressions;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.HttpOverrides;

namespace WsOfMahjongClient
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            {
                // CommonClass.Img.DrawFont.Initialize(data);
                Team.Config();
                //  Room.SetWhenStart();
                Console.WriteLine("你好！此服务为网页端的webSocket服务！20220702");
                var ip = "127.0.0.1";
                int websocketPort = 17001;

                Console.WriteLine($"输入ip,如“{ip}”");
                var inputIp = Console.ReadLine();
                if (string.IsNullOrEmpty(inputIp)) { }
                else
                {
                    ip = inputIp;
                }

                Console.WriteLine($"输入端口≠15000,如“{websocketPort}”");
                var inputWebsocketPort = Console.ReadLine();
                if (string.IsNullOrEmpty(inputWebsocketPort)) { }
                else
                {
                    int num;
                    if (int.TryParse(inputWebsocketPort, out num))
                    {
                        websocketPort = num;
                    }
                }
                int tcpServerPort = 30000 - websocketPort;
                ConnectInfo.HostIP = ip;
                ConnectInfo.webSocketPort = websocketPort;
                ConnectInfo.tcpServerPort = tcpServerPort;

                var builder = CreateWebHostBuilder(new string[] { $"http://{ip}:{ConnectInfo.webSocketPort}" });

                var app = builder.Build();
                app.Run();
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
           WebHost.CreateDefaultBuilder(args).
           Configure(item => item.UseForwardedHeaders(new ForwardedHeadersOptions
           {
               ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
           })).UseKestrel(options =>
           {
               options.AllowSynchronousIO = true;
           })
.UseUrls(args[0])
  .UseStartup<Startup>();
    }
}
