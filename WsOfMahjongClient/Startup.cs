using CommonClass;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WsOfMahjongClient
{
    internal class Startup
    {
        internal static string sendInmationToUrlAndGetRes(string v, string msg)
        {
            throw new NotImplementedException();
        }

        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(options =>
            {
                //options.AddPolicy(name: "MyPolicy",
                //    builder =>
                //    {
                //        builder.WithOrigins("http://*");
                //    });
                //options.AddPolicy("AllowSpecificOrigins",
                //builder =>
                //{
                //    builder.WithOrigins("http://www.nyrq123.com", "http://localhost:1978", "https://www.nyrq123.com", "*");
                //});
                options.AddPolicy("AllowAny", p => p.AllowAnyOrigin()
                                                                          .AllowAnyMethod()
                                                                          .AllowAnyHeader());
            });

            //↓↓↓此处代码是设置App console等级↓↓↓
            services.AddLogging(builder =>
            {
                builder.AddFilter("Microsoft", LogLevel.Error)
                .AddFilter("System", LogLevel.Error)
                .AddFilter("NToastNotify", LogLevel.Error)
                .AddConsole();
            });
        }


        public void Configure(IApplicationBuilder app, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
        {



            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            //app.log

            app.UseWebSockets();
            // app.useSt(); // For the wwwroot folder
            //app.UseStaticFiles(new StaticFileOptions
            //{
            //    FileProvider = new PhysicalFileProvider(
            //"F:\\MyProject\\VRPWithZhangkun\\MainApp\\VRPWithZhangkun\\VRPServer\\WebApp\\webHtml"),
            //    RequestPath = "/StaticFiles"
            //});

            //app.Map("/postinfo", HandleMapdownload);
            var webSocketOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(3600 * 24),
                //   ReceiveBufferSize = webWsSize,
            };
            app.UseWebSockets(webSocketOptions);

            app.Map("/mahjong", Mahjong);
            // app.UseCors("AllowAny");
            //app.Map("/bgimg", BackGroundImg);
            //app.Map("/objdata", ObjData);
            //app.Map("/douyindata", douyindata);
            //app.Map("/roaddata", roaddata);//此接口只对调试时开放
            //roaddata
            //app.Map("/websocket", WebSocketF);
            // app.Map("/notify", notify);

            //Consol.WriteLine($"启动TCP连接！{ ConnectInfo.tcpServerPort}");
            Thread th = new Thread(() => startTcp());
            th.Start();
        }

        private void startTcp()
        {
            var dealWithF = new TcpFunction.ResponseC.DealWith(StartTcpDealWithF);
            TcpFunction.ResponseC.f.ListenIpAndPort(ConnectInfo.HostIP, ConnectInfo.tcpServerPort, dealWithF);
        }

        string StartTcpDealWithF(string notifyJson, int tcpPort)
        {
            try
            {
                CommonClass.CommandNotify c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.CommandNotify>(notifyJson);
                int timeOut = 0;
                switch (c.c)
                {
                    case "WhetherOnLine":
                        {
                            WebSocket ws = null;
                            lock (ConnectInfo.connectedWs_LockObj)
                            {
                                if (ConnectInfo.connectedWs.ContainsKey(c.WebSocketID))
                                {
                                    if (!ConnectInfo.connectedWs[c.WebSocketID].ws.CloseStatus.HasValue)
                                    {
                                        ws = ConnectInfo.connectedWs[c.WebSocketID].ws;
                                    }
                                    else
                                    {
                                        ConnectInfo.connectedWs.Remove(c.WebSocketID);
                                        return "off";
                                    }
                                }
                            }
                            // await context.Response.WriteAsync("ok");
                            if (ws != null)
                            {
                                if (ws.State == WebSocketState.Open)
                                {
                                    return "on";
                                }
                                else
                                {
                                    return "off";
                                }
                            }
                            else
                            {
                                return "off";
                            }
                        };
                    default:
                        {
                            ConnectInfo.ConnectInfoDetail connectInfoDetail = null;
                            lock (ConnectInfo.connectedWs_LockObj)
                            {
                                if (ConnectInfo.connectedWs.ContainsKey(c.WebSocketID))
                                {
                                    if (!ConnectInfo.connectedWs[c.WebSocketID].ws.CloseStatus.HasValue)
                                    {
                                        connectInfoDetail = ConnectInfo.connectedWs[c.WebSocketID];
                                    }
                                    else
                                    {
                                        ConnectInfo.connectedWs.Remove(c.WebSocketID);
                                    }
                                }
                            }
                            // await context.Response.WriteAsync("ok");
                            if (connectInfoDetail != null)
                            {

                                if (connectInfoDetail.ws.State == WebSocketState.Open)
                                {
                                    try
                                    {

                                        //ws.
                                        //  var sendData = Encoding.UTF8.GetBytes(notifyJson);

                                        switch (c.c)
                                        {
                                            //case "BradCastWhereToGoInSmallMap":
                                            //    {
                                            //        BradCastWhereToGoInSmallMap smallMap = Newtonsoft.Json.JsonConvert.DeserializeObject<BradCastWhereToGoInSmallMap>(notifyJson);
                                            //        var base64 = Room.GetMapBase64(smallMap);
                                            //        smallMap.base64 = base64;
                                            //        smallMap.data.Clear(); 
                                            //        notifyJson = Newtonsoft.Json.JsonConvert.SerializeObject(smallMap);
                                            //        CommonF.SendData(notifyJson, connectInfoDetail, timeOut);
                                            //    }; break;
                                            default:
                                                {
                                                    if (c.AsynSend)
                                                    {
                                                        Thread th = new Thread(() =>
                                                        {
                                                            CommonF.SendData(notifyJson, connectInfoDetail, timeOut);
                                                            Thread.Sleep(5 * 1000);
                                                        });
                                                        th.Start();
                                                    }
                                                    else
                                                    {
                                                        CommonF.SendData(notifyJson, connectInfoDetail, 2000);
                                                    }
                                                    //await ws.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                                                }; break;
                                        }

                                    }
                                    catch
                                    {
                                        // Consol.WriteLine("websocket 异常");
                                    }
                                }
                            }
                            return "";
                        };
                };
            }
            catch (Exception e)
            {
                //
                var fileContent = e.ToString();
                File.WriteAllText($"error{DateTime.Now.ToString("yyyyMMddHHmmss")}", fileContent);
                return "";
                //throw e;
            }
            // return "";
        }

        private static void Mahjong(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    using (var webSocket = await context.WebSockets.AcceptWebSocketAsync())
                    {
                        Echo(webSocket);
                    }
                }
            });
        }
        const int webWsSize = 1024 * 3;
        private static void Echo(System.Net.WebSockets.WebSocket webSocket)
        {

            WebSocketReceiveResult wResult;
            {
                //byte[] buffer = new byte[size];
                //var buffer = new ArraySegment<byte>(new byte[8192]);
                IntroState iState = new IntroState()
                {
                    randomCharacterCount = 4,
                    randomValue = ""
                };
                State s = new State();
                lock (ConnectInfo.connectedWs_LockObj)
                {
                    ConnectInfo.webSocketID++;
                    s.WebsocketID = ConnectInfo.webSocketID;
                }
                s.Ls = LoginState.empty;
                s.roomIndex = -1;
                s.mapRoadAndCrossMd5 = "";
                removeWsIsNotOnline();
                ConnectInfo.ConnectInfoDetail connectInfoDetail = addWs(webSocket, s.WebsocketID);

                var carsNames = new string[] { "车1", "车2", "车3", "车4", "车5" };
                var playerName = "玩家" + Math.Abs(DateTime.Now.GetHashCode() % 10000);

                int StopThread = 1000;
                //if(s.Ls== LoginState.)
                bool needToExitWhle = false;
                bool nameSetFromLocal = false;

                do
                {
                    if (needToExitWhle) break;
                    if (StopThread > 0)
                    {
                        Thread.Sleep(StopThread);
                        //   if (StopThread)
                        StopThread -= 20;
                    }
                    var returnResult = ReceiveStringAsync(connectInfoDetail, webWsSize);
                    if (returnResult.wr == null)
                    {
                        break;
                    }
                    wResult = returnResult.wr;
                    while (s.Ls == LoginState.WaitingToGetTeam)
                    {
                        CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(returnResult.result);
                        switch (c.c)
                        {
                            case "LeaveTeam":
                                {
                                    if (s.Ls == LoginState.WaitingToGetTeam)
                                    {
#warning 这里因该先从房价判断，房主有没有点开始！

                                        var r = Team.leaveTeam(s.teamID, s.WebsocketID);
                                        if (r)
                                            s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                    }
                                }; break;
                            case "TeamNumWithSecret":
                                {
                                    throw new Exception("");
                                    //TeamNumWithSecret
                                    //if (s.Ls == LoginState.WaitingToGetTeam)
                                    //{
                                    //    var command_start = s.CommandStart;
                                    //    CommonClass.MateWsAndHouse.RoomInfo roomInfo;
                                    //    string refererAddr;
                                    //    if (Room.CheckSecret(returnResult.result, command_start, out roomInfo, out refererAddr))
                                    //    {
                                    //        //   Consoe.WriteLine("secret 正确");
                                    //        s = Room.GetRoomThenStartAfterJoinTeam(s, connectInfoDetail, roomInfo, playerName, refererAddr);
                                    //        //exitTeam
                                    //    }
                                    //    else if (Room.CheckSecretIsExit(returnResult.result, command_start, out refererAddr))
                                    //    {
                                    //        s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                    //        // s = Room.setOnLine(s, webSocket);
                                    //    }
                                    //    else
                                    //    {
                                    //        return;
                                    //    }
                                    //}
                                    //else
                                    //{
                                    //    //Consoe.WriteLine("错误的状态");
                                    //    return;
                                    //}
                                }; break;
                        }
                        if (wResult.CloseStatus.HasValue)
                        {
                            Room.setOffLine(ref s);
                            removeWs(s.WebsocketID);
                            return;
                        }
                        // continue;
                    }

                    if (s == null)
                    {
                        /*
                         * 在do while循环中 JoinGameSingle可能会导致State s为null。如果为null，需要退出while循环
                         */
                        break;
                    }

                    if (returnResult.wr != null && !string.IsNullOrEmpty(returnResult.result))
                        try
                        {
                            {
                                CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(returnResult.result);
                                switch (c.c)
                                {
                                    case "MapRoadAndCrossMd5":
                                        {
                                            if (s.Ls == LoginState.empty)
                                            {
                                                throw new Exception("");
                                                //MapRoadAndCrossMd5 mapRoadAndCrossMd5 = Newtonsoft.Json.JsonConvert.DeserializeObject<MapRoadAndCrossMd5>(returnResult.result);
                                                //s.mapRoadAndCrossMd5 = mapRoadAndCrossMd5.mapRoadAndCrossMd5;
                                            }
                                        }; break;
                                    case "CheckSession":
                                        {
                                            if (s.Ls == LoginState.empty)
                                            {
                                                //  throw new Exception("");
                                                //var session = $"^\\{{\\\"Key\\\":\\\"{"[0-9a-f]{32}"}\\\",\\\"GroupKey\\\":\\\"{"[0-9a-f]{32}"}\\\",\\\"FromUrl\\\":\\\"\\\",\\\"RoomIndex\\\":{"[0-9]{1,5}"},\\\"Check\\\":\\\"{"[0-9a-f]{32}"}\\\",\\\"WebSocketID\\\":{"[0-9]{1,10}"},\\\"PlayerName\\\":\\\"{".*"}\\\",\\\"RefererAddr\\\":\\\"{"[0-9a-zA-z]{0,99}"}\\\",\\\"groupMemberCount\\\":{"[0-9]{1,10}"},\\\"c\\\":\\\"{"PlayerAdd_V2"}\\\"\\}}^";
                                                //  Regex rx=new Regex("")
                                                CheckSession checkSession = Newtonsoft.Json.JsonConvert.DeserializeObject<CheckSession>(returnResult.result);
                                                if (string.IsNullOrEmpty(checkSession.session))
                                                {
                                                    s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                                }
                                                else
                                                {
                                                    Regex rg = new Regex(BLL.CheckSessionBLL.RoomInfoRegexPattern);
                                                    Regex regexOfCaptail = new Regex(Team.TeamCaptainInfoRegexPattern);
                                                    Regex regexOfTeamMember = new Regex(Team.TeamMemberInfoRegexPattern);
                                                    if (rg.IsMatch(checkSession.session))
                                                    {
                                                        //  CheckSession checkSession = Newtonsoft.Json.JsonConvert.DeserializeObject<CheckSession>(returnResult.result);
                                                        var checkResult = BLL.CheckSessionBLL.checkIsOK(checkSession, s);
                                                        if (checkResult.CheckOK)
                                                        {
                                                            s.Key = checkResult.Key;
                                                            s.roomIndex = checkResult.roomIndex;
                                                            s.GroupKey = checkResult.GroupKey;
                                                            s = Room.setOnLine(s, connectInfoDetail);
                                                        }
                                                        else
                                                        {
                                                            s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                                        }
                                                    }
                                                    else if (regexOfCaptail.IsMatch(checkSession.session))
                                                    {
                                                        throw new Exception("");
                                                        //{
                                                        //    s = Room.setState(s, connectInfoDetail, LoginState.WaitingToStart);
                                                        //}
                                                        //string command_start;
                                                        //string updateKey;
                                                        //string teamID;
                                                        //var stringGet = Team.checkIsOK(checkSession, s, out command_start, out updateKey, out teamID);
                                                        //if (stringGet == "failed")
                                                        //{
                                                        //    s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                                        //}
                                                        //else
                                                        //{
                                                        //    CommonClass.Command objGet = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(stringGet);
                                                        //    if (objGet.c == "TeamResult")
                                                        //    {
                                                        //        {

                                                        //            var team = Newtonsoft.Json.JsonConvert.DeserializeObject<TeamResult>(stringGet);
                                                        //            Team.UpdateTeammate(team);
                                                        //            bool success;
                                                        //            s = WaitCaptaiCommand(ref returnResult, ref s, command_start, team, playerName, checkSession.RefererAddr, connectInfoDetail, webWsSize, out success);
                                                        //            if (success) { }
                                                        //            else
                                                        //            {
                                                        //                return;
                                                        //            }
                                                        //        }
                                                        //    }
                                                        //    else
                                                        //    {
                                                        //        s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                                        //    }
                                                        //}
                                                    }
                                                    else if (regexOfTeamMember.IsMatch(checkSession.session))
                                                    {
                                                        throw new Exception("");

                                                        //s = Room.setState(s, connectInfoDetail, LoginState.WaitingToGetTeam);
                                                        //string command_start;
                                                        //string updateKey;
                                                        //string teamID;
                                                        //var stringGet = Team.checkIsOK(checkSession, s, out command_start, out updateKey, out teamID);
                                                        //if (stringGet == "failed")
                                                        //{
                                                        //    s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                                        //}
                                                        //else
                                                        //{
                                                        //    TeamJoin tj = Newtonsoft.Json.JsonConvert.DeserializeObject<TeamJoin>(stringGet);
                                                        //    s = AfterFindTeam("ok", ref s, tj.CommandStart, tj.UpdateKey, teamID, connectInfoDetail);
                                                        //}


                                                    }
                                                    else
                                                    {
                                                        s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                                    }
                                                }
                                            }
                                        }; break;
                                    case "JoinGameSingle":
                                        {
                                            JoinGameSingle joinType = Newtonsoft.Json.JsonConvert.DeserializeObject<JoinGameSingle>(returnResult.result);
                                            if (s.Ls == LoginState.selectSingleTeamJoin)
                                            {
                                                s.JoinGameSingle_Success = false;
                                                s = Room.GetRoomThenStart(s, connectInfoDetail, playerName, joinType.RefererAddr, 1);
                                                //if (s == null)
                                                //{
                                                //    break;
                                                //}
                                                if (!s.JoinGameSingle_Success)
                                                {
                                                    needToExitWhle = true;
                                                }
                                            }
                                        }; break;
                                    case "QueryReward":
                                        {
                                            throw new Exception("");
                                            //if (s.Ls == LoginState.selectSingleTeamJoin)
                                            //{
                                            //    s = Room.setState(s, connectInfoDetail, LoginState.QueryReward);
                                            //}
                                        }; break;
                                    case "RewardBuildingShow":
                                        {
                                            throw new Exception("");
                                            //if (s.Ls == LoginState.QueryReward)
                                            //{
                                            //    CommonClass.ModelTranstraction.RewardBuildingShow rbs = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.ModelTranstraction.RewardBuildingShow>(returnResult.result);
                                            //    var dataCount = Room.RewardBuildingShowF(s, connectInfoDetail, rbs);
                                            //}
                                        }; break;
                                    case "QueryRewardCancle":
                                        {
                                            throw new Exception("");
                                            //if (s.Ls == LoginState.QueryReward)
                                            //{
                                            //    s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                            //}
                                        }; break;
                                    case "CreateTeam":
                                        {
                                            //CreateTeam ct = Newtonsoft.Json.JsonConvert.DeserializeObject<CreateTeam>(returnResult.result);
                                            //if (s.Ls == LoginState.selectSingleTeamJoin)
                                            //{
                                            //    {
                                            //        string command_start;
                                            //        CommonClass.TeamResult team;
                                            //        {
                                            //            s = Room.setState(s, connectInfoDetail, LoginState.WaitingToStart);
                                            //        }
                                            //        {
                                            //            //
                                            //            command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID);
                                            //            team = Team.createTeam2(s.WebsocketID, playerName, command_start);
                                            //            Team.WriteSession(team, connectInfoDetail);


                                            //        }

                                            //        {
                                            //            bool success;
                                            //            s = WaitCaptaiCommand(ref returnResult, ref s, command_start, team, playerName, ct.RefererAddr, connectInfoDetail, webWsSize, out success);

                                            //            if (success) { }
                                            //            else { return; }
                                            //            //var command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID); 
                                            //            //returnResult = ReceiveStringAsync(connectInfoDetail, webWsSize);

                                            //            //wResult = returnResult.wr;
                                            //            //if (returnResult.result == command_start)
                                            //            //{
                                            //            //    s = Room.GetRoomThenStartAfterCreateTeam(s, connectInfoDetail, team, playerName, ct.RefererAddr);
                                            //            //}
                                            //            //else if (returnResult.result == command_start + "exit")
                                            //            //{
                                            //            //    s = Room.CancelAfterCreateTeam(s, connectInfoDetail, team, playerName, ct.RefererAddr);
                                            //            //}
                                            //            //else
                                            //            //{
                                            //            //    return;
                                            //            //}
                                            //        }
                                            //    }
                                            //}
                                        }; break;
                                    case "JoinTeam":
                                        {
                                            //JoinTeam ct = Newtonsoft.Json.JsonConvert.DeserializeObject<JoinTeam>(returnResult.result);
                                            //if (s.Ls == LoginState.selectSingleTeamJoin)
                                            //{
                                            //    {
                                            //        string command_start;
                                            //        {
                                            //            //将状态设置为等待开始和等待加入
                                            //            s = Room.setState(s, connectInfoDetail, LoginState.WaitingToGetTeam);
                                            //        }
                                            //        {
                                            //            returnResult = ReceiveStringAsync(connectInfoDetail, webWsSize);
                                            //            if (returnResult.wr == null)
                                            //            {
                                            //                break;
                                            //            }
                                            //            wResult = returnResult.wr;
                                            //            var teamID = returnResult.result;
                                            //            command_start = CommonClass.Random.GetMD5HashFromStr(s.WebsocketID.ToString() + s.WebsocketID + DateTime.Now.ToString());
                                            //            string updateKey;
                                            //            var result = Team.findTeam2(s.WebsocketID, playerName, command_start, teamID, out updateKey);
                                            //            //if (result == "ok")
                                            //            //{
                                            //            //    Team.WriteSession(teamID, updateKey, connectInfoDetail);
                                            //            //}
                                            //            s = AfterFindTeam(result, ref s, command_start, updateKey, teamID, connectInfoDetail);
                                            //            //if (result == "ok")
                                            //            //{
                                            //            //    s.CommandStart = command_start;
                                            //            //    s.teamID = teamID;
                                            //            //    Team.WriteSession(teamID, connectInfoDetail);
                                            //            //}
                                            //            //else if (result == "game has begun")
                                            //            //{
                                            //            //    s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                            //            //    Room.Alert(connectInfoDetail, $"他们已经开始了！");
                                            //            //}
                                            //            //else if (result == "is not number")
                                            //            //{
                                            //            //    s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                            //            //    Room.Alert(connectInfoDetail, $"请输入数字");
                                            //            //}
                                            //            //else if (result == "not has the team")
                                            //            //{
                                            //            //    s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                            //            //    Room.Alert(connectInfoDetail, $"没有该队伍({teamID})");
                                            //            //}
                                            //            //else if (result == "team is full")
                                            //            //{
                                            //            //    s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                            //            //    Room.Alert(connectInfoDetail, "该队伍已满员");
                                            //            //}
                                            //            //else if (result == "need to back")
                                            //            //{
                                            //            //    s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                            //            //}
                                            //            //else
                                            //            //{
                                            //            //    s = Room.setState(s, connectInfoDetail, LoginState.selectSingleTeamJoin);
                                            //            //}
                                            //        }
                                            //    }
                                            //}
                                        }; break;


                                    case "SetCarsName":
                                        {
                                            //if (s.Ls == LoginState.selectSingleTeamJoin)
                                            //{
                                            //    SetCarsName setCarsName = Newtonsoft.Json.JsonConvert.DeserializeObject<SetCarsName>(returnResult.result);
                                            //    for (var i = 0; i < 5; i++)
                                            //    {
                                            //        if (!string.IsNullOrEmpty(setCarsName.Names[i]))
                                            //        {
                                            //            if (setCarsName.Names[i].Trim().Length >= 2 && setCarsName.Names[i].Trim().Length < 7)
                                            //            {
                                            //                carsNames[i] = setCarsName.Names[i].Trim();
                                            //            }
                                            //        }
                                            //    }
                                            //}
                                        }; break;
                                    case "LookForBuildings":
                                        {
                                            //LookForBuildings joinType = Newtonsoft.Json.JsonConvert.DeserializeObject<LookForBuildings>(returnResult.result);
                                            //if (s.Ls == LoginState.OnLine)
                                            //{

                                            //    s = Room.setState(s, connectInfoDetail, LoginState.LookForBuildings);
                                            //    s = Room.receiveState2(s, joinType, connectInfoDetail);
                                            //    // s = await Room.GetAllModelPosition(s, webSocket);
                                            //    // s = await Room.receiveState(s, webSocket);
                                            //}
                                        }; break;
                                    case "GetRewardFromBuildings":
                                        {

                                            ///*
                                            // * 求福
                                            // */
                                            //GetRewardFromBuildings grfb = Newtonsoft.Json.JsonConvert.DeserializeObject<GetRewardFromBuildings>(returnResult.result);
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    s = Room.GetRewardFromBuildingF(s, grfb, connectInfoDetail);
                                            //}

                                        }; break;
                                    case "CancleLookForBuildings":
                                        {
                                            //CancleLookForBuildings cancle = Newtonsoft.Json.JsonConvert.DeserializeObject<CancleLookForBuildings>(returnResult.result);

                                            //if (s.Ls == LoginState.LookForBuildings)
                                            //{
                                            //    s = Room.setState(s, connectInfoDetail, LoginState.OnLine);
                                            //}
                                        }; break;
                                    case "GetCarsName":
                                        {
                                            //if (s.Ls == LoginState.selectSingleTeamJoin)
                                            //{
                                            //    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "GetCarsName", names = carsNames });
                                            //    CommonF.SendData(msg, connectInfoDetail, 0);
                                            //    //var sendData = Encoding.UTF8.GetBytes(msg);
                                            //    //await webSocket.SendAsync(new ArraySegment<byte>(sendData, 0, sendData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                                            //}
                                        }; break;
                                    case "SetPlayerName":
                                        {
                                            //if (s.Ls == LoginState.selectSingleTeamJoin)
                                            //{
                                            //    var regex = new Regex("^[\u4e00-\u9fa5]{1}[a-zA-Z0-9\u4e00-\u9fa5]{1,8}$");

                                            //    SetPlayerName setPlayerName = Newtonsoft.Json.JsonConvert.DeserializeObject<SetPlayerName>(returnResult.result);
                                            //    if (regex.IsMatch(setPlayerName.Name))
                                            //    {
                                            //        playerName = setPlayerName.Name;
                                            //        var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "SetPlayerNameSuccess", playerName = playerName });
                                            //    }
                                            //}
                                        }; break;
                                    case "GetName":
                                        {
                                            //if (s.Ls == LoginState.selectSingleTeamJoin)

                                            //{
                                            //    var msg = Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "GetName", name = playerName });
                                            //    CommonF.SendData(msg, connectInfoDetail, 0);
                                            //}
                                        }; break;
                                    case "Promote":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    Promote promote = Newtonsoft.Json.JsonConvert.DeserializeObject<Promote>(returnResult.result);
                                            //    Room.setPromote(s, promote);
                                            //}
                                        }; break;
                                    case "Collect":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    Collect collect = Newtonsoft.Json.JsonConvert.DeserializeObject<Collect>(returnResult.result);
                                            //    Room.setCollect(s, collect);
                                            //}
                                        }; break;
                                    case "Attack":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    Attack attack = Newtonsoft.Json.JsonConvert.DeserializeObject<Attack>(returnResult.result);
                                            //    Room.setAttack(s, attack);
                                            //}
                                        }; break;
                                    case "Tax":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    Tax tax = Newtonsoft.Json.JsonConvert.DeserializeObject<Tax>(returnResult.result);
                                            //    Room.setToCollectTax(s, tax);
                                            //}
                                        }; break;
                                    case "Msg":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    Msg msg = Newtonsoft.Json.JsonConvert.DeserializeObject<Msg>(returnResult.result);
                                            //    if (msg.MsgPass.Length < 120)
                                            //    {
                                            //        Room.passMsg(s, msg);
                                            //    }
                                            //}
                                        }; break;
                                    //case "Ability":
                                    //    {
                                    //        if (s.Ls == LoginState.OnLine)
                                    //        {
                                    //            Ability a = Newtonsoft.Json.JsonConvert.DeserializeObject<Ability>(returnResult.result);
                                    //            Room.setCarAbility(s, a);
                                    //        }
                                    //    }; break;
                                    case "SetCarReturn":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    SetCarReturn scr = Newtonsoft.Json.JsonConvert.DeserializeObject<SetCarReturn>(returnResult.result);
                                            //    Room.setCarReturn(s, scr);
                                            //}
                                        }; break;
                                    case "Donate":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    Donate donate = Newtonsoft.Json.JsonConvert.DeserializeObject<Donate>(returnResult.result);
                                            //    Room.Donate(s, donate);
                                            //}
                                        }; break;
                                    case "GetSubsidize":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    GetSubsidize getSubsidize = Newtonsoft.Json.JsonConvert.DeserializeObject<GetSubsidize>(returnResult.result);
                                            //    Room.GetSubsidize(s, getSubsidize);
                                            //}
                                        }; break;
                                    case "OrderToSubsidize":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    GetSubsidize getSubsidize = Newtonsoft.Json.JsonConvert.DeserializeObject<GetSubsidize>(returnResult.result);
                                            //    Room.GetSubsidize(s, getSubsidize);
                                            //}
                                        }; break;
                                    case "Bust":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    Bust bust = Newtonsoft.Json.JsonConvert.DeserializeObject<Bust>(returnResult.result);
                                            //    Room.setBust(s, bust);
                                            //}
                                        }; break;
                                    case "BuyDiamond":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    //BuyDiamond bd = Newtonsoft.Json.JsonConvert.DeserializeObject<BuyDiamond>(returnResult.result);
                                            //    //await Room.buyDiamond(s, bd);
                                            //}
                                        }; break;
                                    case "SellDiamond":
                                        {
                                            //if (s.Ls == LoginState.OnLine)
                                            //{
                                            //    //BuyDiamond bd = Newtonsoft.Json.JsonConvert.DeserializeObject<BuyDiamond>(returnResult.result);
                                            //    //await Room.sellDiamond(s, bd);
                                            //}
                                        }; break;
                                    case "DriverSelect":
                                        {

                                        }; break;
                                    case "Skill1":
                                        {

                                        }; break;
                                    case "Skill2":
                                        {

                                        }; break;
                                    case "ViewAngle":
                                        {

                                        }; break;
                                    case "GetBuildings":
                                        {

                                        }; break;
                                    case "GenerateAgreement":
                                        {

                                        }; break;
                                    case "GenerateAgreementBetweenTwo":
                                        {

                                        }; break;
                                    case "ModelTransSign":
                                        {

                                        }; break;
                                    case "ModelTransSignWhenTrade":
                                        {

                                        }; break;
                                    case "RewardPublicSign":
                                        {

                                        }; break;
                                    case "CheckCarState":
                                        {

                                        }; break;
                                    //getResistance
                                    case "GetResistance":
                                        {

                                        }; break;
                                    case "TakeApart":
                                        {

                                        }; break;
                                    case "UpdateLevel":
                                        {

                                        }; break;
                                    case "AllBusinessAddr"://AllBusinessAddr
                                        {

                                        }; break;
                                    case "AllStockAddr":
                                        {

                                        }; break;
                                    case "GenerateRewardAgreement":
                                        {

                                        }; break;
                                    case "RewardInfomation":
                                        {

                                        }; break;
                                    case "RewardApply":
                                        {

                                        }; break;
                                    case "AwardsGiving":
                                        {

                                        }; break;
                                    case "Guid":
                                        {

                                        }; break;
                                    case "QueryGuid":
                                        {

                                        }; break;
                                    case "BindWordInfo":
                                        {

                                        }; break;
                                    case "ChargingLookFor":
                                        {

                                        }; break;
                                    case "ScoreTransferLookFor":
                                        {

                                        }; break;
                                    case "ScoreTransferRecordMark":
                                        {

                                        }; break;
                                    case "LookForBindInfo":
                                        {

                                        }; break;
                                    case "GetFightSituation":
                                        {

                                        }; break;
                                    case "GetTaskCopy":
                                        {

                                        }; break;
                                    case "RemoveTaskCopy":
                                        {

                                        }; break;
                                    case "Exit":
                                        {

                                        }; break;
                                    case "GetOnLineState":
                                        {

                                        }; break;
                                    case "SmallMapClick":
                                        {

                                        }; break;
                                    case "NotWantToGoNeedToBack":
                                        {

                                        }; break;
                                    case "GoToDoCollectOrPromote":
                                        {

                                        }; break;
                                    case "BradCastWhereToGoInSmallMap":
                                        {

                                        }; break;
                                    case "LeaveTeam":
                                        {
                                            //这里有必要，防止上面执行完，下面执行，直接跳入default
                                        }
                                        ; break;
                                    case "TeamNumWithSecret":
                                        {
                                            //这里有必要，防止上面执行完，下面执行，直接跳入default
                                        }
                                        ; break;
                                    case "SetNextPlace":
                                        {

                                        }; break;
                                    case "SetGroupLive":
                                        {

                                        }; break;
                                    case "AskWhichToSelect":
                                        {

                                        }; break;
                                    case "RequstToSaveInFile":
                                        {

                                        }; break;
                                    case "TurnOnBeginnerMode":
                                        {

                                        }; break;
                                    case "AgreeTheTransaction":
                                        {

                                        }; break;
                                    case "CancleTheTransaction":
                                        {

                                        }; break;
                                    case "ScoreTransaction":
                                        {

                                        }; break;
                                    default:
                                        {
                                            // Console.WriteLine(returnResult.result);
                                            removeWs(s.WebsocketID);
                                            Room.setOffLine(ref s);
                                            return;
                                        };
                                }
                            }
                        }
                        catch (Exception e)
                        {
                            removeWs(s.WebsocketID);
                            Room.setOffLine(ref s);
                            if (returnResult == null) { }
                            else
                            {

                                //   CommonClass.Command c = Newtonsoft.Json.JsonConvert.DeserializeObject<CommonClass.Command>(returnResult.result);
                                File.WriteAllText($"Error{DateTime.Now.ToString("yyyyMMddHHmmssffff")}.txt", returnResult.result);
#warning 这里用log做记录
                                // throw e;
                            }
                        }
                }
                while (!wResult.CloseStatus.HasValue);
                removeWs(s.WebsocketID);
                Room.setOffLine(ref s);
                return;
            };
        }

        public class ReceiveObj
        {
            public WebSocketReceiveResult wr { get; set; }
            public string result { get; set; }
        }
        public static ReceiveObj ReceiveStringAsync(ConnectInfo.ConnectInfoDetail connectInfoDetail, CancellationToken ct = default(CancellationToken))
        {
            return ReceiveStringAsync(connectInfoDetail, webWsSize, ct);
        }
        public static ReceiveObj ReceiveStringAsync(ConnectInfo.ConnectInfoDetail connectInfoDetail, int size, CancellationToken ct = default(CancellationToken))
        {
            try
            {
                var buffer = new ArraySegment<byte>(new byte[size]);
                WebSocketReceiveResult result;
                using (var ms = new MemoryStream())
                {
                    do
                    {
                        // ct.IsCancellationRequested
                        ct.ThrowIfCancellationRequested();

                        var t1 = connectInfoDetail.ws.ReceiveAsync(buffer, ct);
                        result = t1.GetAwaiter().GetResult();

                        ms.Write(buffer.Array, buffer.Offset, result.Count);
                    }
                    while (!result.EndOfMessage);

                    ms.Seek(0, SeekOrigin.Begin);
                    if (result.MessageType != WebSocketMessageType.Text)
                    {
                        return new ReceiveObj()
                        {
                            result = null,
                            wr = result
                        };
                    }
                    using (var reader = new StreamReader(ms, Encoding.UTF8))
                    {
                        var t2 = reader.ReadToEndAsync();

                        var strValue = t2.GetAwaiter().GetResult();//await reader.ReadToEndAsync();
                        return new ReceiveObj()
                        {
                            result = strValue,
                            wr = result
                        };
                    }
                }
            }
            catch
            {
                return new ReceiveObj()
                {
                    result = null,
                    wr = null
                };
            }
        }


        private static ConnectInfo.ConnectInfoDetail addWs(System.Net.WebSockets.WebSocket webSocket, int websocketID)
        {
            lock (ConnectInfo.connectedWs_LockObj)
            {
                ConnectInfo.connectedWs.Add(websocketID, new ConnectInfo.ConnectInfoDetail(webSocket, websocketID));
                return ConnectInfo.connectedWs[websocketID];
            }
        }

        private static void removeWsIsNotOnline()
        {
            lock (ConnectInfo.connectedWs_LockObj)
            {
                List<int> keys = new List<int>();

                foreach (var item in ConnectInfo.connectedWs)
                {
                    if (item.Value.ws.CloseStatus.HasValue)
                    {
                        keys.Add(item.Key);
                    }
                }
                for (int i = 0; i < keys.Count; i++)
                {
                    ConnectInfo.connectedWs.Remove(keys[i]);
                }
            }
        }

        private static void removeWs(int websocketID)
        {
            try
            {
                lock (ConnectInfo.connectedWs_LockObj)
                {
                    if (ConnectInfo.connectedWs.ContainsKey(websocketID))
                    {
                        var ws = ConnectInfo.connectedWs[websocketID].ws;
                        if (ws.State == WebSocketState.Open)
                            ws.Dispose();
                        ConnectInfo.connectedWs.Remove(websocketID);
                    }
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
