# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2018-05-02 19:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='date',
            field=models.DateField(default='', null=True),
        ),
    ]
