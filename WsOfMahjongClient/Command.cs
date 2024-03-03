using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WsOfMahjongClient
{
    //internal class Command
    //{
    //}
    public class CheckSession : CommonClass.Command
    {
        public string session { get; set; }
        public string RefererAddr { get; set; }
    }

    public class JoinGameSingle : CommonClass.Command
    {
        public string RefererAddr { get; set; }
    }

    public class PositionSelect : CommonClass.Command 
    {
        public string Position { get; set; }
    }

    public class StartPositionSelect : CommonClass.Command 
    {

    }
}
