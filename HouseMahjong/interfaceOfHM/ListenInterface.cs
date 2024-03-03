using CommonClass;
using HouseMahjong.GroupClassF;
using HouseMahjong.RoomMainF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HouseMahjong.RoomMainF.RoomMain;

namespace HouseMahjong.interfaceOfHM
{
    internal interface ListenInterface
    {
        /// <summary>
        /// 新增玩家
        /// </summary>
        /// <param name="addItem"></param>
        /// <returns></returns>
        string AddPlayer(PlayerAdd_V2 addItem, RoomMain rm);
        GetPositionResult GetPosition(GetPosition getPosition);
        string PositionSelectToServerF(PositionSelectToServer psts);
        string StartPositionSelectToServerF(StartPositionSelectToServer? spss);
    }
}
