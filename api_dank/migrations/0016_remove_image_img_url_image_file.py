# Generated by Django 5.1.4 on 2025-02-12 00:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_dank', '0015_remove_image_image_variable_image_description_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='image',
            name='img_url',
        ),
        migrations.AddField(
            model_name='image',
            name='file',
            field=models.ImageField(default='', upload_to='images/'),
            preserve_default=False,
        ),
    ]
