using CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace WsOfMahjongClient
{
    public class Room
    {
        static List<string> debugItem = new List<string>();
        public static List<string> roomUrls
        {
            get
            {
                if (debugItem.Count == 0)
                {
                    var rootPath = System.IO.Directory.GetCurrentDirectory();
                    {
                        var text = File.ReadAllLines($"{rootPath}\\config\\rooms.txt");
                        for (int i = 0; i < text.Length; i++)
                        {
                            if (string.IsNullOrEmpty(text[i])) { }
                            else
                            {
                                debugItem.Add(text[i]);
                            }
                        }
                    }
                }
                return debugItem;
            }
        }

        public static void NotifyMsg(ConnectInfo.ConnectInfoDetail connectInfoDetail, string info)
        {
            var notifyMsg = info;
            var passObj = new
            {
                msg = notifyMsg,
                c = "ShowAgreementMsg"
            };
            var returnMsg = Newtonsoft.Json.JsonConvert.SerializeObject(passObj);
            CommonF.SendData(returnMsg, connectInfoDetail, 0);
        }

        internal static State setState(State s, ConnectInfo.ConnectInfoDetail connectInfoDetail, LoginState ls)
        {
            s.Ls = ls;
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "setState", state = Enum.GetName(typeof(LoginState), s.Ls) });
            CommonF.SendData(msg, connectInfoDetail, 0);
            return s;
        }

        internal static string setOffLine(ref State s)
        {
            s = null;
#warning 这里要优化！！！
            return "";
        }

        public static State GetRoomThenStart(State s, ConnectInfo.ConnectInfoDetail connectInfoDetail, string playerName, string refererAddr, int groupMemberCount)
        {
            /*
             * 单人组队下
             */
            int roomIndex;
            var roomInfo = Room.getRoomNum(s.WebsocketID, playerName, refererAddr, groupMemberCount);

            roomIndex = roomInfo.RoomIndex;
            //  Console.WriteLine(roomInfo.RoomIndex);
            s.Key = roomInfo.Key;
            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
            var receivedMsg = Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
            if (receivedMsg == "ok")
            {
                //  Console.WriteLine(receivedMsg);
                WriteSession(roomInfo, connectInfoDetail);
                s.roomIndex = roomIndex;
                s.GroupKey = roomInfo.GroupKey;
                s = setOnLine(s, connectInfoDetail);

            }
            else
            {
                NotifyMsg(connectInfoDetail, "进入房间失败！");
            }
            return s;
        }

        private static System.Random rm = new System.Random(DateTime.Now.GetHashCode());
        internal static PlayerAdd_V2 getRoomNum(int websocketID, string playerName, string refererAddr, int groupMemberCount)
        {
            int roomIndex = 0;
            {
                var index1 = rm.Next(roomUrls.Count);
                var index2 = rm.Next(roomUrls.Count);
                if (index1 == index2)
                {
                    roomIndex = index1;
                }
                else
                {
                    var frequency1 = getFrequency(Room.roomUrls[index1]); ; //Startup.sendInmationToUrlAndGetRes(Room.roomUrls[roomInfo.RoomIndex], sendMsg);
                    var frequency2 = getFrequency(Room.roomUrls[index2]);
                    //100代表1/120hz,这里的2000，极值是1Hz(12000)。极限是2Hz(24000)
                    var value1 = frequency1 < 12000 ? frequency1 : Math.Max(1, 24000 - frequency1);
                    var value2 = frequency2 < 12000 ? frequency2 : Math.Max(1, 24000 - frequency2);
                    var sumV = value1 + value2;
                    var rIndex = rm.Next(sumV);
                    if (rIndex < value1)
                    {
                        roomIndex = index1;
                    }
                    else
                    {
                        roomIndex = index2;
                    }
                }
            }
            // var  
            var key = CommonClass.Random.GetMD5HashFromStr(ConnectInfo.HostIP + websocketID + DateTime.Now.ToString("yyyyMMddHHmmssffff") + ConnectInfo.tcpServerPort + "_" + ConnectInfo.webSocketPort);
            //var mid = key.Substring(7, 24);
            //key = $"nyrq123{mid}2";//前7为是log，中间为GroupID，
            //key = "nyrq123" + key;
            //key = key.Substring(0, 31);
            // key=key
            var roomUrl = roomUrls[roomIndex];
            return new PlayerAdd_V2()
            {
                Key = key,
                GroupKey = key,
                c = "PlayerAdd_V2",
                FromUrl = $"{ConnectInfo.HostIP}:{ConnectInfo.tcpServerPort}",// ConnectInfo.ConnectedInfo + "/notify",
                RoomIndex = roomIndex,
                WebSocketID = websocketID,
                Check = CommonClass.Random.GetMD5HashFromStr(key + roomUrl + CheckParameter),
                PlayerName = playerName,
                RefererAddr = refererAddr,
                groupMemberCount = groupMemberCount
            };
            // throw new NotImplementedException();
        }
        static string CheckParameter = "_add_yrq";

        private static int getFrequency(string roomUrl)
        {
            var sendMsg = Newtonsoft.Json.JsonConvert.SerializeObject(new GetFrequency()
            {
                c = "GetFrequency",

            });
            var result = Startup.sendInmationToUrlAndGetRes(roomUrl, sendMsg);
            return int.Parse(result);
        }

        // public static string RoomInfoRegexPattern = $"^\\{{\\\"Key\\\":\\\"{"[0-9a-f]{32}"}\\\",\\\"GroupKey\\\":\\\"{"[0-9a-f]{32}"}\\\",\\\"FromUrl\\\":\\\"\\\",\\\"RoomIndex\\\":{"[0-9]{1,5}"},\\\"Check\\\":\\\"{"[0-9a-f]{32}"}\\\",\\\"WebSocketID\\\":{"[0-9]{1,10}"},\\\"PlayerName\\\":\\\"{"[\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5]{1,8}"}\\\",\\\"RefererAddr\\\":\\\"{"[0-9a-zA-z]{0,99}"}\\\",\\\"groupMemberCount\\\":{"[0-9]{1,10}"},\\\"c\\\":\\\"{"PlayerAdd_V2"}\\\"\\}}$";
        static void WriteSession(PlayerAdd_V2 roomInfo, ConnectInfo.ConnectInfoDetail connectInfoDetail)
        {
            // roomNumber
            /*
             * 在发送到前台以前，必须将PlayerAdd对象中的FromUrl属性擦除
             */
            roomInfo.FromUrl = "";
            //var session = Newtonsoft.Json.JsonConvert.SerializeObject(roomInfo);
            var session = $"{{\"Key\":\"{roomInfo.Key}\",\"GroupKey\":\"{roomInfo.GroupKey}\",\"FromUrl\":\"{roomInfo.FromUrl}\",\"RoomIndex\":{roomInfo.RoomIndex},\"Check\":\"{roomInfo.Check}\",\"WebSocketID\":{roomInfo.WebSocketID},\"PlayerName\":\"{roomInfo.PlayerName}\",\"RefererAddr\":\"{roomInfo.RefererAddr}\",\"groupMemberCount\":{roomInfo.groupMemberCount},\"c\":\"{roomInfo.c}\"}}";
            Regex reg = new Regex(BLL.CheckSessionBLL.RoomInfoRegexPattern);
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

        /// <summary>
        /// 起到一个承前启后的作用，好些功能需要在这个参数里加载。包括后台，包括前台！
        /// </summary>
        /// <param name="s"></param>
        /// <param name="webSocket"></param>
        /// <returns></returns>
        public static State setOnLine(State s, ConnectInfo.ConnectInfoDetail connectInfoDetail)
        {
            State result;
            {
                 

                result = setState(s, connectInfoDetail, LoginState.OnLine);

                {
                    #region 校验响应
                    var checkIsOk = CheckRespon(connectInfoDetail, "SetOnLine");
                    if (checkIsOk)
                    {
                        // UpdateAfter3DCreate();
                    }
                    else
                    {
                        return s;
                    }
                    #endregion
                }
                initializeOperation(s);
            }
            result.JoinGameSingle_Success = true;
            return result;
        }


        /// <summary>
        /// 校验网页的回应！
        /// </summary>
        /// <param name="webSocket"></param>
        /// <param name="v"></param>
        /// <returns></returns>
        private static bool CheckRespon(ConnectInfo.ConnectInfoDetail connectInfoDetail, string checkValue)
        {
            var timeOut = new CancellationTokenSource(1500000).Token;
            var resultAsync = Startup.ReceiveStringAsync(connectInfoDetail, timeOut);

            //  resultAsync 
            if (resultAsync.wr == null)
            {
                return false;
            }
            if (resultAsync.result == checkValue)
            {
                return true;
            }
            else
            {
                Console.WriteLine($"错误的回话--checkValue:{checkValue}!=resultAsync.result:{resultAsync.result}");
                var t2 = connectInfoDetail.ws.CloseAsync(WebSocketCloseStatus.PolicyViolation, "错误的回话", new CancellationToken());
                t2.GetAwaiter().GetResult();
                return false;
            }
        }

        /// <summary>
        /// 发送此命令，必在await setState(s, webSocket, LoginState.OnLine) 之后。两者是在前台是依托关系！
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        private static void initializeOperation(State s)
        {
            // var key = CommonClass.Random.GetMD5HashFromStr(ConnectInfo.ConnectedInfo + websocketID + DateTime.Now.ToString());
            // var roomUrl = roomUrls[s.roomIndex];
            var getPosition = new GetPosition()
            {
                c = "GetPosition",
                Key = s.Key,
                GroupKey = s.GroupKey
            };
            var msg = Newtonsoft.Json.JsonConvert.SerializeObject(getPosition);
            var result = Startup.sendInmationToUrlAndGetRes(Room.roomUrls[s.roomIndex], msg);

        }

        internal static bool CheckSign(PlayerCheck playerCheck)
        {
            var roomUrl = roomUrls[playerCheck.RoomIndex];
            var check = CommonClass.Random.GetMD5HashFromStr(playerCheck.Key + roomUrl + CheckParameter);
            return playerCheck.Check == check;
        }
    }
}
