from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Task(models.Model):
    description = models.CharField(max_length=60, blank=False)
    date = models.DateField(null=True, default="")
    done = models.BooleanField(default=False)

    class Meta:
        verbose_name = ("Task")
        verbose_name_plural = ("Tasks")