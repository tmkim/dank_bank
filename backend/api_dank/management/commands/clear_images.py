from django.core.management.base import BaseCommand
from api_dank.models import Image  # Update with your actual app name and model

class Command(BaseCommand):
    help = 'Clears all entries in the Image table'

    def handle(self, *args, **kwargs):
        # Delete all records from the Image table
        deleted_count, _ = Image.objects.all().delete()
        self.stdout.write(f'Successfully deleted {deleted_count} images.')
