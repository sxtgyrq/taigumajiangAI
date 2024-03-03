using CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static WsOfMahjongClient.ConnectInfo;

namespace WsOfMahjongClient
{
    public class CommonF
    {
        // public static Dictionary<int, object> LockDictionary = new Dictionary<int, object>();
        public static void SendData(string sendMsg, ConnectInfo.ConnectInfoDetail detail, int outTime)
        {
            try
            {
                lock (detail.LockObj)
                {
                    // detail.datas.Add(sendMsg);
                    var sendData = Encoding.UTF8.GetBytes(sendMsg);
                    CancellationToken timeOut;
                    if (outTime < 60000)
                        timeOut = new CancellationTokenSource(60000).Token;
                    else
                        timeOut = new CancellationTokenSource(outTime).Token;
                    var t = detail.ws.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, timeOut);
                    t.GetAwaiter().GetResult();
                }
            }
            catch { }
        }

        //private static async void SendMsgF(ConnectInfo.ConnectInfoDetail detail, int outTime)
        //{
        //    CancellationToken timeOut;
        //    if (outTime < 60000)
        //        timeOut = new CancellationTokenSource(60000).Token;
        //    else
        //        timeOut = new CancellationTokenSource(outTime).Token;
        //    while (detail.datas.Count > 0)
        //    {
        //        string msg;
        //        lock (detail.LockObj)
        //        {
        //            msg = detail.datas[0];
        //            detail.datas.RemoveAt(0);
        //        }
        //        var sendData = Encoding.UTF8.GetBytes(msg);
        //        await detail.ws.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, timeOut);
        //    }
        //}
    }
    internal class Team
    {
        static string teamUrl = "127.0.0.1:11200";
        internal static TeamResult createTeam2(int websocketID, string playerName, string command_start)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamCreate()
            {
                WebSocketID = websocketID,
                c = "TeamCreate",
                FromUrl = $"{ConnectInfo.HostIP}:{ConnectInfo.tcpServerPort}",//ConnectInfo.ConnectedInfo + "/notify",
                CommandStart = command_start,
                PlayerName = playerName
            });
            var result = Startup.sendInmationToUrlAndGetRes($"{teamUrl}", msg);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<TeamResult>(result);

        }

        internal static string SetToBegain(TeamResult team, PlayerAdd_V2 roomInfo)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamBegain()
            {
                c = "TeamBegain",
                TeamNum = team.TeamNumber,
                RoomIndex = roomInfo.RoomIndex,
                GroupKey = roomInfo.GroupKey
            });
            var result = Startup.sendInmationToUrlAndGetRes($"{teamUrl}", msg);
            return result;
        }

        internal static string findTeam2(int websocketID, string playerName, string command_start, string teamIndex, out string updateKey)
        {
            updateKey = CommonClass.Random.GetMD5HashFromStr(DateTime.Now.ToString());
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamJoin()
            {
                WebSocketID = websocketID,
                c = "TeamJoin",
                FromUrl = $"{ConnectInfo.HostIP}:{ConnectInfo.tcpServerPort}",// ConnectInfo.ConnectedInfo + "/notify",
                CommandStart = command_start,
                PlayerName = playerName,
                TeamIndex = teamIndex,
                UpdateKey = updateKey
            });
            string resStr = Startup.sendInmationToUrlAndGetRes($"{teamUrl}", msg);

            return resStr;
            //return Newtonsoft.Json.JsonConvert.DeserializeObject<TeamFoundResult>(json);
        }

        internal static void Config()
        {
            var rootPath = System.IO.Directory.GetCurrentDirectory();
            //Consol.WriteLine($"path:{rootPath}");
            //Consoe.WriteLine($"IPPath:{rootPath}");
            if (File.Exists($"{rootPath}\\config\\teamIP.txt"))
            {
                var text = File.ReadAllText($"{rootPath}\\config\\teamIP.txt");
                teamUrl = text;
                Console.WriteLine($"读取了组队ip地址--{teamUrl},按任意键继续");
                Console.ReadLine();
            }
            else
            {
                Console.WriteLine($"没有组队服务IP，按任意键继续");
                Console.ReadLine();
                //Console.WriteLine($"请market输入IP即端口，如127.0.0.1:11200");
                //teamUrl = Console.ReadLine();
                //Console.WriteLine("请market输入端口");
                //this.port = int.Parse(Console.ReadLine());
                //var text = $"{this.IP}:{this.port}";
                //File.WriteAllText($"{rootPath}\\config\\MarketIP.txt", text);
            }
            //throw new NotImplementedException();
        }

        internal static bool leaveTeam(string teamID, int websocketID)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.LeaveTeam()
            {
                WebSocketID = websocketID,
                c = "LeaveTeam",
                FromUrl = $"{ConnectInfo.HostIP}:{ConnectInfo.tcpServerPort}",
                TeamIndex = teamID
            });
            string resStr = Startup.sendInmationToUrlAndGetRes($"{teamUrl}", msg);
            if (resStr == "success")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        internal static string SetToExit(TeamResult team)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamExit()
            {
                c = "TeamExit",
                TeamNum = team.TeamNumber,
            });
            var result = Startup.sendInmationToUrlAndGetRes($"{teamUrl}", msg);
            return result;
        }

        //SetToClear
        internal static string SetToClear(TeamResult team)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.CheckMembersIsAllOnLine()
            {
                c = "ClearOffLine",
                TeamNumber = team.TeamNumber
            });
            var result = Startup.sendInmationToUrlAndGetRes($"{teamUrl}", msg);
            return result;
        }


        internal static int TeamMemberCountResult(int TeamNum)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.TeamMemberCount()
            {
                c = "TeamMemberCount",
                TeamNum = TeamNum
            });
            var result = Startup.sendInmationToUrlAndGetRes($"{teamUrl}", msg);

            return int.Parse(result);
        }


        public static string TeamCaptainInfoRegexPattern = $"^\\{{\\\"TeamNumber\\\":{"[0-9]{1,9}"},\\\"UpdateKey\\\":\\\"{"[0-9a-f]{32}"}\\\",\\\"c\\\":\\\"{"TeamUpdate"}\\\",\\\"FromUrl\\\":\\\"\\\",\\\"WebSocketID\\\":{"0"},\\\"CommandStart\\\":\\\"\\\"\\}}$";//commandStart

        internal static void WriteSession(TeamResult team, ConnectInfo.ConnectInfoDetail connectInfoDetail)
        {
            //roomInfo.FromUrl = "";
            //var session = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
            var session = $"{{\"TeamNumber\":{team.TeamNumber},\"UpdateKey\":\"{team.UpdateKey}\",\"c\":\"TeamUpdate\",\"FromUrl\":\"\",\"WebSocketID\":{"0"},\"CommandStart\":\"\"}}";//CommandStart
            Regex reg = new Regex(TeamCaptainInfoRegexPattern);
            if (reg.IsMatch(session))
            {
                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { session = session, c = "setSession" });
                CommonF.SendData(msg, connectInfoDetail, 0);
            }
            else
            {
                throw new Exception("逻辑错误！");
            }
        }

        internal static string checkIsOK(CheckSession checkSession, State s, out string command_start, out string updateKey, out string teamID)
        {
            command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID);

            TeamUpdate teamUpdate = Newtonsoft.Json.JsonConvert.DeserializeObject<TeamUpdate>(checkSession.session);
            updateKey = teamUpdate.UpdateKey;
            teamID = teamUpdate.TeamNumber.ToString();
            teamUpdate.FromUrl = $"{ConnectInfo.HostIP}:{ConnectInfo.tcpServerPort}";
            teamUpdate.WebSocketID = s.WebsocketID;
            teamUpdate.CommandStart = command_start;
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(teamUpdate);
            var result = Startup.sendInmationToUrlAndGetRes($"{teamUrl}", msg);


            return result;
            // if (result == "captain") { }
        }

        internal static void UpdateTeammate(TeamResult team)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.UpdateTeammateOfCaptal()
            {
                c = "UpdateTeammateOfCaptal",
                TeamNumber = team.TeamNumber,
            });
            var result = Startup.sendInmationToUrlAndGetRes($"{teamUrl}", msg);
        }
        public static string TeamMemberInfoRegexPattern = $"^\\{{\\\"c\\\":\\\"{"TeamUpdate"}\\\",\\\"FromUrl\\\":\\\"\\\",\\\"TeamNumber\\\":{"[0-9]{1,9}"},\\\"UpdateKey\\\":\\\"{"[0-9a-f]{32}"}\\\",\\\"WebSocketID\\\":{"0"},\\\"CommandStart\\\":\\\"\\\"\\}}$";//commandStart

        /// <summary>
        /// 此方法，作为队员写入session
        /// </summary>
        /// <param name="teamID"></param>
        /// <param name="connectInfoDetail"></param>
        /// <exception cref="Exception"></exception>
        internal static void WriteSession(string teamID, string updateKey, ConnectInfoDetail connectInfoDetail)
        {
            var session = $"{{\"c\":\"TeamUpdate\",\"FromUrl\":\"\",\"TeamNumber\":{teamID},\"UpdateKey\":\"{updateKey}\",\"WebSocketID\":{"0"},\"CommandStart\":\"\"}}";//CommandStart
            Regex reg = new Regex(TeamMemberInfoRegexPattern);
            if (reg.IsMatch(session))
            {
                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { session = session, c = "setSession" });
                CommonF.SendData(msg, connectInfoDetail, 0);
            }
            else
            {
                throw new Exception("逻辑错误！");
            }
        }

        internal static bool IsAllOnLine(TeamResult team, ConnectInfoDetail connectInfoDetail)
        {
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new CommonClass.CheckMembersIsAllOnLine()
            {
                c = "CheckMembersIsAllOnLine",
                TeamNumber = team.TeamNumber,
            });
            var result = Startup.sendInmationToUrlAndGetRes($"{teamUrl}", msg);
            var listResult = Newtonsoft.Json.JsonConvert.DeserializeObject<List<TeamJoin>>(result);
            if (listResult.Count > 0)
            {
                TeamStartFailed(connectInfoDetail);
                for (int i = 0; i < listResult.Count; i++)
                {
                    Room.NotifyMsg(connectInfoDetail, $"{i}-{listResult[i].PlayerName}现在处于离线！未能开始！");
                }
                return false;
            }
            else
            {
                return true;
            }
            // return false;
        }

        public static void TeamStartFailed(ConnectInfo.ConnectInfoDetail connectInfoDetail)
        {
            // var notifyMsg = info;
            var passObj = new
            {
                c = "TeamStartFailed"
            };
            var returnMsg = Newtonsoft.Json.JsonConvert.SerializeObject(passObj);
            CommonF.SendData(returnMsg, connectInfoDetail, 0);
        }
    }
}
