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

                }
            }
            {
                return outPut;
            }
        }

    }
}
