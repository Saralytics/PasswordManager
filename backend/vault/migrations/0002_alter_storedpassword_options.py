# Generated by Django 3.2.25 on 2024-03-24 14:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vault', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='storedpassword',
            options={'ordering': ['website']},
        ),
    ]
