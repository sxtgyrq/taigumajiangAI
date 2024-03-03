using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Collections.Generic;

namespace HouseMahjong
{
    internal class Program
    {
        public static RoomMainF.RoomMain rm;
        static void Main(string[] args)
        {
            Program.rm = new RoomMainF.RoomMain();
            {
                var ip = "127.0.0.1";
                int tcpPort = 11170;

                Console.WriteLine($"输入ip,如“{ip}”");
                var inputIp = Console.ReadLine();
                if (string.IsNullOrEmpty(inputIp)) { }
                else
                {
                    ip = inputIp;
                }

                Console.WriteLine($"输入端口≠15000,如“{tcpPort}”");
                var inputWebsocketPort = Console.ReadLine();
                if (string.IsNullOrEmpty(inputWebsocketPort)) { }
                else
                {
                    int num;
                    if (int.TryParse(inputWebsocketPort, out num))
                    {
                        tcpPort = num;
                    }
                }


                //  Data.SetRootPath();

                Thread startTcpServer = new Thread(() => Listen.IpAndPort(ip, tcpPort));
                startTcpServer.Start();

                //Thread startMonitorTcpServer = new Thread(() => Listen.IpAndPortMonitor(ip, 30000 - tcpPort));
                //startMonitorTcpServer.Start();

                //Thread th = new Thread(() => PlayersSysOperate(Program.dt));
                //th.Start();

                //Thread threadLiveOperate = new Thread(() => GroupLive(Program.dt));
                //threadLiveOperate.Start();
                //int tcpServerPort = 30000 - websocketPort;
                //ConnectInfo.HostIP = ip;
                //ConnectInfo.webSocketPort = websocketPort;
                //ConnectInfo.tcpServerPort = tcpServerPort;
            }
            while (true)
            {
                if (Console.ReadLine().ToLower() == "exit")
                {
                    //int countOfPlayersOnline = 0;
                    //if (Program.rm._Groups != null)
                    //{
                    //    foreach (var groupItem in Program.rm._Groups)
                    //    {
                    //        foreach (var playerItem in groupItem.Value._PlayerInGroup)
                    //        {
                    //            if (playerItem.Value.IsOnline())
                    //            {
                    //                countOfPlayersOnline++;
                    //            }
                    //        }
                    //    }
                    //}
                    //if (countOfPlayersOnline > 0)
                    //{
                    //    Console.WriteLine($"当前有{countOfPlayersOnline}人在线，未能退出！");
                    //    continue;
                    //}
                    //else
                    {
                        break;
                    }
                }
            }
            Environment.Exit(0);
        }
    }
}
