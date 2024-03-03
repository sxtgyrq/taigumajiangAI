using CommonClass;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.WebSockets;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using static HouseMahjong.RoomMainF.RoomMain;

namespace HouseMahjong.GroupClassF
{
    public partial class GroupClass
    {
        internal void PositionSelectToServer(Player player, PositionSelectToServer psts)
        {
            if (player.MState == MahjongState.NeedToSelectDirction && player.PlayerPosition == GroupMemeberPlayer.MahjongPlayerPosition.None && this.groupNumber == 1)
            {
                switch (psts.Position)
                {
                    case "east":
                        {
                            player.PlayerPosition = GroupMemeberPlayer.MahjongPlayerPosition.East;
                        }; break;
                    case "south":
                        {
                            player.PlayerPosition = GroupMemeberPlayer.MahjongPlayerPosition.South;
                        }; break;
                    case "west":
                        {
                            player.PlayerPosition = GroupMemeberPlayer.MahjongPlayerPosition.West;
                        }; break;
                    case "north":
                        {
                            player.PlayerPosition = GroupMemeberPlayer.MahjongPlayerPosition.North;
                        }; break;
                    default:
                        {
                            return;
                        }
                }

                this._PlayerInGroupByPosition.Add(player.PlayerPosition, player);
                var npcKeys = new List<string>();
                foreach (var item in this._PlayerInGroup)
                {
                    if (item.Value.playerType == GroupMemeberPlayerType.PlayerType.NPC)
                    {
                        npcKeys.Add(item.Key);
                    }
                }
                while (this._PlayerInGroupByPosition.Count < 4)
                {
                    var npc = this._PlayerInGroup[npcKeys[that.rm.Next(0, 3)]];
                    if (npc.PlayerPosition == GroupMemeberPlayer.MahjongPlayerPosition.None)
                    {
                        var position = (GroupMemeberPlayer.MahjongPlayerPosition)that.rm.Next(0, 4);
                        if (this._PlayerInGroupByPosition.ContainsKey(position))
                        {
                            continue;
                        }
                        else
                        {
                            npc.PlayerPosition = position;

                            this._PlayerInGroupByPosition.Add(npc.PlayerPosition, npc);
                        }

                    }
                    else
                    {
                        continue;
                    }
                }
                // this.pla
                if (this._PlayerInGroupByPosition.Count == 4 && player.PlayerPosition == this.Manor)
                {
                    player.MState = MahjongState.NeedToGetStartPosition;
                    //var result = new GetPositionResult()
                    //{
                    //    FromUrl = player.FromUrl,
                    //    WebSocketID = player.WebSocketID,
                    //    PlayerName = player.PlayerName,
                    //    Success = true,
                    //    GroupNumber = player.Group.groupNumber,
                    //    Mahjongs = player.mahjongs.ToArray(),
                    //    State = player.MState,
                    //    PlayerPosition = player.PlayerPosition,
                    //    GroupManor = this.Manor
                    //};
                    CommonClass.GetPositionNotify_v2 notify = new CommonClass.GetPositionNotify_v2()
                    {
                        c = "GetPositionNotify_v2",
                        WebSocketID = player.WebSocketID,
                        key = player.Key,
                        PlayerName = player.PlayerName,
                        AsynSend = false, //这里之所以要同步发送，是因为刷新的时候不报错！,
                        groupNumber = player.Group.groupNumber,
                        Mahjongs = player.mahjongs.ToArray(),
                        MahjongState = player.MState.ToString().Trim(),
                        Position = player.PlayerPosition.ToString(),

                    };

                    Startup.sendSingleMsg(player.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));
                    //var notifyMsgs = new List<string>();
                    //notifyMsgs.Add(player.FromUrl);
                    //notifyMsgs.Add();
                    //  Startup.sendSingleMsg(player.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));
                }

            }
            //  throw new NotImplementedException();
        }

