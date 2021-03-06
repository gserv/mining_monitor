# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-09-12 02:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0003_auto_20170912_1018'),
    ]

    operations = [
        migrations.AddField(
            model_name='exchangehistory',
            name='btc_cny',
            field=models.DecimalField(decimal_places=20, default=0, max_digits=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='exchangehistory',
            name='xmr_btc',
            field=models.DecimalField(decimal_places=20, default=0, max_digits=30),
            preserve_default=False,
        ),
    ]
