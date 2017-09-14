from django.contrib import admin

# Register your models here.

from django.contrib import admin
from monitor.models import BalanceHistory
from monitor.models import ExchangeHistory

admin.site.register(BalanceHistory)
admin.site.register(ExchangeHistory)
