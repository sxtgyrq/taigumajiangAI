using HouseMahjong.GroupClassF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HouseMahjong.RoomMainF
{
    public abstract class RoomMainBaseData
    {
        /// <summary>
        /// 随机数生产器
        /// </summary>
        public System.Random rm;

        /// <summary>
        /// 操作锁！
        /// </summary>
        //public object PlayerLock = new object();

        /// <summary>
        /// 玩家字典
        /// </summary>
        public Dictionary<string, GroupClass> _Groups;
    }
}
