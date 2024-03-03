using CommonClass;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HouseMahjong
{
    internal class Listen
    {
        internal static void IpAndPort(string hostIP, int tcpPort)
        {
            var dealWith = new TcpFunction.ResponseC.DealWith(DealWith);
            TcpFunction.ResponseC.f.ListenIpAndPort(hostIP, tcpPort, dealWith);
        }

        private static string DealWith(string notifyJson, int port)
        {
            // try
            {
                CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);
                return DealWithInterfaceAndObj(Program.rm, c, notifyJson);

            }
            //catch
            //{
            //    //Consol.WriteLine($"notify receive:{notifyJson}");
            //    File.AppendAllText($"log/d{port}.txt", $"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}-{notifyJson}{Environment.NewLine}");
            //    return "haveNothingToReturn";
            //}
        }

        static string DealWithInterfaceAndObj(interfaceOfHM.ListenInterface objI, CommonClass.Command c, string notifyJson)
        {

            /*
             * 这些方法，中间禁止线程暂停，即Thread.sleep()
             */
            string outPut = "haveNothingToReturn";
            {
                // CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(notifyJson);
                Console.WriteLine(c.c);
                switch (c.c)
                {
                    case "PlayerAdd_V2":
                        {
                            CommonClass.PlayerAdd_V2 addItem = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PlayerAdd_V2>(notifyJson);
                            var result = objI.AddPlayer(addItem, Program.rm);
                            outPut = result;
                        }; break;
                    case "GetPosition":
                        {
                            CommonClass.GetPosition getPosition = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.GetPosition>(notifyJson);
                            //string fromUrl; 
                            var GPResult = objI.GetPosition(getPosition);
                            if (GPResult.Success)
                            {
                                CommonClass.GetPositionNotify_v2 notify = new CommonClass.GetPositionNotify_v2()
                                {
                                    c = "GetPositionNotify_v2",
                                    WebSocketID = GPResult.WebSocketID,
                                    key = getPosition.Key,
                                    PlayerName = GPResult.PlayerName,
                                    AsynSend = false, //这里之所以要同步发送，是因为刷新的时候不报错！,
                                    groupNumber = GPResult.GroupNumber,
                                    Mahjongs = GPResult.Mahjongs,
                                    MahjongState = GPResult.State.ToString().Trim(),
                                    Position = GPResult.PlayerPosition.ToString(),
                                };

                                Startup.sendSingleMsg(GPResult.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));
                            }
                            outPut = "ok";
                        }; break;
                    case "PositionSelectToServer":
                        {
                            CommonClass.PositionSelectToServer psts = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.PositionSelectToServer>(notifyJson);
                            outPut = objI.PositionSelectToServerF(psts);

                        }; break;
                    case "StartPositionSelectToServer":
                        {

                            CommonClass.StartPositionSelectToServer? spss = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.StartPositionSelectToServer>(notifyJson);
                            if (spss != null)
                            {
                                outPut = objI.StartPositionSelectToServerF(spss);
                            }
                            else outPut = "ng";
                        }; break;

                }
            }
            {
                return outPut;
            }
        }

    }
}
