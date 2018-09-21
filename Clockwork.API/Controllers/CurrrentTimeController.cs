using System;
using Microsoft.AspNetCore.Mvc;
using Clockwork.API.Models;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using TimeZoneConverter;

namespace Clockwork.API.Controllers
{
    [Route("api/[controller]")]
    public class CurrentTimeController : Controller
    {
        private readonly ClockworkContext _clockworkContext;

        public CurrentTimeController(ClockworkContext clockworkContext)
        {
            _clockworkContext = clockworkContext;
        }

        // Get api/currenttime
        [HttpGet]
        public async Task<OkObjectResult> Get(CancellationToken token)
        {
            var queriedTimes = await _clockworkContext.CurrentTimeQueries.OrderByDescending(t => t.CurrentTimeQueryId).ToListAsync(token);
            return Ok(queriedTimes);
        }

        // Post api/currenttime
        [HttpPost]
        public OkResult Post([FromBody]string timeZoneId)
        {
            var utcTime = DateTime.UtcNow;
            var requestedTime = TimeZoneInfo.ConvertTimeFromUtc(utcTime, TZConvert.GetTimeZoneInfo(timeZoneId));
            var ip = this.HttpContext.Connection.RemoteIpAddress.ToString();

            var queriedTime = new CurrentTimeQuery
            {
                UTCTime = utcTime,
                ClientIp = ip,
                Time = requestedTime,
                TimeZoneId = timeZoneId
            };

            _clockworkContext.CurrentTimeQueries.Add(queriedTime);
            var count = _clockworkContext.SaveChanges();
            Console.WriteLine("{0} records saved to database", count);

            Console.WriteLine();
            foreach (var CurrentTimeQuery in _clockworkContext.CurrentTimeQueries)
            {
                Console.WriteLine(" - {0}", CurrentTimeQuery.UTCTime);
            }

            return Ok();
        }
    }
}
