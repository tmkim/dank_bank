# Generated by Django 5.1.4 on 2025-02-27 21:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_dank', '0023_selectoption'),
    ]

    operations = [
        migrations.AlterField(
            model_name='selectoption',
            name='name',
            field=models.CharField(blank=True, default='', max_length=200, unique=True),
        ),
    ]
