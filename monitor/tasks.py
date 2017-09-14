
import schedule
import time, threading
import requests
import json
import datetime, pytz, django.utils
import logging

from monitor.configure import configure
from monitor.models import BalanceHistory
from monitor.models import ExchangeHistory
from monitor.models import BotHistory


logger = logging.getLogger("tasks")

def loadDifficulty():
    stateResp = requests.request("GET", "http://stats.minexmr.com/stats")
    stateRespContent = stateResp.text
    logger.info("recv state response >> " + stateRespContent)
    stateObj = json.loads(stateRespContent)
    #
    hashRate = 1    # 计算1H的算力计算单位时间内收益
    time = 86400    # 24小时
    return (stateObj['network']['reward'] / configure.coinUnits / (stateObj['network']['difficulty'] / hashRate / time))

def loadExchange(type):
    # see: https://data.bter.com/api2
    exchangeResp = requests.request("GET", "http://data.bter.com/api2/1/ticker/" + type)
    exchangeRespContent = exchangeResp.text
    logger.info("recv exchange["+type+"] response >> " + exchangeRespContent)
    exchangeObj = json.loads(exchangeRespContent)
    exchange = exchangeObj['last']
    return exchange

def exchangeScanJob():
    xmr_cny = loadExchange('xmr_cny')
    xmr_btc = loadExchange('xmr_btc')
    btc_cny = loadExchange('btc_cny')
    #
    ExchangeHistory.objects.create(xmr_cny=xmr_cny, xmr_btc=xmr_btc, btc_cny=btc_cny).save()


def balanceScanJob():
    balanceResp = requests.request("GET", "http://api.minexmr.com:8080/stats_address?address="+configure.address+"&longpoll=true")
    balanceRespContent = balanceResp.text
    logger.info("recv balance response >> " + balanceRespContent)
    balanceObj = json.loads(balanceRespContent)
    #
    balance = float(balanceObj["stats"]["balance"]) / configure.coinUnits
    thold = float(balanceObj["stats"]["thold"]) / configure.coinUnits
    hashes = int(balanceObj["stats"]["hashes"])
    ttime = datetime.datetime.now()
    difficulty = loadDifficulty()
    logger.info("scan data >> balance["+str(balance)+"], thold["+str(thold)+"], hashes["+str(hashes)+"], difficulty["
                +str(difficulty)+"]")
    #
    rsObjs = BalanceHistory.objects.filter(log_day=ttime.strftime("%Y-%m-%d"), balance=balance)
    if len(rsObjs) <= 0:
        logger.debug("create ...")
        obj = BalanceHistory.objects.create(
            log_day=ttime.strftime("%Y-%m-%d"), balance=balance, thold=thold,
            hashes=hashes, difficulty=difficulty,
            update_time=datetime.datetime.now())
        obj.save()
    else:
        logger.debug("update ...")
        BalanceHistory.objects.filter(log_day=ttime.strftime("%Y-%m-%d"), balance=balance).update(
            balance=balance, thold=thold, hashes=hashes, difficulty=difficulty,
            update_time=datetime.datetime.now())


def botScanJob():
    botResp = requests.request("GET", "http://api.minexmr.com:8080/get_wid_stats?address="+configure.address)
    botRespContent = botResp.text
    logger.info("recv bot response >> " + botRespContent)
    botObj = json.loads(botRespContent)
    now = datetime.datetime.now()
    #
    for item in botObj :
        for suffix in configure.botsSuffix :
            if item["address"].endswith(suffix) :
                BotHistory.objects.create(log_time=now, address=item["address"], expired=item["expired"], hashes=item["hashes"],
                                          hashrate=item["hashrate"], last_share=datetime.datetime.fromtimestamp(float(item['lastShare']))).save()
            else :
                print("[bot status] pass address > " + item["address"])


# 设置定时调度
schedule.every(1).minutes.do(exchangeScanJob)
schedule.every(1).minutes.do(botScanJob)
schedule.every(10).minutes.do(balanceScanJob)



# 新线程执行的代码:
def scheduleThread():
    logger.info("schedule thread start ...")
    try:
        logger.info("run job first start ...")
        # 首次执行
        exchangeScanJob()
        botScanJob()
        balanceScanJob()
    except Exception as err:
        logger.warning("schedule job run exception >> ", err)
    # 定时调度循环
    while True:
        try:
            schedule.run_pending()
        except Exception as err:
            logger.warning("schedule job run exception >> ", err)
        time.sleep(1)

t = threading.Thread(target=scheduleThread, name='ScheduleThread')
t.start()

