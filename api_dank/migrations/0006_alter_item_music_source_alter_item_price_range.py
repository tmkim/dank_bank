# Generated by Django 5.1.4 on 2024-12-26 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_dank', '0005_alter_item_address_alter_item_artist_alter_item_cost_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='music_source',
            field=models.CharField(choices=[('', None), ('SC', 'SoundCloud'), ('SP', 'Spotify'), ('YT', 'YouTube')], default=''),
        ),
        migrations.AlterField(
            model_name='item',
            name='price_range',
            field=models.CharField(choices=[('', None), ('1', '$'), ('2', '$$'), ('3', '$$$'), ('4', '$$$$'), ('5', '$$$$$')], default=''),
        ),
    ]
