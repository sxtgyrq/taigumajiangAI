using CommonClass;
using HouseMahjong.GroupClassF;
using HouseMahjong.RoomMainF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HouseMahjong.GroupMemeberPlayer;
using static HouseMahjong.GroupMemeberPlayerType;

namespace HouseMahjong
{
    public enum MahjongState
    {
        /// <summary>
        /// 单人模式需要选择东南西北
        /// </summary>
        NeedToSelectDirction = 0,//单人模式需要选择东南西北
        NeedToAppoint = 1,
        /// <summary>
        /// 需要通过丢骰子，来确定棋牌的其实东北西南，顺时针。
        /// </summary>
        NeedToGetStartPosition = 2,//需要通过丢骰子，来确定棋牌的其实东南西北
        /// <summary>
        /// 需要通过丢骰子，来确定起牌的起始位置
        /// </summary>
        NeedToGetStartCount = 3,
        /// <summary>
        /// 准备出牌
        /// </summary>
        NeedToPlayAHand = 4, NeedToWait
    }
    public interface GroupMemeberPlayerType
    {
        public enum PlayerType { NPC, player }
        public PlayerType playerType { get; }


    }
    public abstract class GroupMemeberPlayer : GroupMemeberPlayerType
    {
        public RoomMain rm;

        /// <summary>
        /// 是一个3*168
        /// 第一行0,1,2,3,4,0代表没有出牌，1代表自己，2代表下家，3代表对家，4代表上家
        /// 第二行0代表没动作，1代表来排，2代表出牌，3代表碰，4代表杠，5代表听
        /// 第三行0代表位置牌，1-9代表万，11-19代表条，21-29代表饼，40，50，60，70，80，90，100
        /// </summary>
        public List<int> mahjongs;


        public string PlayerName { get; internal set; }

        public DateTime CreateTime { get; internal set; }
        public DateTime ActiveTime { get; internal set; }

        public GroupClass Group { get; set; }
        public MahjongState MState { get; set; }
        public string Key { get; set; }

        public PlayerType playerType { get; set; }

        public enum MahjongPlayerPosition
        {
            East = 0,
            South = 1,
            West = 2,
            North = 3,
            None = 4,
        }
        public MahjongPlayerPosition PlayerPosition { get; set; }

        internal void GetHahjongSingle(ref int currentPositon, List<int> currentMahjongArray, bool show)
        {
            this.mahjongs.Add(1);//代表自己
            this.mahjongs.Add(1);//代表来排
            this.mahjongs.Add(currentMahjongArray[currentPositon]);

            currentPositon++;
            currentPositon = currentPositon % 136;
            if (this.playerType == PlayerType.player && show)
            {
                var player = (Player)this;
                player.BroadCastMahjongGotton();
                //CommonClass.GetPositionNotify_v2 notify = new CommonClass.GetPositionNotify_v2()
                //{
                //    c = "GetPositionNotify_v2",
                //    WebSocketID = this.we,
                //    key = getPosition.Key,
                //    PlayerName = GPResult.PlayerName,
                //    AsynSend = false, //这里之所以要同步发送，是因为刷新的时候不报错！,
                //    groupNumber = GPResult.GroupNumber,
                //    Mahjongs = GPResult.Mahjongs,
                //    MahjongState = GPResult.State.ToString().Trim(),
                //    Position = GPResult.PlayerPosition.ToString(),
                //};

                //Startup.sendSingleMsg(GPResult.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));
            }
            // throw new NotImplementedException();
        }
    }

    public class Player : GroupMemeberPlayer, GroupMemeberPlayerType
    {
        public string FromUrl { get; set; }
        public int WebSocketID { get; set; }

        internal void BroadCastMahjongGotton()
        {
            this.MState = MahjongState.NeedToPlayAHand;
            CommonClass.GetPositionNotify_v2 notify = new CommonClass.GetPositionNotify_v2()
            {
                c = "GetPositionNotify_v2",
                WebSocketID = this.WebSocketID,
                key = this.Key,
                PlayerName = this.PlayerName,
                AsynSend = false, //这里之所以要同步发送，是因为刷新的时候不报错！,
                groupNumber = this.Group.groupNumber,
                Mahjongs = this.mahjongs.ToArray(),
                MahjongState = this.MState.ToString(),
                Position = this.PlayerPosition.ToString(),
                dicePoint = this.Group.DicePoint.ToArray(),
                diceRotating = false,
                Manor = this.Group.Manor.ToString(),
                StartPosition = this.Group.StartPosition,
                CurrentPositon = this.Group.CurrentPositon
            };

            Startup.sendSingleMsg(this.FromUrl, Newtonsoft.Json.JsonConvert.SerializeObject(notify));
        }
    }

    public class NPC : GroupMemeberPlayer, GroupMemeberPlayerType
    {
    }
}
