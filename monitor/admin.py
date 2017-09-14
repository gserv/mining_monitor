from django.contrib import admin

# Register your models here.

from django.contrib import admin
from monitor.models import BalanceHistory
from monitor.models import ExchangeHistory
from monitor.models import BotHistory

admin.site.register(BalanceHistory)
admin.site.register(ExchangeHistory)
admin.site.register(BotHistory)
