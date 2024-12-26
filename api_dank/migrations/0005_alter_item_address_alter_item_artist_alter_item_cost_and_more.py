# Generated by Django 5.1.4 on 2024-12-26 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_dank', '0004_item_remove_image2item_music_remove_tag2item_music_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='address',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='artist',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='cost',
            field=models.DecimalField(decimal_places=2, max_digits=14, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='cuisine',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='gmap_url',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='item_url',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='location',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='music_meta',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='music_source',
            field=models.CharField(choices=[('', 'N/A'), ('SC', 'SoundCloud'), ('SP', 'Spotify'), ('YT', 'YouTube')], default=''),
        ),
        migrations.AlterField(
            model_name='item',
            name='price_range',
            field=models.CharField(choices=[('', ''), ('1', '$'), ('2', '$$'), ('3', '$$$'), ('4', '$$$$'), ('5', '$$$$$')], default=''),
        ),
    ]