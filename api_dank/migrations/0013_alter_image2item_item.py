# Generated by Django 5.1.4 on 2025-02-11 22:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_dank', '0012_alter_item_address_alter_item_artist_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image2item',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_dank.item'),
        ),
    ]
