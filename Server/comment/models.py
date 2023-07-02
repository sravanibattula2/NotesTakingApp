from django.db import models


# Create your models here.
class Comment(models.Model):
    start_index = models.IntegerField()
    length = models.IntegerField()
    text = models.CharField(max_length=200)
