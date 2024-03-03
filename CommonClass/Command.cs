using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CommonClass
{
    public class Command
    {
        public string c { get; set; }
    }
    public class TeamResult : Command
    {
        public string FromUrl { get; set; }
        public int WebSocketID { get; set; }
        /// <summary>
        /// 作为队伍的索引
        /// </summary>
        public int TeamNumber { get; set; }
        public int Hash { get; set; }

        /// <summary>
        /// 主要作用是web前台断开重新连接而用！再MateWsAndHouse赋值，并返回。
        /// </summary>
        public string UpdateKey { get; set; }
    }

    public class TeamCreate : Command
    {
        public string FromUrl { get; set; }
        public string CommandStart { get; set; }
        public int WebSocketID { get; set; }
        public string PlayerName { get; set; }
        public string GroupKey { get; set; }
        public string UpdateKey { get; set; }

    }

    public class PlayerAdd_V2 : Command
    {
        public string Key { get; set; }
        public string GroupKey { get; set; }
        public string FromUrl { get; set; }
        public int RoomIndex { get; set; }

        public string Check { get; set; }
        public int WebSocketID { get; set; }
        public string PlayerName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string RefererAddr { get; set; }
        public int groupMemberCount { get; set; }
    }

    public class TeamBegain : Command
    {
        public int TeamNum { get; set; }
        public int RoomIndex { get; set; }
        public string GroupKey { get; set; }
    }

    public class TeamJoin : Command
    {
        public string FromUrl { get; set; }
        public string CommandStart { get; set; }
        public int WebSocketID { get; set; }
        public string PlayerName { get; set; }
        public string TeamIndex { get; set; }
        public string Guid { get; set; }
        public string UpdateKey { get; set; }
    }

    public class LeaveTeam : Command
    {
        public string FromUrl { get; set; }
        public int WebSocketID { get; set; }
        public string TeamIndex { get; set; }
    }

    public class TeamExit : Command
    {
        public int TeamNum { get; set; }
    }

    public class CheckMembersIsAllOnLine : Command
    {
        public int TeamNumber { get; set; }
    }

    public class TeamMemberCount : Command
    {
        public int TeamNum { get; set; }
        //public int GroupKey { get; set; }
    }

    public class TeamUpdate : Command
    {
        public string FromUrl { get; set; }
        public int WebSocketID { get; set; }

        public int TeamNumber { get; set; }
        public string UpdateKey { get; set; }
        public string CommandStart { get; set; }
    }

    public class UpdateTeammateOfCaptal : Command
    {
        public int TeamNumber { get; set; }
    }


    public class CommandNotify : Command
    {
        public int WebSocketID { get; set; }
        //   public int TimeOut { get; set; }


        /*
         * 之所以引入此变量，是因为在2023年8月3日
         * 发现，一个路口在距离完成路径终点很近时，
         * 发生了传输数据的顺序颠倒，导致前台程序，
         * 不能正常运行。
         * 以上没有进行debug，只是推测。
         * 所以引入了AsynSend变量。顾名思义，异步
         * 发送。
         * 当传输BradCastAnimateOfOthersCar4对象时，
         * 所以引入了AsynSend=false
         */
        /// <summary>
        /// 是否异步发送
        /// </summary>
        public bool AsynSend { get; set; } = true;
    }

    public class GetFrequency : Command
    {
    }

    public class GetPosition : Command
    {
        public string Key { get; set; }
        public string GroupKey { get; set; }
    }

    public class PlayerCheck : PlayerAdd_V2 { }

    public class GetPositionNotify_v2 : CommandNotify
    {
        public string key { get; set; }
        public string PlayerName { get; set; }
        public int groupNumber { get; set; }
        public int[] Mahjongs { get; set; }
        public string MahjongState { get; set; }
        public string Position { get; set; }
        public int[] dicePoint { get; set; }
        public string Manor { get; set; }
        public bool diceRotating { get; set; }
        public int StartPosition { get; set; }
        public int CurrentPositon { get; set; }
    }

    public class PositionSelectToServer : Command
    {
        public string Key { get; set; }
        public string GroupKey { get; set; }
        public string Position { get; set; }
    }

    public class StartPositionSelectToServer : Command
    {
        public string Key { get; set; }
        public string GroupKey { get; set; }
    }
}
