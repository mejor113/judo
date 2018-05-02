from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import viewsets

from models import Task
from serializers import TaskSerializer


class RootTemplate(TemplateView):
    template_name = 'todo/index.html'


class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer