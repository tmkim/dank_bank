# Generated by Django 5.1.4 on 2025-02-12 21:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api_dank', '0016_remove_image_img_url_image_file'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Image2Item',
            new_name='ItemImages',
        ),
    ]
