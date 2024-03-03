using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace HouseMahjong.GroupClassF
{
    public class GroupClass
    {
        public string GroupKey { get; private set; }
        RoomMainF.RoomMain that;
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
            //  this._PlayerInGroup = new Dictionary<string, Player>();
            //  this.Money = 0;
            //this.startTime = DateTime.Now;
            //this.countOfAskRoad = 0;
            //this.taskFineshedTime = new Dictionary<bool, DateTime>();
            //this.recordErrorMsgs = new Dictionary<string, string>();
            //this.records = new Dictionary<string, bool>();

            //  this.groupAbility = new Dictionary<string, int>()

            //this.DataFileSaved = false;
        }
    }
}
