from django.db import models

import json
import datetime
import decimal

# Create your models here.
class BalanceHistory(models.Model) :
    log_day = models.DateField(auto_now_add=True)
    balance = models.DecimalField(max_digits=30, decimal_places=20)
    thold = models.DecimalField(max_digits=30, decimal_places=20)
    hashes = models.IntegerField()
    difficulty = models.DecimalField(max_digits=30, decimal_places=20)
    update_time = models.DateTimeField()
    class Meta :
        ordering = ['-update_time']


class ExchangeHistory(models.Model) :
    log_time = models.DateTimeField(auto_now_add=True)
    xmr_cny = models.DecimalField(max_digits=30, decimal_places=20)
    xmr_btc = models.DecimalField(max_digits=30, decimal_places=20)
    btc_cny = models.DecimalField(max_digits=30, decimal_places=20)
    class Meta :
        ordering = ['-log_time']


class BotHistory(models.Model) :
    log_time = models.DateTimeField(auto_now_add=True)
    address = models.TextField(max_length=100)
    expired = models.IntegerField()
    hashes = models.IntegerField()
    hashrate = models.DecimalField(max_digits=30, decimal_places=20)
    last_share = models.DateTimeField()
    class Meta :
        ordering = ['-log_time']