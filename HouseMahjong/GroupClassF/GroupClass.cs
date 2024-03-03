using CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace HouseMahjong.GroupClassF
{
    public partial class GroupClass
    {
        public string GroupKey { get; private set; }
        RoomMainF.RoomMain that;
        List<int> _dicePoint = new List<int>(4) { 0, 0, 0, 0 };
        public List<int> DicePoint
        {
            get
            {
                return new List<int>(4) { _dicePoint[0], _dicePoint[1], _dicePoint[2], _dicePoint[3] };
            }
        }
        int[] mahjongsArray = {
            01, 01, 01, 01,//1饼
            02, 02, 02, 02,
            03, 03, 03, 03,
            04, 04, 04, 04,
            05, 05, 05, 05,
            06, 06, 06, 06,
            07, 07, 07, 07,
            08, 08, 08, 08,
            09, 09, 09, 09,//9饼
            11,11,11,11,//1条，幺鸡
            12,12,12,12,
            13,13,13,13,
            14,14,14,14,
            15,15,15,15,
            16,16,16,16,
            17,17,17,17,
            18,18,18,18,
            19,19,19,19,//9条
            21,21,21,21,//1万
            22,22,22,22,
            23,23,23,23,
            24,24,24,24,
            25,25,25,25,
            26,26,26,26,
            27,27,27,27,
            28,28,28,28,
            29,29,29,29,//9万
            40,40,40,40,//东
            47,47,47,47,//南
            54,54,54,54,//西
            61,61,61,61,//北
            68,68,68,68,//中
            75,75,75,75,//发
            82,82,82,82//白

        };// mahjongsNotSorted = new List<int> { 0, 0 };
        List<int> currentMahjongArray;
        public GroupClass(string gkey, RoomMainF.RoomMain roomMain)
        {
            //  _collectPosition = new Dictionary<int, int>();
            GroupKey = gkey;
            //this.PlayerLock_ = new LockObj()
            //{
            //    IsUsing = false,
            //    ThreadName = ""
            //};
            that = roomMain;
            this._PlayerInGroup = new Dictionary<string, GroupMemeberPlayer>();
            this._PlayerInGroupByPosition = new Dictionary<GroupMemeberPlayer.MahjongPlayerPosition, GroupMemeberPlayer>();
            this.Manor = GroupMemeberPlayer.MahjongPlayerPosition.East;
            this._dicePoint = new List<int>(4) { 0, 0, 0, 0 };
            //  this.Money = 0;
            //this.startTime = DateTime.Now;
            //this.countOfAskRoad = 0;
            //this.taskFineshedTime = new Dictionary<bool, DateTime>();
            //this.recordErrorMsgs = new Dictionary<string, string>();
            //this.records = new Dictionary<string, bool>();

            //  this.groupAbility = new Dictionary<string, int>()

            //this.DataFileSaved = false;
        }

        /// <summary>
        /// 表征group里有多少人！
        /// </summary>
        public int groupNumber { get { return this._groupNumber; } }



        int _groupNumber;
        public void SetGroupNumber(int input)
        {
            this._groupNumber = input;
        }

        internal void AddPlayer(PlayerAdd_V2 addItem)
        {
            {
                var newPlayer = new Player()
                {
                    rm = that,
                    Key = addItem.Key,
                    FromUrl = addItem.FromUrl,
                    WebSocketID = addItem.WebSocketID,
                    PlayerName = addItem.PlayerName,

                    CreateTime = DateTime.Now,
                    ActiveTime = DateTime.Now,
                    //RefererAddr = addItem.RefererAddr,
                    //RefererCount = 0,
                    Group = this,
                    mahjongs = new List<int>(),
                    MState = MahjongState.NeedToSelectDirction,
                    playerType = GroupMemeberPlayerType.PlayerType.player,
                    PlayerPosition = GroupMemeberPlayer.MahjongPlayerPosition.None
                };
                this._PlayerInGroup.Add(newPlayer.Key, newPlayer);

            }
        }

        internal void AddNPC(string baseKey, int indexValue)
        {
            {
                var newNPC = new NPC()
                {
                    Key = CommonClass.Random.GetMD5HashFromStr(baseKey + DateTime.Now.ToString("yyyyMMddHHmmssffff") + indexValue),
                    rm = that,
                    CreateTime = DateTime.Now,
                    ActiveTime = DateTime.Now,
                    Group = this,
                    mahjongs = new List<int>(),
                    playerType = GroupMemeberPlayerType.PlayerType.NPC,
                    MState = MahjongState.NeedToWait,
                    PlayerName = $"NPC{indexValue + 1}",
                    PlayerPosition = GroupMemeberPlayer.MahjongPlayerPosition.None
                };
                this._PlayerInGroup.Add(newNPC.Key, newNPC);

            }
        }



        public Dictionary<string, GroupMemeberPlayer> _PlayerInGroup { get; set; }
        public Dictionary<GroupMemeberPlayer.MahjongPlayerPosition, GroupMemeberPlayer> _PlayerInGroupByPosition { get; set; }
        public GroupMemeberPlayer.MahjongPlayerPosition Manor { get; private set; }
        GroupMemeberPlayer.MahjongPlayerPosition _CurrentPlayerNeetToOp { get; set; }
    }


}
