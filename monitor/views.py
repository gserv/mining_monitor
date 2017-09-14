from django.shortcuts import render
from django.http import HttpResponse

import json
import decimal
from django.core import serializers

# other init
import monitor.setup

import datetime

from monitor.models import BalanceHistory
from monitor.models import ExchangeHistory

class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime.datetime):
            return o.isoformat()
        elif isinstance(o, datetime.date):
            return o.isoformat()
        elif isinstance(o, decimal.Decimal):
            return str(o)
        return json.JSONEncoder.default(self, o)


# Create your views here.
def balance(request) :
    rs = BalanceHistory.objects.all().order_by("-update_time")[:52560]
    raw_data = serializers.serialize("python", rs)
    # now extract the inner `fields` dicts
    actual_data = [d['fields'] for d in raw_data]
    return HttpResponse(json.dumps(actual_data, cls=DateTimeEncoder))

def exchange(request):
    rs = ExchangeHistory.objects.all().order_by("-log_time")[:10080]
    raw_data = serializers.serialize("python", rs)
    # now extract the inner `fields` dicts
    actual_data = [d['fields'] for d in raw_data]
    return HttpResponse(json.dumps(actual_data, cls=DateTimeEncoder))