        internal void StartPositionSelectToServerF(Player player, StartPositionSelectToServer spss)
        {
            if (player.MState == MahjongState.NeedToGetStartPosition && player.PlayerPosition != GroupMemeberPlayer.MahjongPlayerPosition.None && this.groupNumber == 1)
            {
                if (this.Manor == player.PlayerPosition)
                {

                    var number1 = 2;// that.rm.Next(1, 7);
                    var number2 = 2; //that.rm.Next(1, 7);

                    Console.WriteLine($"丢骰子的结果为{number1}与{number2}");

                    //player.MState= MahjongState.need


                    if ((number1 + number2 - 1) % 4 == 0)
                    {
                        //**需要自己再次丢
                        //  player.MState = MahjongState.
                    }
                    else
                    {
                        player.MState = MahjongState.NeedToWait;
                        this._dicePoint[0] = number1;
                        this._dicePoint[1] = number2;
                        this._dicePoint[2] = 0;
                        this._dicePoint[3] = 0;
                        Thread.Sleep(5 * 1000);
                        {
                            /*
                             * 第一次丢骰子
                             */
                            CommonClass.GetPositionNotify_v2 notify = new CommonClass.GetPositionNotify_v2()
                            {
                                c = "GetPositionNotify_v2",
                                WebSocketID = player.WebSocketID,
                                key = player.Key,
                                PlayerName = player.PlayerName,
                                AsynSend = false, //这里之所以要同步发送，是因为刷新的时候不报错！,
                                groupNumber = player.Group.groupNumber,
                                Mahjongs = player.mahjongs.ToArray(),
                                MahjongState = player.MState.ToString().Trim(),
                                Position = player.PlayerPosition.ToString(),
                                dicePoint = this.DicePoint.ToArray(),
                                Manor = this.Manor.ToString(),
                                diceRotating = false
                            };

                            Startup.sendSingleMsg(player.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));
                        }
                        Thread.Sleep(5 * 1000);
                        {
                            /*
                            * 别的NPC开始丢骰子
                            */
                            CommonClass.GetPositionNotify_v2 notify = new CommonClass.GetPositionNotify_v2()
                            {
                                c = "GetPositionNotify_v2",
                                WebSocketID = player.WebSocketID,
                                key = player.Key,
                                PlayerName = player.PlayerName,
                                AsynSend = false, //这里之所以要同步发送，是因为刷新的时候不报错！,
                                groupNumber = player.Group.groupNumber,
                                Mahjongs = player.mahjongs.ToArray(),
                                MahjongState = player.MState.ToString().Trim(),
                                Position = player.PlayerPosition.ToString(),
                                dicePoint = this.DicePoint.ToArray(),
                                Manor = this.Manor.ToString(),
                                diceRotating = true
                            };
                            Startup.sendSingleMsg(player.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));

                        }
                        Thread.Sleep(10 * 1000);
                        {
                            /*
                             * 别的NPC结束丢骰子
                             */
                            number1 = that.rm.Next(1, 7);
                            number2 = that.rm.Next(1, 7);
                            Console.WriteLine($"二次丢骰子的结果为{number1}与{number2}");
                            this._dicePoint[2] = number1;
                            this._dicePoint[3] = number2;
                            CommonClass.GetPositionNotify_v2 notify = new CommonClass.GetPositionNotify_v2()
                            {
                                c = "GetPositionNotify_v2",
                                WebSocketID = player.WebSocketID,
                                key = player.Key,
                                PlayerName = player.PlayerName,
                                AsynSend = false, //这里之所以要同步发送，是因为刷新的时候不报错！,
                                groupNumber = player.Group.groupNumber,
                                Mahjongs = player.mahjongs.ToArray(),
                                MahjongState = player.MState.ToString().Trim(),
                                Position = player.PlayerPosition.ToString(),
                                dicePoint = this.DicePoint.ToArray(),
                                Manor = this.Manor.ToString(),
                                diceRotating = false
                            };
                            Startup.sendSingleMsg(player.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));
                        }
                        Thread.Sleep(10 * 1000);
                        StartToSort();
                        StartToGetMahjongs();
                    }
                }
                else
                {

                }
            }
            //  throw new NotImplementedException();
        }

        private void StartToSort()
        {
            List<int> indexValue = new List<int>();
            // Dictionary<int, int> mahjongsDic = new Dictionary<int, int>();
            for (int i = 0; i < mahjongsArray.Length; i++)
            {
                indexValue.Add(i);
                // mahjongsDic.Add(i, mahjongsArray[i]);
            }
            var timeNow = DateTime.Now;
            indexValue = indexValue.OrderBy(item => CommonClass.Random.GetMD5HashFromStr($"{timeNow.ToString("yyyyMMddHHmmss")}{item}")).ToList();
            this.currentMahjongArray = new List<int>();
            Console.WriteLine($"麻将顺序");
            for (int i = 0; i < mahjongsArray.Length; i++)
            {
                this.currentMahjongArray.Add(mahjongsArray[indexValue[i]]);
                Console.Write($"{mahjongsArray[indexValue[i]]} ");
            }
            this.startPosition = (((this.DicePoint[0] + this.DicePoint[1] - 1 - (int)this.Manor + 4) % 4) * 34 + (this.DicePoint[0] + this.DicePoint[1] + this.DicePoint[2] + this.DicePoint[3]) * 2 + 136) % 136;
            this.currentPositon = this.startPosition + 0;
            // this.currentMahjongArray=this.mahjongsArray.ToList().order
        }
        int startPosition = 0;
        public int StartPosition { get { return this.startPosition; } }

        int currentPositon = 0;
        public int CurrentPositon { get { return this.currentPositon; } }

        private void StartToGetMahjongs()
        {
            this._CurrentPlayerNeetToOp = this.Manor;
            for (int i = 0; i < 3; i++)
            {
                for (var index = (int)this.Manor; index < 4; index++)
                {

                    var role = this._PlayerInGroupByPosition[(GroupMemeberPlayer.MahjongPlayerPosition)(index % 4)];

                    for (int j = 0; j < 4; j++)
                    {
                        role.GetHahjongSingle(ref this.currentPositon, this.currentMahjongArray, false);
                    }
                    // this._PlayerInGroupByPosition[index]
                }
            }
            for (var index = (int)this.Manor; index < 4; index++)
            {

                var role = this._PlayerInGroupByPosition[(GroupMemeberPlayer.MahjongPlayerPosition)(index % 4)];
                role.GetHahjongSingle(ref this.currentPositon, this.currentMahjongArray, false);
            }
            {
                var role = this._PlayerInGroupByPosition[this._CurrentPlayerNeetToOp];
                role.GetHahjongSingle(ref this.currentPositon, this.currentMahjongArray, true);
            }
            //for(int i=)
            // throw new NotImplementedException();
        }
    }
}
