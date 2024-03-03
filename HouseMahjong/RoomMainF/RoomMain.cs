using CommonClass;
using HouseMahjong.GroupClassF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HouseMahjong.RoomMainF
{
    public class RoomMain : RoomMainBaseData, interfaceOfHM.ListenInterface
    {
        public RoomMain()
        {
            this.rm = new System.Random(DateTime.Now.GetHashCode());
            {
                this._Groups = new Dictionary<string, GroupClass>();
                //    this._FpOwner = new Dictionary<int, string>();
                //this._PlayerFp = new Dictionary<string, int>();
            }
        }
        public string AddPlayer(PlayerAdd_V2 addItem, RoomMain rm)
        {
            // throw new Exception("");



            //  bool success;

            List<string> carsState = new List<string>();

            //  lock (this.PlayerLock)
            {
                addItem.Key = addItem.Key.Trim();
                addItem.GroupKey = addItem.GroupKey.Trim();
                if (string.IsNullOrEmpty(addItem.GroupKey) || string.IsNullOrEmpty(addItem.Key))
                {
                    return "ng";
                }
                else if (this._Groups.ContainsKey(addItem.GroupKey))
                {
                    // success = false;
                    GroupClassF.GroupClass group;
                    group = this._Groups[addItem.GroupKey];
                    if (group._PlayerInGroup.Count < group.groupNumber && group._PlayerInGroup.Count == 4)
                    {
                        throw new Exception("");
                        group.AddPlayer(addItem);
                        return "ok";
                    }
                    else
                        return "ng";
                }
                else if (addItem.groupMemberCount == 1)
                {
                    GroupClassF.GroupClass group;
                    group = new GroupClassF.GroupClass(addItem.GroupKey, this);
                    //  lock (group.PlayerLock_)
                    {
                        //  group.LookFor(gp);
                        group.SetGroupNumber(addItem.groupMemberCount);
                        //group.groupNumber = addItem.groupMemberCount;
                        group.AddPlayer(addItem);
                        for (int i = 0; i < 3; i++)
                        {
                            group.AddNPC(addItem.GroupKey, i);
                        }
                        this._Groups.Add(addItem.GroupKey, group);
                    }
                }

            }
            //if (success)
            {

                return "ok";
            }
            //else
            //{
            //    return "ng";
            //}

            //  throw new NotImplementedException();
        }

        public GetPositionResult GetPosition(GetPosition getPosition)
        {
            GetPositionResult result;

            //  int OpenMore = -1;//第一次打开？
            var notifyMsgs = new List<string>();
            GroupClassF.GroupClass gc = null;
            //   lock (this.PlayerLock)
            {
                if (string.IsNullOrEmpty(getPosition.GroupKey))
                {
                    gc = null;
                }
                else if (this._Groups.ContainsKey(getPosition.GroupKey))
                {
                    gc = this._Groups[getPosition.GroupKey];
                }
            }
            if (gc != null)
            {
                // lock (gc.PlayerLock)
                {
                    if (gc._PlayerInGroup.ContainsKey(getPosition.Key))
                    {
                        if (gc._PlayerInGroup[getPosition.Key].playerType == GroupMemeberPlayerType.PlayerType.player)
                        {
                            var player = (Player)gc._PlayerInGroup[getPosition.Key];
                            var fromUrl = player.FromUrl;
                            var webSocketID = player.WebSocketID;
                            var playerName = gc._PlayerInGroup[getPosition.Key].PlayerName;

                            result = new GetPositionResult()
                            {
                                FromUrl = fromUrl,
                                WebSocketID = webSocketID,
                                PlayerName = playerName,
                                Success = true,
                                GroupNumber = gc._PlayerInGroup[getPosition.Key].Group.groupNumber,
                                Mahjongs = gc._PlayerInGroup[getPosition.Key].mahjongs.ToArray(),
                                State = gc._PlayerInGroup[getPosition.Key].MState,
                                PlayerPosition = gc._PlayerInGroup[getPosition.Key].PlayerPosition
                            };
                        }
                        else
                            result = new GetPositionResult()
                            {
                                Success = false
                            };
                    }
                    else
                    {
                        result = new GetPositionResult()
                        {
                            Success = false
                        };
                    }
                }
            }
            else
            {
                result = new GetPositionResult()
                {
                    Success = false
                };
            }

            return result;
        }

        public string PositionSelectToServerF(PositionSelectToServer psts)
        {
            var notifyMsgs = new List<string>();
            GroupClassF.GroupClass gc = null;
            //   lock (this.PlayerLock)
            {
                if (string.IsNullOrEmpty(psts.GroupKey))
                {
                    gc = null;
                }
                else if (this._Groups.ContainsKey(psts.GroupKey))
                {
                    gc = this._Groups[psts.GroupKey];
                }
            }
            if (gc != null)
            {
                {
                    if (gc._PlayerInGroup.ContainsKey(psts.Key))
                    {
                        if (gc._PlayerInGroup[psts.Key].playerType == GroupMemeberPlayerType.PlayerType.player)
                        {
                            var player = (Player)gc._PlayerInGroup[psts.Key];
                            gc.PositionSelectToServer(player, psts);

                            return "ok";
                        }
                        else
                        {
                            return "ng";
                        }
                    }
                    else
                    {
                        return "ng";
                    }
                }
            }
            else
            {
                return "ng";
            }
        }

        public string StartPositionSelectToServerF(StartPositionSelectToServer spss)
        {
            //  var notifyMsgs = new List<string>();
            GroupClassF.GroupClass gc = null;
            //   lock (this.PlayerLock)
            {
                if (string.IsNullOrEmpty(spss.GroupKey))
                {
                    gc = null;
                }
                else if (this._Groups.ContainsKey(spss.GroupKey))
                {
                    gc = this._Groups[spss.GroupKey];
                }
            }
            if (gc != null)
            {
                {
                    if (gc._PlayerInGroup.ContainsKey(spss.Key))
                    {
                        if (gc._PlayerInGroup[spss.Key].playerType == GroupMemeberPlayerType.PlayerType.player)
                        {
                            var player = (Player)gc._PlayerInGroup[spss.Key];
                            gc.StartPositionSelectToServerF(player, spss);

                            return "ok";
                        }
                        else
                        {
                            return "ng";
                        }
                    }
                    else
                    {
                        return "ng";
                    }
                }
            }
            else
            {
                return "ng";
            }
        }

        public class GetPositionResult
        {
            public bool Success { get; set; }
            public string FromUrl { get; set; }
            public int WebSocketID { get; set; }
            public MahjongState State { get; set; }
            public int[] Mahjongs { get; set; }
            public string PlayerName { get; set; }
            public int GroupNumber { get; set; }
            public GroupMemeberPlayer.MahjongPlayerPosition PlayerPosition { get; set; }
            public GroupMemeberPlayer.MahjongPlayerPosition GroupManor { get; set; }
        }

    }
}
